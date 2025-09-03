import React from 'react';
import { PowerUp, PowerUpType } from '../types/game';

interface PowerUpItemProps {
  powerUp: PowerUp;
}

const powerUpConfig = {
  [PowerUpType.SPREAD_SHOT]: { emoji: '🔫', color: 'bg-purple-500', name: 'Spread Shot' },
  [PowerUpType.RAPID_FIRE]: { emoji: '⚡', color: 'bg-yellow-500', name: 'Rapid Fire' },
  [PowerUpType.SHIELD]: { emoji: '🛡️', color: 'bg-blue-500', name: 'Shield' },
  [PowerUpType.DAMAGE_UP]: { emoji: '💥', color: 'bg-red-500', name: 'Damage Up' }
};

export const PowerUpItem: React.FC<PowerUpItemProps> = ({ powerUp }) => {
  const config = powerUpConfig[powerUp.type];

  return (
    <div
      className="absolute animate-bounce"
      style={{
        left: `${powerUp.x}px`,
        top: `${powerUp.y}px`,
        width: `${powerUp.width}px`,
        height: `${powerUp.height}px`,
      }}
    >
      <div className={`w-full h-full ${config.color} rounded-full border-2 border-white shadow-lg flex items-center justify-center relative overflow-hidden`}>
        {/* Power-up glow effect */}
        <div className="absolute inset-0 bg-white opacity-20 animate-pulse rounded-full"></div>
        
        {/* Power-up icon */}
        <span className="text-lg select-none relative z-10">
          {config.emoji}
        </span>
      </div>
    </div>
  );
};
