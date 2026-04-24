/**
 * scripts/fetch-data.js
 * Fetches character data from Tomestone + FFLogs at build time (server-to-server).
 * Runs BEFORE the Vite build so data is baked into the bundle.
 *
 * Usage: node scripts/fetch-data.js
 * Environment variables:
 *   TOMESTONE_API_KEY     - Tomestone.gg API key
 *   FFLOGS_CLIENT_ID     - FFLogs OAuth client ID
 *   FFLOGS_CLIENT_SECRET - FFLogs OAuth client secret
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.join(ROOT, 'src', 'data', 'character.json');
const ACHIEVEMENTS_PATH = path.join(ROOT, 'src', 'data', 'achievements.json');
const LODESTONE_ID = '26092605';

const CHARACTER = {
  name: 'Kish Baiheur',
  server: 'Siren',
  region: 'na',
};

const TOMESTONE_BASE = 'https://tomestone.gg/api';
const FFLOGS_TOKEN_URL = 'https://www.fflogs.com/oauth/token';
const FFLOGS_API_URL = 'https://www.fflogs.com/api/v2/client';

// --- Helpers ----------------------------------------------------------------

async function fetchWithRetry(url, options, retries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        const delay = 1000 * Math.pow(2, attempt - 1);
        console.warn(`  Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

async function getFFLogsToken(clientId, clientSecret) {
  const params = new URLSearchParams({ grant_type: 'client_credentials' });
  const res = await fetch(FFLOGS_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  if (!res.ok) throw new Error(`FFLogs OAuth failed: ${res.status}`);
  const json = await res.json();
  return json.access_token;
}

async function fetchFFLogsData(token) {
  const query = `
    query CharacterRankings($name: String!, $serverSlug: String!, $serverRegion: String!) {
      characterData {
        character(name: $name, serverSlug: $serverSlug, serverRegion: $serverRegion) {
          name
          lodestoneID
          server { name }
          totalKills
          rank
          encounterRankings
        }
      }
    }
  `;

  const res = await fetch(FFLOGS_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        name: CHARACTER.name,
        serverSlug: CHARACTER.server,
        serverRegion: 'NA',
      },
    }),
  });

  if (!res.ok) throw new Error(`FFLogs API failed: ${res.status}`);
  const json = await res.json();
  return json.data?.characterData?.character ?? null;
}

// --- Main -----------------------------------------------------------------

async function main() {
  console.log('\n??  Fetching character data...\n');

  const tomestoneKey = process.env.TOMESTONE_API_KEY;
  const fflogsClientId = process.env.FFLOGS_CLIENT_ID;
  const fflogsClientSecret = process.env.FFLOGS_CLIENT_SECRET;

  // Load existing character.json as base (preserves structure + static fallbacks)
  let characterData = {
    profile: { name: CHARACTER.name, server: CHARACTER.server, datacenter: 'Aether', region: 'na', avatar: '', bio: '', title: '', race: '', clan: '', gender: '', nameday: '', guardian: '', city_state: '', grand_company: '', free_company: '', job_levels: {}, gear: {} },
    activity: [],
    progression: [],
    fflogs: null,
    lastUpdated: new Date().toISOString(),
  };

  if (fs.existsSync(OUTPUT_PATH)) {
    try {
      const existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
      characterData = { ...characterData, ...existing };
    } catch {
      console.warn('  Could not parse existing character.json, using defaults.');
    }
  }

  // -- Tomestone: Profile --------------------------------------------------
  if (tomestoneKey) {
    try {
      console.log(' Fetching Tomestone profile...');
      const data = await fetchWithRetry(
        `${TOMESTONE_BASE}/character/profile/${CHARACTER.server}/${CHARACTER.name}`,
        { headers: { Authorization: `Bearer ${tomestoneKey}` } }
      );
      if (data) {
        characterData.profile = {
          name: data.name ?? CHARACTER.name,
          server: data.server ?? CHARACTER.server,
          datacenter: data.datacenter ?? 'Aether',
          region: 'na',
          avatar: data.avatar ?? '',
          bio: data.bio ?? '',
          title: data.title ?? '',
          race: data.race ?? '',
          clan: data.clan ?? '',
          gender: data.gender ?? '',
          nameday: data.nameday ?? '',
          guardian: data.guardian ?? '',
          city_state: data.city_state ?? '',
          grand_company: data.grand_company ?? '',
          free_company: data.free_company ?? '',
          job_levels: data.job_levels ?? {},
          gear: data.gear ?? {},
        };
        console.log(`  ?  Profile: ${data.name} (${data.server})`);
      }
    } catch (err) {
      console.warn(`  ?  Tomestone profile failed: ${err.message}`);
    }
  } else {
    console.warn('  ?  TOMESTONE_API_KEY not set, skipping Tomestone');
  }

  // -- Activity (Tomestone primary, FFLogs fallback) ---------------------
  let activitySource = 'empty';
  characterData.activity = [];

  if (tomestoneKey) {
    try {
      console.log('  Fetching Tomestone activity...');
      const data = await fetchWithRetry(
        `${TOMESTONE_BASE}/character/activity/${CHARACTER.server}/${CHARACTER.name}`,
        { headers: { Authorization: `Bearer ${tomestoneKey}` } }
      );
      if (Array.isArray(data) && data.length > 0) {
        characterData.activity = data.slice(0, 50);
        activitySource = 'tomestone';
        console.log(`  ?  Activity: ${data.length} fights (tomestone)`);
      } else {
        throw new Error('empty array');
      }
    } catch (err) {
      console.warn(`  ?  Tomestone activity failed: ${err.message}, trying FFLogs...`);
    }
  }

  if (activitySource === 'empty' && fflogsClientId && fflogsClientSecret) {
    try {
      console.log('  Fetching FFLogs activity fallback...');
      const { fetchFFLogsActivity } = await import('./lib/fflogs-activity.js');
      const fflogsActivity = await fetchFFLogsActivity({
        name: CHARACTER.name,
        server: CHARACTER.server,
        region: 'NA',
      });
      if (fflogsActivity.length > 0) {
        characterData.activity = fflogsActivity;
        activitySource = 'fflogs fallback';
        console.log(`  ?  Activity: ${fflogsActivity.length} fights (fflogs fallback)`);
      }
    } catch (err) {
      console.warn(`  ?  FFLogs fallback failed: ${err.message}`);
    }
  }

  if (activitySource === 'empty') {
    characterData.activity = [];
    console.warn('  ?  Activity: empty (both failed)');
  }

  // -- Tomestone: Progression ----------------------------------------------
  if (tomestoneKey) {
    try {
      console.log('  Fetching Tomestone progression...');
      const data = await fetchWithRetry(
        `${TOMESTONE_BASE}/character/progression-graph/${CHARACTER.server}/${CHARACTER.name}`,
        { headers: { Authorization: `Bearer ${tomestoneKey}` } }
      );
      if (Array.isArray(data)) {
        characterData.progression = data;
        console.log(`  ?  Progression: ${data.length} encounters`);
      }
    } catch (err) {
      console.warn(`  ?  Tomestone progression failed: ${err.message}`);
    }
  }

  // -- FFLogs --------------------------------------------------------------
  if (fflogsClientId && fflogsClientSecret) {
    try {
      console.log('  Fetching FFLogs token...');
      const token = await getFFLogsToken(fflogsClientId, fflogsClientSecret);

      console.log('  Fetching FFLogs rankings...');
      const fflogsData = await fetchFFLogsData(token);
      if (fflogsData) {
        characterData.fflogs = fflogsData;
        console.log(`  ?  FFLogs: ${fflogsData.totalKills ?? 0} kills, rank ${fflogsData.rank ?? '?'}`);
      }
    } catch (err) {
      console.warn(`  ?  FFLogs failed: ${err.message}`);
    }
  } else {
    console.warn('  ⚠  FFLogs credentials not set, skipping');
  }

  // -- Achievements (XIVAPI primary, Lodestone fallback) -------------------
  let achievementsData = [];
  try {
    const { fetchAchievements } = await import('./lib/achievements.js');
    const xivapiKey = process.env.XIVAPI_API_KEY || undefined;
    achievementsData = await fetchAchievements(LODESTONE_ID, { apiKey: xivapiKey });
  } catch (err) {
    console.warn(`  ⚠  Achievements fetch failed: ${err.message}`);
    if (fs.existsSync(ACHIEVEMENTS_PATH)) {
      try {
        const existing = JSON.parse(fs.readFileSync(ACHIEVEMENTS_PATH, 'utf8'));
        achievementsData = existing.achievements ?? [];
        console.warn(`  ⚠  Keeping ${achievementsData.length} existing achievements`);
      } catch { /* empty */ }
    }
  }

  // -- Write output --------------------------------------------------------
  characterData.lastUpdated = new Date().toISOString();

  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(characterData, null, 2), 'utf8');
  console.log(`\n✅  Data written to src/data/character.json`);
  console.log(`    Last updated: ${characterData.lastUpdated}\n`);

  const achievementsOutput = {
    achievements: achievementsData,
    lastUpdated: new Date().toISOString(),
  };
  fs.writeFileSync(ACHIEVEMENTS_PATH, JSON.stringify(achievementsOutput, null, 2), 'utf8');
  console.log(`✅  Data written to src/data/achievements.json`);
  console.log(`    ${achievementsData.length} achievements, last updated: ${achievementsOutput.lastUpdated}\n`);
}

main().catch(err => {
  console.error('\n?  fetch-data.js failed:', err.message);
  // Don't exit non-zero � we want the build to proceed with stale data
  process.exit(0);
});
