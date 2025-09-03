import React from 'react';

interface PauseOverlayProps {
  onResume: () => void;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({ onResume }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-20 p-4">
      <div className="bg-gray-900 border-2 border-gray-600 rounded-lg p-4 md:p-8 text-center text-white w-full max-w-sm md:max-w-md mx-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-blue-400">⏸️ Game Paused</h2>
        
        <div className="space-y-2 md:space-y-3 mb-6 md:mb-8 text-left">
          <h3 className="text-lg md:text-xl font-bold text-yellow-400 mb-2 md:mb-3">Controls:</h3>
          <div className="text-sm md:text-lg flex items-center justify-between">
            <span>Move:</span>
            <div className="space-x-1 md:space-x-2">
              <kbd className="bg-gray-700 px-2 md:px-3 py-1 rounded text-xs md:text-sm">←→</kbd>
              <span className="text-gray-400 text-xs md:text-sm">or</span>
              <kbd className="bg-gray-700 px-2 md:px-3 py-1 rounded text-xs md:text-sm">A D</kbd>
            </div>
          </div>
          <div className="text-sm md:text-lg flex items-center justify-between">
            <span>Shoot:</span>
            <kbd className="bg-gray-700 px-2 md:px-3 py-1 rounded text-xs md:text-sm">Space</kbd>
          </div>
          <div className="text-sm md:text-lg flex items-center justify-between">
            <span>Pause:</span>
            <kbd className="bg-gray-700 px-2 md:px-3 py-1 rounded text-xs md:text-sm">P</kbd>
          </div>
          <div className="text-sm md:text-lg flex items-center justify-between">
            <span>Restart:</span>
            <kbd className="bg-gray-700 px-2 md:px-3 py-1 rounded text-xs md:text-sm">R</kbd>
          </div>
          <div className="text-sm md:text-lg flex items-center justify-between hidden lg:flex">
            <span>Fullscreen:</span>
            <kbd className="bg-gray-700 px-2 md:px-3 py-1 rounded text-xs md:text-sm">F11</kbd>
          </div>
        </div>
        
        <div className="space-y-1 md:space-y-2 mb-4 md:mb-6 text-left">
          <h3 className="text-sm md:text-lg font-bold text-green-400 mb-1 md:mb-2">Power-ups:</h3>
          <div className="text-xs md:text-sm space-y-1">
            <div>🔫 Spread Shot - Triple bullets</div>
            <div>⚡ Rapid Fire - Faster shooting</div>
            <div>🛡️ Shield - Absorb one hit</div>
            <div>💥 Damage Up - Double damage</div>
          </div>
        </div>
        
        <button
          onClick={onResume}
          className="bg-green-600 hover:bg-green-700 px-6 md:px-8 py-2 md:py-3 rounded-lg font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-lg w-full"
        >
          Resume Game
        </button>
        
        <div className="mt-2 md:mt-4 text-xs md:text-sm text-gray-400">
          Press P to resume quickly
        </div>
      </div>
    </div>
  );
};
