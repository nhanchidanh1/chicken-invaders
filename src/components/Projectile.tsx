import React from 'react';
import { Bullet } from '../types/game';

interface ProjectileProps {
  projectile: Bullet;
  isEgg?: boolean;
}

export const Projectile: React.FC<ProjectileProps> = ({ projectile, isEgg = false }) => {
  return (
    <div
      className="absolute"
      style={{
        left: `${projectile.x}px`,
        top: `${projectile.y}px`,
        width: `${projectile.width}px`,
        height: `${projectile.height}px`,
      }}
    >
      {isEgg ? (
        // Egg projectile - improved visual
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative">
            <div className="text-xl select-none drop-shadow-lg">🥚</div>
            {/* Egg trail effect */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-gradient-to-b from-yellow-200 to-transparent opacity-60"></div>
          </div>
        </div>
      ) : (
        // Player bullet - enhanced design
        <div className="w-full h-full relative">
          {/* Main bullet body */}
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-500 via-yellow-300 to-white rounded-full border border-yellow-600 shadow-lg">
            {/* Bullet highlight */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-white opacity-70 rounded-full"></div>
            {/* Energy trail */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gradient-to-t from-yellow-400 to-transparent opacity-80"></div>
          </div>
          {/* Bullet glow effect */}
          <div className="absolute inset-0 bg-yellow-300 rounded-full opacity-30 animate-pulse"></div>
        </div>
      )}
    </div>
  );
};
