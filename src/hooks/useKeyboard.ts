import { useEffect, useRef } from 'react';

interface KeyboardState {
  [key: string]: boolean;
}

export const useKeyboard = (): { keys: React.MutableRefObject<KeyboardState> } => {
  const keys = useRef<KeyboardState>({});

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keys.current[event.code] = true;
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keys.current[event.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return { keys };
};
