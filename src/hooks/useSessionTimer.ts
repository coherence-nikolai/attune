import { AppState, AppStateStatus } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';

import { SessionStatus } from '../types';

type UseSessionTimerOptions = {
  durationSeconds: number;
  onComplete: () => void;
};

export function useSessionTimer({ durationSeconds, onComplete }: UseSessionTimerOptions) {
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
  const [status, setStatus] = useState<SessionStatus>('running');

  const targetEndRef = useRef<number | null>(Date.now() + durationSeconds * 1000);
  const remainingRef = useRef(durationSeconds);
  const completedRef = useRef(false);
  const statusRef = useRef<SessionStatus>('running');

  const syncRemainingFromClock = useCallback(() => {
    if (!targetEndRef.current) {
      return remainingRef.current;
    }

    const next = Math.max(0, Math.ceil((targetEndRef.current - Date.now()) / 1000));
    remainingRef.current = next;
    setRemainingSeconds(next);
    return next;
  }, []);

  const complete = useCallback(() => {
    if (completedRef.current) {
      return;
    }

    completedRef.current = true;
    targetEndRef.current = null;
    remainingRef.current = 0;
    setRemainingSeconds(0);
    setStatus('completed');
    statusRef.current = 'completed';
    onComplete();
  }, [onComplete]);

  const pause = useCallback(() => {
    if (statusRef.current !== 'running') {
      return;
    }

    syncRemainingFromClock();
    targetEndRef.current = null;
    setStatus('paused');
    statusRef.current = 'paused';
  }, [syncRemainingFromClock]);

  const resume = useCallback(() => {
    if (statusRef.current !== 'paused') {
      return;
    }

    completedRef.current = false;
    targetEndRef.current = Date.now() + remainingRef.current * 1000;
    setStatus('running');
    statusRef.current = 'running';
  }, []);

  const exit = useCallback(() => {
    targetEndRef.current = null;
    setStatus('exited');
    statusRef.current = 'exited';
  }, []);

  useEffect(() => {
    if (status !== 'running') {
      return;
    }

    const interval = setInterval(() => {
      const next = syncRemainingFromClock();
      if (next <= 0) {
        complete();
      }
    }, 250);

    return () => clearInterval(interval);
  }, [complete, status, syncRemainingFromClock]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState !== 'active' && statusRef.current === 'running') {
        pause();
      }
    });

    return () => subscription.remove();
  }, [pause]);

  return {
    remainingSeconds,
    status,
    pause,
    resume,
    exit,
  };
}
