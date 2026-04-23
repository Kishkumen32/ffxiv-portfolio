import { useCachedFetch } from './useLocalStorage';
import { fetchTomestoneProfile, fetchTomestoneActivity, fetchTomestoneProgression } from '../api/tomestone';
import { fetchXIVAPICharacter } from '../api/xivapi';
import type { TomestoneProfile, TomestoneActivity, TomestoneProgression } from '../api/tomestone';
import type { XIVAPICharacter } from '../api/xivapi';

export function useTomestoneProfile() {
  return useCachedFetch<TomestoneProfile>(
    'tomestone-profile',
    fetchTomestoneProfile,
  );
}

export function useTomestoneActivity() {
  return useCachedFetch<TomestoneActivity[]>(
    'tomestone-activity',
    fetchTomestoneActivity,
  );
}

export function useTomestoneProgression() {
  return useCachedFetch<TomestoneProgression[]>(
    'tomestone-progression',
    fetchTomestoneProgression,
  );
}

export function useXIVAPICharacter() {
  return useCachedFetch<XIVAPICharacter>(
    'xivapi-character',
    fetchXIVAPICharacter,
  );
}
