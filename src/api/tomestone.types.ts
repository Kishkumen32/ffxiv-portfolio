export interface TomestoneProfile {
  name: string;
  server: string;
  datacenter: string;
  region: string;
  avatar: string;
  bio: string;
  title: { pre: string; post: string } | string;
  race: string;
  clan: string;
  gender: string;
  nameday: string;
  guardian: string;
  city_state: string;
  grand_company: { name: string; rank: string } | string;
  free_company: { name: string; tag: string } | string;
  job_levels: Record<string, number>;
  gear: Record<string, unknown>;
}

export interface TomestoneActivity {
  id?: string;
  encounter_name?: string;
  fight_name?: string;
  name?: string;
  classification: string;
  start?: string;
  end?: string;
  duration?: number;
  kill?: boolean;
  cleared?: boolean;
  drops?: unknown[];
  party?: number;
  role?: string;
  job: string;
  fight?: number;
  date: string;
  percentile?: number | null;
}

export interface TomestoneProgression {
  name: string;
  date: string;
  encounters_cleared: number;
  total_encounters: number;
  tier?: string;
  expansion?: string;
  encounters?: TomestoneEncounter[];
}

export interface TomestoneEncounter {
  name: string;
  killed?: boolean;
  date?: string | null;
  clears?: number;
}
