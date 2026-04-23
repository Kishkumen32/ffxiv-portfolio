export const CHARACTER = {
  name: 'Kish Baiheur',
  server: 'Siren',
  datacenter: 'Aether',
  region: 'na',
  lodestoneId: 26092605,
  fflogsId: 20652757,
  mainJob: 'GNB',
  discord: 'kishkumen',
  twitter: '@Kishkumen_',
} as const;

export const JOB_ROLES: Record<string, 'tank' | 'healer' | 'dps' | 'crafter'> = {
  PLD: 'tank', WAR: 'tank', DRK: 'tank', GNB: 'tank',
  WHM: 'healer', SCH: 'healer', AST: 'healer', SGE: 'healer',
  MNK: 'dps', DRG: 'dps', NIN: 'dps', SAM: 'dps', RPR: 'dps', BRD: 'dps', MCH: 'dps', DNC: 'dps', BLM: 'dps', SMN: 'dps', RDM: 'dps', PCT: 'dps', VPR: 'dps',
  CRP: 'crafter', BSM: 'crafter', ARM: 'crafter', GSM: 'crafter', LTW: 'crafter', WVR: 'crafter', ALC: 'crafter', CUL: 'crafter',
  MIN: 'crafter', BOT: 'crafter', FSH: 'crafter',
};

export const JOB_IDS: Record<number, string> = {
  1: 'GLD', 2: 'PGL', 3: 'MRD', 4: 'LNC', 5: 'ARC', 6: 'CNJ', 7: 'THM',
  8: 'CRP', 9: 'BSM', 10: 'ARM', 11: 'GSM', 12: 'LTW', 13: 'WVR', 14: 'ALC', 15: 'CUL',
  16: 'MIN', 17: 'BOT', 18: 'FSH',
  19: 'PLD', 20: 'MNK', 21: 'WAR', 22: 'DRG', 23: 'BRD', 24: 'WHM', 25: 'BLM',
  26: 'ACN', 27: 'SMN', 28: 'SCH', 29: 'ROG', 30: 'NIN', 31: 'MCH', 32: 'DRK',
  33: 'AST', 34: 'SAM', 35: 'RDM', 36: 'BLU', 37: 'GNB', 38: 'DNC',
  39: 'RPR', 40: 'SGE', 41: 'VPR', 42: 'PCT',
};

export const ROLE_COLOR: Record<string, string> = {
  tank: 'var(--role-tank)',
  healer: 'var(--role-healer)',
  dps: 'var(--role-dps)',
  crafter: 'var(--role-crafter)',
};

export const ACHIEVEMENT_CATEGORIES = [
  'Raid', 'Ultimate', 'Criterion', 'Variant', 'Duty', 'Legacy', 'Social', 'Crafting',
] as const;

export type AchievementCategory = (typeof ACHIEVEMENT_CATEGORIES)[number];

export function getPercentileColor(pct: number): string {
  if (pct >= 100) return 'var(--pct-gold)';
  if (pct >= 99) return 'var(--pct-pink)';
  if (pct >= 95) return 'var(--pct-purple)';
  if (pct >= 75) return 'var(--pct-blue)';
  if (pct >= 50) return 'var(--pct-green)';
  return 'var(--pct-grey)';
}

export const FALLBACK_JOB_LEVELS: Record<string, number> = {
  GNB: 100, DRK: 100, WAR: 100, PLD: 100,
  SGE: 100, SCH: 100, WHM: 100, AST: 100,
  SAM: 100, RPR: 100, DRG: 100, NIN: 100,
  VPR: 100, MNK: 100, BLM: 100, SMN: 100,
  RDM: 100, PCT: 100, BRD: 100, MCH: 100, DNC: 100,
  CRP: 100, BSM: 100, ARM: 100, GSM: 100,
  LTW: 100, WVR: 100, ALC: 100, CUL: 100,
  MIN: 100, BOT: 100, FSH: 100,
};

export interface FallbackAchievement {
  id: number;
  name: string;
  description: string;
  category: AchievementCategory;
  date: string;
}

export const FALLBACK_ACHIEVEMENTS: FallbackAchievement[] = [
  { id: 1, name: 'The Legend', description: 'Complete the Dragonsong\'s Reprise Ultimate.', category: 'Ultimate', date: '2023-06-15' },
  { id: 2, name: 'The Omega', description: 'Complete the Omega Protocol Ultimate.', category: 'Ultimate', date: '2024-01-20' },
  { id: 3, name: 'Futures Rewritten', description: 'Complete Futures Rewritten Ultimate.', category: 'Ultimate', date: '2025-03-10' },
  { id: 4, name: 'Savage Conqueror', description: 'Complete all Arcadion Savage raids.', category: 'Raid', date: '2024-07-01' },
  { id: 5, name: 'Savage Raider', description: 'Complete all Anabaseios Savage raids.', category: 'Raid', date: '2023-10-15' },
  { id: 6, name: 'Criterion Champion', description: 'Complete Aloalo Island Criterion (Savage).', category: 'Criterion', date: '2024-04-20' },
  { id: 7, name: 'Variant Explorer', description: 'Complete all Sil\'dihn Subterrane Variant routes.', category: 'Variant', date: '2023-12-01' },
  { id: 8, name: 'Mount Collector', description: 'Obtain 200 mounts.', category: 'Duty', date: '2024-08-01' },
  { id: 9, name: 'Minion Hoarder', description: 'Obtain 400 minions.', category: 'Duty', date: '2024-06-01' },
  { id: 10, name: 'Master Crafter', description: 'Achieve all crafting job levels to 100.', category: 'Crafting', date: '2024-09-01' },
  { id: 11, name: 'Achievement Hunter', description: 'Earn 2,000 achievements.', category: 'Legacy', date: '2024-11-01' },
  { id: 12, name: 'Social Butterfly', description: 'Join 100 party finder groups.', category: 'Social', date: '2024-05-01' },
];
