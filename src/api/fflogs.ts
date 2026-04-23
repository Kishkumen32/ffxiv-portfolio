export interface FFLogsRanking {
  encounterID: number;
  encounterName: string;
  classID: number;
  specID: number;
  bracketData: number;
  duration: number;
  startTime: number;
  amount: number;
  rank: number;
  outOf: number;
  reportID: string;
  fightID: number;
  difficulty: number;
  size: number;
  ilvlKeyOrZip: number;
  totalKills: number;
  earliestKillTime: number;
  medianPerformance: number;
  bestPerformance: number;
  allStarPoints: number;
}

export const FFLOGS_BASE = 'https://www.fflogs.com/v1';

export async function fetchFFLogsRankings(): Promise<FFLogsRanking[]> {
  const key = import.meta.env.VITE_FFLOGS_API_KEY;
  if (!key) return [];

  const targetUrl = `${FFLOGS_BASE}/rankings/character/Kish%20Baiheur/Siren/na?api_key=${key}`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

  try {
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error(`FFLogs fetch failed: ${res.status}`);
    return res.json();
  } catch {
    return [];
  }
}
