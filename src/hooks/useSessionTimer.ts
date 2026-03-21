import { useEffect, useRef, useState } from 'react';

export function useSessionTimer(totalSeconds: number) {
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (status !== 'running') {
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          setStatus('completed');
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status]);

  const start = () => {
    setRemainingSeconds(totalSeconds);
    setStatus('running');
  };

  const pause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setStatus('paused');
  };

  const resume = () => {
    if (remainingSeconds > 0) {
      setStatus('running');
    }
  };

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setRemainingSeconds(totalSeconds);
    setStatus('idle');
  };

  return {
    remainingSeconds,
    status,
    start,
    pause,
    resume,
    reset,
  };
}
