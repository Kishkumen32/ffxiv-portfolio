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
