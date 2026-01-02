import { useEffect, useRef, useCallback } from 'react';

interface UseThrottledAutosaveOptions {
  delay?: number;
  enabled?: boolean;
}

interface UseThrottledAutosaveReturn {
  forceSave: () => void;
}

/**
 * Custom hook for throttled autosave functionality
 * @param value - The value to save
 * @param saveFunction - Function to call for saving (receives value)
 * @param options - Configuration options
 * @returns Object with forceSave function
 */
function useThrottledAutosave<T>(
  value: T,
  saveFunction: (value: T) => void,
  options: UseThrottledAutosaveOptions = {}
): UseThrottledAutosaveReturn {
  const { delay = 2000, enabled = true } = options;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<T>(value);
  const isFirstRenderRef = useRef(true);
  const saveFunctionRef = useRef(saveFunction);

  // Update the ref when saveFunction changes
  useEffect(() => {
    saveFunctionRef.current = saveFunction;
  }, [saveFunction]);

  const throttledSave = useCallback(() => {
    if (!enabled || typeof saveFunctionRef.current !== 'function') {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      // Only save if value has actually changed
      if (value !== lastSavedRef.current) {
        saveFunctionRef.current(value);
        lastSavedRef.current = value;
      }
    }, delay);
  }, [value, delay, enabled]);

  useEffect(() => {
    // Skip the first render to avoid saving initial/default values
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      lastSavedRef.current = value;
      return;
    }

    throttledSave();

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [throttledSave]);

  // Force save function (for explicit saves)
  const forceSave = useCallback(() => {
    if (enabled && typeof saveFunctionRef.current === 'function') {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      saveFunctionRef.current(value);
      lastSavedRef.current = value;
    }
  }, [value, enabled]);

  return { forceSave };
}

export default useThrottledAutosave;