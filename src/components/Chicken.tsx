import React from 'react';
import { Chicken as ChickenType } from '../types/game';

interface ChickenProps {
  chicken: ChickenType;
}

export const Chicken: React.FC<ChickenProps> = ({ chicken }) => {
  const healthPercentage = (chicken.hp / chicken.maxHp) * 100;
  const isDamaged = chicken.hp < chicken.maxHp;
  const isBoss = chicken.maxHp >= 10;

  return (
    <div
      className={`absolute transition-all duration-100 ease-out ${isDamaged ? 'animate-pulse' : ''}`}
      style={{
        left: `${chicken.x}px`,
        top: `${chicken.y}px`,
        width: `${chicken.width}px`,
        height: `${chicken.height}px`,
      }}
    >
      {/* Chicken body */}
      <div className={`relative w-full h-full ${isBoss ? 'transform scale-110' : ''}`}>
        {/* Health bar for damaged chickens */}
        {isDamaged && (
          <div className="absolute -top-3 left-0 w-full h-2 bg-gray-800 rounded-full border border-gray-600 shadow-sm">
            <div 
              className={`h-full rounded-full transition-all duration-200 shadow-inner ${
                healthPercentage > 60 ? 'bg-green-500' : 
                healthPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${healthPercentage}%` }}
            ></div>
          </div>
        )}
        
        {/* Boss crown */}
        {isBoss && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-yellow-400 text-lg animate-bounce">
            👑
          </div>
        )}
        
        {/* Chicken emoji with animation */}
        <div className={`flex items-center justify-center w-full h-full select-none transform transition-transform duration-150 hover:scale-105 ${
          isBoss ? 'text-4xl' : 'text-2xl'
        } drop-shadow-lg`}>
          {isBoss ? '🐓' : '🐔'}
        </div>
        
        {/* Damage effect */}
        {isDamaged && (
          <div className="absolute inset-0 bg-red-500 opacity-30 rounded animate-pulse shadow-lg shadow-red-500/30"></div>
        )}
      </div>
    </div>
  );
};
