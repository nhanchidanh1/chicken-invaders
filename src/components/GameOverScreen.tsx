import React from 'react';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  wave: number;
  isVictory: boolean;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  highScore,
  wave,
  isVictory,
  onRestart
}) => {
  const isNewHighScore = score > highScore;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-20 p-4">
      <div className="bg-gray-900 border-2 border-gray-600 rounded-lg p-4 md:p-8 text-center text-white w-full max-w-sm md:max-w-md mx-4">
        <h2 className={`text-2xl md:text-3xl font-bold mb-3 md:mb-4 ${isVictory ? 'text-green-400' : 'text-red-400'}`}>
          {isVictory ? '🎉 Victory!' : '💀 Game Over'}
        </h2>
        
        <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
          <div className="text-lg md:text-xl">
            Final Score: <span className="text-yellow-400 font-bold">{score.toLocaleString()}</span>
          </div>
          
          {isNewHighScore && (
            <div className="text-base md:text-lg text-green-400 animate-pulse font-bold">
              🏆 New High Score!
            </div>
          )}
          
          <div className="text-base md:text-lg">
            Wave Reached: <span className="text-blue-400">{wave}</span>
          </div>
          
          <div className="text-sm text-gray-400">
            Previous High: {highScore.toLocaleString()}
          </div>
        </div>
        
        <button
          onClick={onRestart}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 md:py-3 rounded-lg font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm md:text-base"
        >
          Play Again (R)
        </button>
        
        <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-400">
          Press R to restart
        </div>
      </div>
    </div>
  );
};
