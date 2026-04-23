import type { TomestoneProfile, TomestoneActivity, TomestoneProgression } from './tomestone.types';
export type { TomestoneProfile, TomestoneActivity, TomestoneProgression };

import characterData from '../data/character.json';

export const TOMESTONE_BASE = '';

export function fetchTomestoneProfile(): TomestoneProfile {
  return characterData.profile;
}

export function fetchTomestoneActivity(): TomestoneActivity[] {
  return characterData.activity || [];
}

export function fetchTomestoneProgression(): TomestoneProgression[] {
  return characterData.progression || [];
}
