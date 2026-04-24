/**
 * scripts/lib/achievements.js
 * Fetches FFXIV achievement data with XIVAPI primary + Lodestone fallback.
 *
 * Primary:   XIVAPI  https://xivapi.com/character/{id}?data=AC
 * Fallback:  Direct Lodestone HTML scraping via linkedom
 * Graceful:  If both fail, returns existing achievements.json data
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const CACHE_DIR = path.resolve(__dirname, '..', 'cache');
const EXISTING_PATH = path.join(ROOT, 'src', 'data', 'achievements.json');

const RATE_LIMIT_MS = 1100;
const MAX_RETRIES = 3;
const LODESTONE_BASE = 'https://na.finalfantasyxiv.com/lodestone/character';

const ACHIEVEMENT_ID_RE = /\/achievement\/detail\/(\d+)\//;
const TIMESTAMP_RE = /ldst_strftime\((\d+)/;
const NAME_RE = /achievement\s+["\u201c](.+?)["\u201d]\s+earned/i;

// --- Helpers ----------------------------------------------------------------

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function cachePath(lodestoneId, page) {
  return path.join(CACHE_DIR, `achievements-${lodestoneId}-p${page}.json`);
}

function readCache(lodestoneId, page) {
  const p = cachePath(lodestoneId, page);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function writeCache(lodestoneId, page, data) {
  ensureCacheDir();
  fs.writeFileSync(cachePath(lodestoneId, page), JSON.stringify(data, null, 2), 'utf8');
}

function readExistingAchievements() {
  if (!fs.existsSync(EXISTING_PATH)) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(EXISTING_PATH, 'utf8'));
    return Array.isArray(raw.achievements) ? raw.achievements : null;
  } catch {
    return null;
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// --- XIVAPI Primary ---------------------------------------------------------

/**
 * Fetch a single page of achievements from XIVAPI.
 * Returns { achievements: [...], pagination: { page, page_next, page_total } }
 */
async function fetchXivapiPage(lodestoneId, page, apiKey) {
  const url = new URL(`https://xivapi.com/character/${lodestoneId}`);
  url.searchParams.set('data', 'AC');
  if (page > 1) url.searchParams.set('page', String(page));
  if (apiKey) url.searchParams.set('private_key', apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`XIVAPI HTTP ${res.status}: ${res.statusText}`);
  }
  const json = await res.json();

  // XIVAPI returns achievements under Achievements.List
  const list = json.Achievements?.List ?? [];
  const pagination = json.Achievements?.Pagination ?? { page: 1, page_next: null, page_total: 1 };

  return {
    achievements: list.map(a => normalizeXivapiAchievement(a)).filter(Boolean),
    pagination,
  };
}

function normalizeXivapiAchievement(raw) {
  if (!raw || typeof raw.ID !== 'number') return null;
  return {
    id: raw.ID,
    name: raw.Name ?? '',
    // XIVAPI returns Obtained as ISO string like "2020-09-27T22:16:53Z"
    obtained: raw.Obtained ?? null,
    timestamp: raw.Obtained ? Math.floor(new Date(raw.Obtained).getTime() / 1000) : null,
  };
}

/**
 * Fetch all achievement pages from XIVAPI with rate limiting and caching.
 */
async function fetchFromXivapi(lodestoneId, apiKey) {
  const allAchievements = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const cached = readCache(lodestoneId, page);
    if (cached && Array.isArray(cached.achievements)) {
      console.log(`    XIVAPI: using cached page ${page}`);
      allAchievements.push(...cached.achievements);
      if (cached.pagination?.page_total) totalPages = cached.pagination.page_total;
      page = (cached.pagination?.page_next) ?? page + 1;
      continue;
    }

    let result;
    let lastError;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        result = await fetchXivapiPage(lodestoneId, page, apiKey);
        break;
      } catch (err) {
        lastError = err;
        if (attempt < MAX_RETRIES) {
          const delay = 2000 * Math.pow(2, attempt - 1);
          console.warn(`    XIVAPI page ${page} attempt ${attempt} failed: ${err.message}, retrying in ${delay}ms...`);
          await sleep(delay);
        }
      }
    }

    if (!result) {
      throw new Error(`XIVAPI page ${page} failed after ${MAX_RETRIES} attempts: ${lastError?.message}`);
    }

    writeCache(lodestoneId, page, result);

    allAchievements.push(...result.achievements);
    if (result.pagination?.page_total) totalPages = result.pagination.page_total;

    console.log(`    XIVAPI: page ${page}/${totalPages} — ${result.achievements.length} achievements`);

    if (result.pagination?.page_next) {
      page = result.pagination.page_next;
      await sleep(RATE_LIMIT_MS);
    } else {
      break;
    }
  }

  return allAchievements;
}

// --- Lodestone Fallback (direct HTML scraping) -----------------------------

