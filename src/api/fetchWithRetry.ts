const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

function getDelay(attempt: number): number {
  return BASE_DELAY_MS * Math.pow(2, attempt);
}

function shouldRetry(status: number): boolean {
  if (status === 429) return true;
  if (status >= 500) return true;
  return false;
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, options);

      if (!res.ok) {
        if (!shouldRetry(res.status)) {
          throw new Error(`Fetch failed: ${res.status}`);
        }

        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, getDelay(attempt)));
          continue;
        }

        throw new Error(`Fetch failed after ${MAX_RETRIES} retries: ${res.status}`);
      }

      return res;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, getDelay(attempt)));
      }
    }
  }

  throw lastError ?? new Error('Fetch failed');
}
