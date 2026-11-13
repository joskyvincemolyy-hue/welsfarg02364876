import { useState, useCallback, useRef } from 'react';

export const useSavedToast = () => {
  const [show, setShow] = useState(false);
  const timerRef = useRef<number | null>(null);

  const ping = useCallback(() => {
    setShow(true);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setShow(false);
    }, 1800);
  }, []);

  return { show, ping };
};
