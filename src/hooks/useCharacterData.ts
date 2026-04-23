import { useCachedFetch } from './useLocalStorage';
import { fetchTomestoneProfile, fetchTomestoneActivity, fetchTomestoneProgression } from '../api/tomestone';
import type { TomestoneProfile, TomestoneActivity, TomestoneProgression } from '../api/tomestone.types';

export function useTomestoneProfile() {
  return useCachedFetch<TomestoneProfile>(
    'tomestone-profile',
    () => Promise.resolve(fetchTomestoneProfile()),
  );
}

export function useTomestoneActivity() {
  return useCachedFetch<TomestoneActivity[]>(
    'tomestone-activity',
    () => Promise.resolve(fetchTomestoneActivity()),
  );
}

export function useTomestoneProgression() {
  return useCachedFetch<TomestoneProgression[]>(
    'tomestone-progression',
    () => Promise.resolve(fetchTomestoneProgression()),
  );
}
