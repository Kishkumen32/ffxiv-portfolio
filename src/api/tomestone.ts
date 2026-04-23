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

export async function fetchTomestoneProfile(): Promise<TomestoneProfile> {
  const key = import.meta.env.VITE_TOMESTONE_API_KEY;
  const res = await fetch(`${TOMESTONE_BASE}/api/character/profile/Siren/Kish Baiheur`, {
    headers: key ? { Authorization: `Bearer ${key}` } : {},
  });
  if (!res.ok) throw new Error(`Tomestone profile fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchTomestoneActivity(): Promise<TomestoneActivity[]> {
  const key = import.meta.env.VITE_TOMESTONE_API_KEY;
  const res = await fetch(`${TOMESTONE_BASE}/api/character/activity/Siren/Kish Baiheur`, {
    headers: key ? { Authorization: `Bearer ${key}` } : {},
  });
  if (!res.ok) throw new Error(`Tomestone activity fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchTomestoneProgression(): Promise<TomestoneProgression[]> {
  const key = import.meta.env.VITE_TOMESTONE_API_KEY;
  const res = await fetch(`${TOMESTONE_BASE}/api/character/progression-graph/Siren/Kish Baiheur`, {
    headers: key ? { Authorization: `Bearer ${key}` } : {},
  });
  if (!res.ok) throw new Error(`Tomestone progression fetch failed: ${res.status}`);
  return res.json();
}
