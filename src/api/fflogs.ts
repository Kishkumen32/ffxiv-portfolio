export interface FFLogsRanking {
  encounterID: number;
  encounterName: string;
  rank: number;
  bestAmount: number;
  totalKills: number;
}

export const FFLOGS_V2_BASE = 'https://www.fflogs.com/api/v2/client';

const CHARACTER_RANKINGS_QUERY = `
query CharacterRankings($name: String!, $server: String!, $region: String!) {
  characterData(name: $name, server: $server, region: $region) {
    character {
      name
      class
      spec
      rankings {
        encounterID
        encounterName
        rank
        bestAmount
        totalKills
      }
    }
  }
}
`;

export async function fetchFFLogsRankings(): Promise<FFLogsRanking[]> {
  const token = import.meta.env.VITE_FFLOGS_TOKEN;
  if (!token) return [];

  const variables = { name: 'Kish Baiheur', server: 'Siren', region: 'na' };

  const fetchOptions: RequestInit = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: CHARACTER_RANKINGS_QUERY,
      variables,
    }),
  };

  const tryFetch = async (url: string): Promise<FFLogsRanking[]> => {
    const res = await fetch(url, fetchOptions);
    if (!res.ok) throw new Error(`FFLogs fetch failed: ${res.status}`);
    const json = await res.json();
    return json?.data?.characterData?.character?.rankings ?? [];
  };

  try {
    return await tryFetch(FFLOGS_V2_BASE);
  } catch {
    // Fallback to allorigins proxy if direct fetch fails (CORS)
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(FFLOGS_V2_BASE)}`;
    try {
      return await tryFetch(proxyUrl);
    } catch {
      return [];
    }
  }
}
