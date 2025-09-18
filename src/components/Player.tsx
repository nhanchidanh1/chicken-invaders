import React from 'react';
import { Player as PlayerType } from '../types/game';

interface PlayerProps {
  player: PlayerType;
}

export const Player: React.FC<PlayerProps> = ({ player }) => {
  return (
    <div
      className={`absolute transition-all duration-75 ease-out ${
        player.shield ? 'animate-pulse' : ''
      }`}
      style={{
        left: `${player.x}px`,
        top: `${player.y}px`,
        width: `${player.width}px`,
        height: `${player.height}px`,
      }}
    >
      {/* Player ship body */}
      <div className="relative w-full h-full">
        {/* Shield effect */}
        {player.shield && (
          <div className="absolute -inset-3 rounded-full border-3 border-cyan-400 animate-pulse bg-cyan-200 opacity-50 shadow-xl shadow-cyan-400/60">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300 to-blue-300 opacity-20 animate-spin"></div>
          </div>
        )}
        
        {/* Ship main body - more detailed */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-7 h-10 bg-gradient-to-t from-blue-800 via-blue-600 to-blue-400 rounded-t-xl border-2 border-blue-900 shadow-xl">
          {/* Cockpit window */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-gradient-to-t from-cyan-300 to-white rounded-t border border-cyan-500 opacity-95 shadow-inner"></div>
          {/* Engine glow */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-gradient-to-t from-orange-500 to-yellow-400 rounded-b opacity-90 animate-pulse shadow-lg shadow-orange-400/50"></div>
        </div>
        
        {/* Ship wings - improved design */}
        <div className="absolute bottom-3 left-0 w-4 h-5 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-500 rounded-l-lg border border-gray-900 shadow-lg">
          <div className="absolute top-1 right-0 w-1 h-2 bg-red-500 rounded opacity-90 animate-pulse"></div>
        </div>
        <div className="absolute bottom-3 right-0 w-4 h-5 bg-gradient-to-l from-gray-800 via-gray-600 to-gray-500 rounded-r-lg border border-gray-900 shadow-lg">
          <div className="absolute top-1 left-0 w-1 h-2 bg-red-500 rounded opacity-90 animate-pulse"></div>
        </div>
        
        {/* Weapon cannons */}
        <div className="absolute bottom-1 left-1 w-1 h-4 bg-gray-700 rounded-t shadow-sm"></div>
        <div className="absolute bottom-1 right-1 w-1 h-4 bg-gray-700 rounded-t shadow-sm"></div>
      </div>
    </div>
  );
};
