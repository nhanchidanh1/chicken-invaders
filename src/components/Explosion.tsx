import React from 'react';
import { Explosion as ExplosionType } from '../types/game';

interface ExplosionProps {
  explosion: ExplosionType;
}

export const Explosion: React.FC<ExplosionProps> = ({ explosion }) => {
  const progress = 1 - (explosion.duration / explosion.maxDuration);
  const scale = 0.5 + progress * 0.5;
  const opacity = 1 - progress;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${explosion.x}px`,
        top: `${explosion.y}px`,
        width: `${explosion.width}px`,
        height: `${explosion.height}px`,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <div className="w-full h-full relative">
        {/* Explosion burst */}
        <div className="absolute inset-0 bg-gradient-radial from-yellow-300 via-orange-400 to-red-500 rounded-full animate-ping"></div>
        <div className="absolute inset-2 bg-gradient-radial from-white via-yellow-200 to-transparent rounded-full"></div>
        
        {/* Explosion particles */}
        <div className="absolute inset-0 flex items-center justify-center text-2xl select-none">
          💥
        </div>
      </div>
    </div>
  );
};
