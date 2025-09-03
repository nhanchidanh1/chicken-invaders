import React from 'react';

interface MobileControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onShoot: () => void;
  onPause: () => void;
  onStopMove: () => void;
  screenSize: { width: number; height: number };
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onShoot,
  onPause,
  onStopMove,
  screenSize
}) => {
  // Adaptive button sizes based on screen size
  const isSmallScreen = screenSize.width < 480;
  const buttonSize = isSmallScreen ? 'p-3' : 'p-4';
  const buttonTextSize = isSmallScreen ? 'text-lg' : 'text-xl';
  const pauseButtonSize = isSmallScreen ? 'p-2' : 'p-3';
  const spacing = isSmallScreen ? 'space-x-2' : 'space-x-3';

  return (
    <div className="absolute bottom-2 md:bottom-4 left-0 right-0 flex justify-between items-end px-2 md:px-4 z-10 md:hidden">
      {/* Movement controls */}
      <div className={`flex ${spacing}`}>
        <button
          onTouchStart={onMoveLeft}
          onTouchEnd={onStopMove}
          onMouseDown={onMoveLeft}
          onMouseUp={onStopMove}
          onMouseLeave={onStopMove}
          className={`bg-gray-700 bg-opacity-90 text-white ${buttonSize} rounded-xl font-bold ${buttonTextSize} active:bg-gray-600 select-none border-2 border-gray-500 shadow-lg transition-all duration-150 active:scale-95`}
        >
          ←
        </button>
        <button
          onTouchStart={onMoveRight}
          onTouchEnd={onStopMove}
          onMouseDown={onMoveRight}
          onMouseUp={onStopMove}
          onMouseLeave={onStopMove}
          className={`bg-gray-700 bg-opacity-90 text-white ${buttonSize} rounded-xl font-bold ${buttonTextSize} active:bg-gray-600 select-none border-2 border-gray-500 shadow-lg transition-all duration-150 active:scale-95`}
        >
          →
        </button>
      </div>

      {/* Action controls */}
      <div className={`flex ${spacing}`}>
        <button
          onTouchStart={onPause}
          onMouseDown={onPause}
          className={`bg-blue-600 bg-opacity-90 text-white ${pauseButtonSize} rounded-xl font-bold text-sm active:bg-blue-500 select-none border-2 border-blue-400 shadow-lg transition-all duration-150 active:scale-95`}
        >
          ⏸️
        </button>
        <button
          onTouchStart={onShoot}
          onMouseDown={onShoot}
          className={`bg-red-600 bg-opacity-90 text-white ${buttonSize} rounded-xl font-bold ${buttonTextSize} active:bg-red-500 select-none border-2 border-red-400 shadow-lg transition-all duration-150 active:scale-95`}
        >
          🔥
        </button>
      </div>
    </div>
  );
};
