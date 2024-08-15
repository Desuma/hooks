import { useCallback, useRef } from 'react';

import useMemoizedFn from '../useMemoizedFn';
import useUnmount from '../useUnmount';
import { isNumber } from '../utils';

export interface UseCreateTimeoutOptions {
  autoClear?: boolean;
}

export const useCreateTimeout = (
  fn: (...args: any) => void,
  delay?: number,
  options: UseCreateTimeoutOptions = {
    autoClear: true,
  },
) => {
  const timeoutCbk = useMemoizedFn(fn);
  const timerRef = useRef<NodeJS.Timeout | number>();

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null!;
    }
  }, []);

  const run = useCallback(
    (...args: any[]) => {
      if (!isNumber(delay) || delay < 0) {
        return;
      }

      if (options?.autoClear === true) {
        clear();
      }

      timerRef.current = setTimeout(timeoutCbk, delay, ...args);

      return clear;
    },
    [delay, options],
  );

  const memoRun = useMemoizedFn(run);

  useUnmount(clear);

  return {
    run,
    memoRun,
    clear,
  };
};

export default useCreateTimeout;
