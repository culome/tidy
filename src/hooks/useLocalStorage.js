import { useState, useEffect } from 'react';

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      /* ignore corrupt data */
    }
    return typeof initial === 'function' ? initial() : initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* storage full or unavailable */
    }
  }, [key, value]);

  return [value, setValue];
}
