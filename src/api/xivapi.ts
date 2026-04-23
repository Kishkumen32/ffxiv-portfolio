export interface XIVAPICharacter {
  Character: {
    ID: number;
    Name: string;
    Server: string;
    DC: string;
    Avatar: string;
    Portrait: string;
    Bio: string;
    Title: number;
    Race: number;
    Tribe: number;
    Gender: number;
    Nameday: string;
    GuardianDeity: number;
    CityState: number;
    GrandCompany: number | null;
    FreeCompanyName: string;
    ClassJobs: XIVAPIClassJob[];
    Achievements: XIVAPIAchievement[];
    Mounts: { Name: string; Icon: string }[];
    Minions: { Name: string; Icon: string }[];
    PlayTime?: number;
  };
}

export interface XIVAPIClassJob {
  JobID: number;
  Level: number;
  ExpLevel: number;
  ExpLevelMax: number;
  ExpLevelTogo: number;
  IsSpecialised: boolean;
  ClassJobParentID: number;
}

export interface XIVAPIAchievement {
  ID: number;
  Name: string;
  Description: string;
  Icon: string;
  Date: number;
  Point: number;
}

export const XIVAPI_BASE = 'https://xivapi.com';

export async function fetchXIVAPICharacter(): Promise<XIVAPICharacter> {
  const key = import.meta.env.VITE_XIVAPI_KEY;
  const params = new URLSearchParams();
  if (key) params.set('key', key);
  params.set('data', 'AC,FR,FC,MIMO');
  const url = `${XIVAPI_BASE}/api/character/26092605?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`XIVAPI fetch failed: ${res.status}`);
  return res.json();
}