async function fetchLodestonePage(lodestoneId, page) {
  const url = `${LODESTONE_BASE}/${lodestoneId}/achievement/${page > 1 ? `?page=${page}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Lodestone HTTP ${res.status}: ${res.statusText}`);
  }
  const html = await res.text();
  const { document } = parseHTML(html).window;

  const entries = document.querySelectorAll('.entry__achievement');
  const achievements = [];

  for (const entry of entries) {
    const href = entry.getAttribute('href') ?? '';
    const idMatch = ACHIEVEMENT_ID_RE.exec(href);
    if (!idMatch) continue;

    const id = Number(idMatch[1]);
    const textContent = entry.textContent ?? '';
    const nameMatch = NAME_RE.exec(textContent);
    const name = nameMatch ? nameMatch[1].trim() : '';

    const scriptContent = entry.querySelector('script')?.textContent ?? '';
    const tsMatch = TIMESTAMP_RE.exec(scriptContent);
    const timestamp = tsMatch ? Number(tsMatch[1]) : null;
    const obtained = timestamp ? new Date(timestamp * 1000).toISOString() : null;

    achievements.push({ id, name, obtained, timestamp });
  }

  const pagerText = document.querySelector('.btn__pager__current')?.textContent ?? '';
  const pageMatch = pagerText.match(/Page\s+(\d+)\s+of\s+(\d+)/);
  const currentPage = pageMatch ? Number(pageMatch[1]) : page;
  const totalPages = pageMatch ? Number(pageMatch[2]) : 1;
  const hasNext = document.querySelector('.btn__pager__next') !== null;

  return {
    achievements,
    pagination: {
      page: currentPage,
      page_next: hasNext ? currentPage + 1 : null,
      page_total: totalPages,
    },
  };
}

async function fetchFromLodestone(lodestoneId) {
  const allAchievements = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const cached = readCache(lodestoneId, page);
    if (cached && cached._source === 'lodestone' && Array.isArray(cached.achievements)) {
      console.log(`    Lodestone: using cached page ${page}`);
      allAchievements.push(...cached.achievements);
      if (cached.pagination?.page_total) totalPages = cached.pagination.page_total;
      page = cached.pagination?.page_next ?? page + 1;
      continue;
    }

    let result;
    let lastError;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        result = await fetchLodestonePage(lodestoneId, page);
        break;
      } catch (err) {
        lastError = err;
        if (attempt < MAX_RETRIES) {
          const delay = 2000 * Math.pow(2, attempt - 1);
          console.warn(`    Lodestone page ${page} attempt ${attempt} failed: ${err.message}, retrying in ${delay}ms...`);
          await sleep(delay);
        }
      }
    }

    if (!result) {
      throw new Error(`Lodestone page ${page} failed after ${MAX_RETRIES} attempts: ${lastError?.message}`);
    }

    writeCache(lodestoneId, page, { _source: 'lodestone', ...result });
    allAchievements.push(...result.achievements);
    if (result.pagination?.page_total) totalPages = result.pagination.page_total;

    console.log(`    Lodestone: page ${page}/${totalPages} — ${result.achievements.length} achievements`);

    if (result.pagination?.page_next) {
      page = result.pagination.page_next;
      await sleep(RATE_LIMIT_MS);
    } else {
      break;
    }
  }

  return allAchievements;
}

// --- Public API -------------------------------------------------------------

/**
 * Fetch achievements for a character with XIVAPI primary + Lodestone fallback.
 *
 * @param {string} lodestoneId - The Lodestone character ID
 * @param {object} [options]
 * @param {string} [options.apiKey] - Optional XIVAPI private key
 * @returns {Promise<Array<{id: number, name: string, obtained: string|null, timestamp: number|null}>>}
 */
export async function fetchAchievements(lodestoneId, options = {}) {
  const { apiKey } = options;

  // --- Primary: XIVAPI ---
  try {
    console.log('  Fetching achievements from XIVAPI...');
    const achievements = await fetchFromXivapi(lodestoneId, apiKey);
    if (achievements.length > 0) {
      console.log(`  ✓ Achievements: ${achievements.length} (XIVAPI)`);
      return achievements;
    }
    console.warn('  ⚠ XIVAPI returned 0 achievements, trying fallback...');
  } catch (err) {
    console.warn(`  ⚠ XIVAPI failed: ${err.message}, trying fallback...`);
  }

  // --- Fallback: Lodestone direct scraping ---
  try {
    console.log('  Fetching achievements from Lodestone fallback...');
    const achievements = await fetchFromLodestone(lodestoneId);
    if (achievements.length > 0) {
      console.log(`  ✓ Achievements: ${achievements.length} (Lodestone)`);
      return achievements;
    }
    console.warn('  ⚠ Lodestone returned 0 achievements');
  } catch (err) {
    console.warn(`  ⚠ Lodestone failed: ${err.message}`);
  }

  // --- Graceful: keep existing data ---
  const existing = readExistingAchievements();
  if (existing && existing.length > 0) {
    console.warn(`  ⚠ Both sources failed, keeping ${existing.length} existing achievements`);
    return existing;
  }

  console.warn('  ⚠ Both sources failed and no existing data — returning empty array');
  return [];
}
