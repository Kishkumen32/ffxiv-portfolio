import { useCachedFetch } from './useLocalStorage';
import { fetchFFLogsRankings } from '../api/fflogs';
import type { FFLogsRanking } from '../api/fflogs';

export function useFFLogsData() {
  return useCachedFetch<FFLogsRanking[]>(
    'fflogs-rankings',
    fetchFFLogsRankings,
  );
}
