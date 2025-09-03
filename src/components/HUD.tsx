import React from 'react';
import { GameData, PowerUpType } from '../types/game';

interface HUDProps {
  gameData: GameData;
  screenSize: { width: number; height: number };
}

const powerUpIcons = {
  [PowerUpType.SPREAD_SHOT]: '🔫',
  [PowerUpType.RAPID_FIRE]: '⚡',
  [PowerUpType.SHIELD]: '🛡️',
  [PowerUpType.DAMAGE_UP]: '💥'
};

export const HUD: React.FC<HUDProps> = ({ gameData, screenSize }) => {
  const { player, score, wave, highScore, activePowerUps } = gameData;
  
  // Responsive text sizes
  const isSmallScreen = screenSize.width < 768;
  const isMediumScreen = screenSize.width < 1200;
  
  const titleSize = isSmallScreen ? 'text-sm' : isMediumScreen ? 'text-base' : 'text-lg';
  const scoreSize = isSmallScreen ? 'text-base' : isMediumScreen ? 'text-lg' : 'text-xl';
  const heartSize = isSmallScreen ? 'text-base' : 'text-lg';

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-75 text-white p-2 md:p-4">
      <div className="w-full flex items-center justify-between">
        {/* Left side - Score and Wave */}
        <div className="flex items-center space-x-2 md:space-x-4 lg:space-x-6">
          <div className={`${titleSize} font-bold`}>
            Score: <span className={`text-yellow-400 ${scoreSize}`}>{score.toLocaleString()}</span>
          </div>
          <div className={`${titleSize} font-bold`}>
            Wave: <span className={`text-green-400 ${scoreSize}`}>{wave}</span>
          </div>
          {!isSmallScreen && (
            <div className="text-xs md:text-sm text-gray-300">
              High: {highScore.toLocaleString()}
            </div>
          )}
        </div>

        {/* Center - Active Power-ups (responsive layout) */}
        <div className="flex items-center space-x-1 md:space-x-2 max-w-xs md:max-w-md overflow-x-auto">
          {Object.entries(activePowerUps).map(([type, duration]) => {
            if (!duration || duration <= 0) return null;
            return (
              <div key={type} className="flex items-center space-x-1 bg-gray-800 rounded px-1 md:px-2 py-1 whitespace-nowrap flex-shrink-0">
                <span className={isSmallScreen ? 'text-sm' : 'text-base'}>
                  {powerUpIcons[type as PowerUpType]}
                </span>
                <span className="text-xs">{Math.ceil(duration / 1000)}s</span>
              </div>
            );
          })}
        </div>

        {/* Right side - Lives */}
        <div className="flex items-center space-x-1 md:space-x-2">
          <span className={`${titleSize} font-bold hidden sm:inline`}>Lives:</span>
          <div className="flex space-x-0.5 md:space-x-1">
            {Array.from({ length: Math.min(player.lives, isSmallScreen ? 5 : 10) }, (_, i) => (
              <span key={i} className={heartSize}>❤️</span>
            ))}
            {player.lives > (isSmallScreen ? 5 : 10) && (
              <span className={`${titleSize} text-red-400 ml-1`}>
                +{player.lives - (isSmallScreen ? 5 : 10)}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile-only high score */}
      {isSmallScreen && (
        <div className="text-center text-xs text-gray-400 mt-1">
          High Score: {highScore.toLocaleString()}
        </div>
      )}
    </div>
  );
};
