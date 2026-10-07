import { useState, useRef, useEffect } from 'react';
import { formatDuration } from '../utils/timerUtils';

/**
 * Hook to track the monitoring session timer.
 * Provides elapsed time since monitoring started.
 */
export function useSessionTimer() {
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  const start = () => {
    const now = Date.now();
    setStartTime(now);
    setElapsed(0);

    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - now);
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = () => {
    stop();
    setStartTime(null);
    setElapsed(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    startTime,
    elapsed,
    elapsedFormatted: formatDuration(elapsed),
    start,
    stop,
    reset,
  };
}
