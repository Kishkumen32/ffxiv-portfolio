import { fetchWithRetry } from './fetchWithRetry';

export interface TomestoneProfile {
  name: string;
  server: string;
  datacenter: string;
  region: string;
  avatar: string;
  bio: string;
  title: string;
  race: string;
  clan: string;
  gender: string;
  nameday: string;
  guardian: string;
  city_state: string;
  grand_company: string;
  free_company: string;
  job_levels: Record<string, number>;
  gear: Record<string, unknown>;
}

export interface TomestoneActivity {
  id: string;
  fight_name: string;
  encounter_name: string;
  job: string;
  category: string;
  difficulty: string;
  rank: number | null;
  percentile: number | null;
  date: string;
  duration: string;
  cleared: boolean;
}

export interface TomestoneProgression {
  date: string;
  ilvl: number;
  encounters_cleared: number;
  total_encounters: number;
}

export const TOMESTONE_BASE = 'https://tomestone.gg';

function authHeaders(): Record<string, string> {
  const key = import.meta.env.VITE_TOMESTONE_API_KEY;
  return key ? { Authorization: `Bearer ${key}` } : {};
}

export async function fetchTomestoneProfile(): Promise<TomestoneProfile> {
  const res = await fetchWithRetry(
    `${TOMESTONE_BASE}/api/character/profile/Siren/Kish Baiheur`,
    { headers: authHeaders() },
  );
  return res.json();
}

export async function fetchTomestoneActivity(): Promise<TomestoneActivity[]> {
  const res = await fetchWithRetry(
    `${TOMESTONE_BASE}/api/character/activity/Siren/Kish Baiheur`,
    { headers: authHeaders() },
  );
  return res.json();
}

export async function fetchTomestoneProgression(): Promise<TomestoneProgression[]> {
  const res = await fetchWithRetry(
    `${TOMESTONE_BASE}/api/character/progression-graph/Siren/Kish Baiheur`,
    { headers: authHeaders() },
  );
  return res.json();
}
