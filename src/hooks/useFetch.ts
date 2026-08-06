import { useState, useEffect, useCallback } from 'react';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useFetch<T>(fetchFn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchFn();
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: err as Error });
    }
  }, [fetchFn]);

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, refetch: execute };
}
