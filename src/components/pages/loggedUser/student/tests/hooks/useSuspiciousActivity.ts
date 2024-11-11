import { useEffect, useState, useRef } from 'react';
import { useMutation } from 'react-query';
import { addSuspiciousActivity } from '@/lib/api/suspiciousActivityApi';
import { addTestHistoryBeaconEndpoint } from '@/lib/api/testHistory';

interface SuspiciousActivityParams {
  testInstanceId: number;
  countScore: () => number;
  idleTimeout?: number;
}

export function useSuspiciousActivity({ testInstanceId, countScore, idleTimeout = 10000 }: SuspiciousActivityParams) {
  const [isTranslated, setIsTranslated] = useState(false);
  const lastActivityTimeRef = useRef(Date.now());

  const addSuspiciousActivityMutation = useMutation(addSuspiciousActivity, {
    onSuccess: () => {
      console.log("Added suspicious activity");
    },
    onError: (error: unknown) => {
      console.error("Error adding suspicious activity:", error);
    },
  });

  useEffect(() => {
    const checkTranslation = () => {
      const hiddenTextEnglish = document.getElementById('hidden-text-english') as HTMLElement;
      const hiddenTextPolish = document.getElementById('hidden-text-polish') as HTMLElement;

      const textChanged = hiddenTextEnglish?.innerText !== 'Dog' || hiddenTextPolish?.innerText !== 'Pies';
      if (textChanged && !isTranslated) {
        addSuspiciousActivityMutation.mutate({
          testInstanceId,
          description: 'PAGE_TRANSLATION',
        });

        setIsTranslated(true);
      }
    };

    const interval = setInterval(checkTranslation, 2000);

    return () => clearInterval(interval);
  }, [isTranslated]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        addSuspiciousActivityMutation.mutate({
          testInstanceId,
          description: 'VISIBILITY_HIDDEN',
        });
      }
    };

    const handleBeforeUnload = () => {
      const score = countScore();
      const payload = {
        testInstanceId,
        score,
      };
      navigator.sendBeacon(addTestHistoryBeaconEndpoint, JSON.stringify(payload));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [testInstanceId]);

  useEffect(() => {
    let initialWindowWidth = window.innerWidth;
    let initialWindowHeight = window.innerHeight;
    let previousWidth = initialWindowWidth;
    let previousHeight = initialWindowHeight;

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      const window_resized = currentWidth !== previousWidth || currentHeight !== previousHeight;
      const returned_to_initial =
        currentWidth === initialWindowWidth && currentHeight === initialWindowHeight;

      if (window_resized && !returned_to_initial) {
        addSuspiciousActivityMutation.mutate({
          testInstanceId,
          description: 'WINDOW_RESIZE',
        });
      }

      previousWidth = currentWidth;
      previousHeight = currentHeight;
    };

    const debounceResize = debounce(handleResize, 500);

    window.addEventListener('resize', debounceResize);

    return () => {
      window.removeEventListener('resize', debounceResize);
    };
  }, [testInstanceId]);

  useEffect(() => {
    const resetActivity = () => {
      lastActivityTimeRef.current = Date.now();
    };

    window.addEventListener('mousemove', resetActivity);
    window.addEventListener('keydown', resetActivity);
    window.addEventListener('click', resetActivity);

    return () => {
      window.removeEventListener('mousemove', resetActivity);
      window.removeEventListener('keydown', resetActivity);
      window.removeEventListener('click', resetActivity);
    };
  }, []);
  
  useEffect(() => {
    const checkIdleTimeout = () => {
      const now = Date.now();
      if (now - lastActivityTimeRef.current >= idleTimeout) {
        addSuspiciousActivityMutation.mutate({
          testInstanceId,
          description: 'IDLE_TIMEOUT',
        });
        lastActivityTimeRef.current = Date.now();
      }
    };

    const interval = setInterval(checkIdleTimeout, 1000);
    return () => clearInterval(interval);
  }, [idleTimeout, testInstanceId]);
}

function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;

  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}