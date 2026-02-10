import { useRef, useEffect, useCallback } from 'react';

interface GameLoopOptions {
  onUpdate: (deltaTime: number) => void;
  isRunning: boolean;
}

export const useGameLoop = ({ onUpdate, isRunning }: GameLoopOptions): void => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const accumulatedTimeRef = useRef<number>(0);

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      
      // Accumulate time to maintain consistent updates even if frame rate drops
      accumulatedTimeRef.current += deltaTime;
      
      // Process updates in fixed time steps for consistency
      const fixedStep = 16.67; // ~60fps
      while (accumulatedTimeRef.current >= fixedStep) {
        onUpdate(fixedStep);
        accumulatedTimeRef.current -= fixedStep;
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [onUpdate]);

  useEffect(() => {
    if (isRunning) {
      previousTimeRef.current = undefined;
      accumulatedTimeRef.current = 0;
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning, animate]);
};
