import { useState, useEffect } from 'react';

/**
 * Debounces a rapidly-changing value by the given delay (default 300ms).
 * Only updates the returned value once the input stops changing.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
