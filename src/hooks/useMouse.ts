import { useEffect, useRef, useState } from 'react';

interface MouseState {
  x: number;
  y: number;
  isPressed: boolean;
  lastClickTime: number;
}

export const useMouse = (containerRef: React.RefObject<HTMLElement>) => {
  const [mouseState, setMouseState] = useState<MouseState>({
    x: 0,
    y: 0,
    isPressed: false,
    lastClickTime: 0
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      setMouseState(prev => ({ ...prev, x, y }));
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0) { // Left click
        setMouseState(prev => ({ 
          ...prev, 
          isPressed: true,
          lastClickTime: Date.now()
        }));
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === 0) { // Left click
        setMouseState(prev => ({ ...prev, isPressed: false }));
      }
    };

    const handleMouseLeave = () => {
      setMouseState(prev => ({ ...prev, isPressed: false }));
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [containerRef]);

  return mouseState;
};