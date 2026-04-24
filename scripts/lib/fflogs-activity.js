import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.resolve(__dirname, '..', 'cache');
const TOKEN_CACHE_PATH = path.join(CACHE_DIR, 'fflogs-token.json');

const FFLOGS_TOKEN_URL = 'https://www.fflogs.com/oauth/token';
const FFLOGS_API_URL = 'https://www.fflogs.com/api/v2/client';
const TOKEN_REFRESH_BUFFER_MS = 60_000;
const RECENT_REPORT_LIMIT = 25;
const REPORT_CONCURRENCY = 5;

function normalizeFightTime(reportStartTime, fightTime) {
  return fightTime < 1_000_000_000_000 ? reportStartTime + fightTime : fightTime;
}

function normalizeName(value) {
  return String(value ?? '').trim().toLowerCase();
}

function getIsoTimestamp(value) {
  return Number.isFinite(value) ? new Date(value).toISOString() : undefined;
}

function getDateString(isoTimestamp, fallbackTime) {
  if (isoTimestamp) {
    return isoTimestamp.slice(0, 10);
  }

  if (Number.isFinite(fallbackTime)) {
    return new Date(fallbackTime).toISOString().slice(0, 10);
  }

  return new Date(0).toISOString().slice(0, 10);
}

function getDurationSeconds(startTime, endTime) {
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) {
    return 0;
  }

  return Math.max(0, Math.round((endTime - startTime) / 1000));
}

function ensureCacheDir() {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function readCachedToken() {
  if (!fs.existsSync(TOKEN_CACHE_PATH)) {
    return null;
  }

  try {
    const cached = JSON.parse(fs.readFileSync(TOKEN_CACHE_PATH, 'utf8'));
    if (
      typeof cached.access_token === 'string' &&
      typeof cached.expires_at === 'number' &&
      cached.expires_at > Date.now() + TOKEN_REFRESH_BUFFER_MS
    ) {
      return cached.access_token;
    }
  } catch {
    return null;
  }

  return null;
}

function writeCachedToken(accessToken, expiresAt) {
  ensureCacheDir();
  fs.writeFileSync(
    TOKEN_CACHE_PATH,
    JSON.stringify({ access_token: accessToken, expires_at: expiresAt }, null, 2),
    'utf8'
  );
}

async function requestAccessToken(clientId, clientSecret) {
  const params = new URLSearchParams({ grant_type: 'client_credentials' });
  const res = await fetch(FFLOGS_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!res.ok) {
    throw new Error(`FFLogs OAuth failed: HTTP ${res.status}`);
  }

  const json = await res.json();
  if (!json.access_token) {
    throw new Error('FFLogs OAuth failed: missing access_token');
  }

  const expiresAt = Date.now() + (json.expires_in ?? 3600) * 1000;
  writeCachedToken(json.access_token, expiresAt);
  return json.access_token;
}

async function getAccessToken() {
  const clientId = process.env.FFLOGS_CLIENT_ID;
  const clientSecret = process.env.FFLOGS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('FFLogs credentials not set');
  }

  return readCachedToken() ?? requestAccessToken(clientId, clientSecret);
}

async function runGraphQLQuery(token, query, variables = {}) {
  const res = await fetch(FFLOGS_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`FFLogs API failed: HTTP ${res.status}`);
  }

  const json = await res.json();
  if (Array.isArray(json.errors) && json.errors.length > 0) {
    throw new Error(json.errors.map(error => error.message).join('; '));
  }

  return json.data;
}

async function fetchRecentReports(token, { name, server, region }) {
  const query = `
    query GetReports($name: String!, $server: String!, $region: String!) {
      characterData {
        character(name: $name, serverSlug: $server, serverRegion: $region) {
          recentReports(limit: ${RECENT_REPORT_LIMIT}) {
            data {
              code
              title
              startTime
              endTime
              zone {
                name
              }
            }
          }
        }
      }
    }
  `;

  const data = await runGraphQLQuery(token, query, {
    name,
    server,
    region: String(region ?? '').toUpperCase(),
  });

  return data?.characterData?.character?.recentReports?.data ?? [];
}

async function fetchReportDetails(token, code) {
  const query = `
    query GetFights($code: String!) {
      reportData {
        report(code: $code) {
          fights {
            id
            name
            startTime
            endTime
            kill
            difficulty
            size
            encounterID
          }
          masterData {
            actors {
              name
              subType
            }
          }
        }
      }
    }
  `;

  const data = await runGraphQLQuery(token, query, { code });
  return data?.reportData?.report ?? null;
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const currentIndex = nextIndex;
      nextIndex += 1;

      if (currentIndex >= items.length) {
        return;
      }

      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  const workerCount = Math.min(limit, items.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

function getCharacterJob(actors, characterName) {
  const normalizedCharacterName = normalizeName(characterName);
  const actor = (actors ?? []).find(entry => {
    return normalizeName(entry?.name) === normalizedCharacterName && typeof entry?.subType === 'string';
  });

  return actor?.subType ?? 'Unknown';
}

function normalizeFight(reportCode, reportStartTime, fight, job) {
  const normalizedStartTime = normalizeFightTime(reportStartTime, fight.startTime ?? 0);
  const normalizedEndTime = normalizeFightTime(reportStartTime, fight.endTime ?? normalizedStartTime);
  const start = getIsoTimestamp(normalizedStartTime);
  const end = getIsoTimestamp(normalizedEndTime);
  const fightName = fight.name ?? 'Unknown Fight';

  return {
    id: `${reportCode}:${fight.id}`,
    encounter_name: fightName,
    fight_name: fightName,
    name: fightName,
    classification: 'Battle',
    start,
    end,
    duration: getDurationSeconds(normalizedStartTime, normalizedEndTime),
    kill: Boolean(fight.kill),
    cleared: Boolean(fight.kill),
    drops: [],
    party: typeof fight.size === 'number' ? fight.size : undefined,
    job,
    fight: typeof fight.encounterID === 'number' ? fight.encounterID : undefined,
    date: getDateString(start, reportStartTime),
    percentile: null,
  };
}

export async function fetchFFLogsActivity({ name, server, region }) {
  const token = await getAccessToken();
  const reports = await fetchRecentReports(token, { name, server, region });

  if (!Array.isArray(reports) || reports.length === 0) {
    return [];
  }

  const reportActivities = await mapWithConcurrency(reports, REPORT_CONCURRENCY, async report => {
    try {
      const reportData = await fetchReportDetails(token, report.code);
      if (!reportData || !Array.isArray(reportData.fights)) {
        return [];
      }

      const job = getCharacterJob(reportData.masterData?.actors, name);
      return reportData.fights.map(fight => normalizeFight(report.code, report.startTime, fight, job));
    } catch (error) {
      console.warn(`  ?  FFLogs report ${report.code} failed: ${error.message}`);
      return [];
    }
  });

  return reportActivities
    .flat()
    .sort((left, right) => {
      return Date.parse(right.start ?? '') - Date.parse(left.start ?? '');
    });
}
