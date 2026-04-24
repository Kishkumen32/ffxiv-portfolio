import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

interface CachedData<T> {
  data: T;
  timestamp: number;
}

const DEFAULT_TTL = 60 * 60 * 1000;

export function useLocalStorage<T>(key: string, ttl: number = DEFAULT_TTL) {
  const get = useCallback((): T | null => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const cached: CachedData<T> = JSON.parse(raw);
      if (Date.now() - cached.timestamp > ttl) {
        localStorage.removeItem(key);
        return null;
      }
      return cached.data;
    } catch {
      return null;
    }
  }, [key, ttl]);

  const set = useCallback((data: T): void => {
    try {
      const cached: CachedData<T> = { data, timestamp: Date.now() };
      localStorage.setItem(key, JSON.stringify(cached));
    } catch {
      // Storage quota exceeded or unavailable - silently ignore
    }
  }, [key]);

  const remove = useCallback((): void => {
    localStorage.removeItem(key);
  }, [key]);

  return useMemo(() => ({ get, set, remove }), [get, set, remove]);
}

export function useCachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = DEFAULT_TTL,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cache = useLocalStorage<T>(key, ttl);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const cached = cache.get();
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      try {
        const result = await fetcherRef.current();
        if (!cancelled) {
          setData(result);
          cache.set(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Fetch failed');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [cache]);

  const refetch = useCallback(async () => {
    cache.remove();
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      setData(result);
      cache.set(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fetch failed');
    } finally {
      setLoading(false);
    }
  }, [cache]);

  return { data, loading, error, refetch };
}
