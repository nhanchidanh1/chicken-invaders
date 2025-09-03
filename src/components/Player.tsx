import React from 'react';
import { Player as PlayerType } from '../types/game';

interface PlayerProps {
  player: PlayerType;
}

export const Player: React.FC<PlayerProps> = ({ player }) => {
  return (
    <div
      className={`absolute transition-all duration-100 ${
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
          <div className="absolute -inset-3 rounded-full border-3 border-cyan-400 animate-pulse bg-cyan-200 opacity-40 shadow-lg shadow-cyan-400/50"></div>
        )}
        
        {/* Ship main body - more detailed */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-7 h-10 bg-gradient-to-t from-blue-700 via-blue-500 to-blue-300 rounded-t-xl border-2 border-blue-900 shadow-lg">
          {/* Cockpit window */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-gradient-to-t from-cyan-400 to-white rounded-t border border-cyan-600 opacity-90"></div>
          {/* Engine glow */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-gradient-to-t from-orange-400 to-yellow-300 rounded-b opacity-80"></div>
        </div>
        
        {/* Ship wings - improved design */}
        <div className="absolute bottom-3 left-0 w-4 h-5 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-400 rounded-l-lg border border-gray-800 shadow-md">
          <div className="absolute top-1 right-0 w-1 h-2 bg-red-500 rounded opacity-80"></div>
        </div>
        <div className="absolute bottom-3 right-0 w-4 h-5 bg-gradient-to-l from-gray-700 via-gray-500 to-gray-400 rounded-r-lg border border-gray-800 shadow-md">
          <div className="absolute top-1 left-0 w-1 h-2 bg-red-500 rounded opacity-80"></div>
        </div>
        
        {/* Weapon cannons */}
        <div className="absolute bottom-1 left-1 w-1 h-4 bg-gray-600 rounded-t"></div>
        <div className="absolute bottom-1 right-1 w-1 h-4 bg-gray-600 rounded-t"></div>
      </div>
    </div>
  );
};
