import { useCallback, useEffect, useRef } from 'react';

export type CallbackOnceAfterUpdate<T> = (watched: T) => void;

const useCallbackOnceAfterUpdate = <T,>(watch: T) => {
  const ref = useRef<CallbackOnceAfterUpdate<T> | null>(null);

  useEffect(() => {
    if (typeof ref.current === 'function') ref.current(watch);
    ref.current = null;
  }, [watch]);

  return useCallback((cb: CallbackOnceAfterUpdate<T>) => {
    if (ref) ref.current = cb;
  }, []);
};

export default useCallbackOnceAfterUpdate;
