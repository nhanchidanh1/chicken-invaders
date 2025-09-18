import React, { useReducer, useCallback, useEffect, useRef, useState } from 'react';
import { GameData, GameState, GameSettings, PowerUpType } from '../types/game';
import { useGameLoop } from '../hooks/useGameLoop';
import { useKeyboard } from '../hooks/useKeyboard';
import { useMouse } from '../hooks/useMouse';
import { gameReducer, initialGameState, GameAction } from '../reducers/gameReducer';
import { Player } from './Player';
import { Chicken } from './Chicken';
import { Projectile } from './Projectile';
import { PowerUpItem } from './PowerUpItem';
import { Explosion } from './Explosion';
import { HUD } from './HUD';
import { PauseOverlay } from './PauseOverlay';
import { GameOverScreen } from './GameOverScreen';
import { MobileControls } from './MobileControls';
import { clamp, canPlayerFire } from '../utils/gameLogic';

export const GameStage: React.FC = () => {
  const [gameData, dispatch] = useReducer(gameReducer, initialGameState);
  const { keys } = useKeyboard();
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const mouseState = useMouse(gameContainerRef);
  const mobileMove = useRef<'left' | 'right' | null>(null);
  const [screenSize, setScreenSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Update screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate responsive game settings based on screen size
  const getResponsiveSettings = useCallback((): GameSettings => {
    const minWidth = 320;
    const minHeight = 480;
    const maxWidth = 1920;
    const maxHeight = 1080;

    // Use full screen but ensure minimum dimensions
    const playfieldWidth = Math.max(minWidth, Math.min(screenSize.width, maxWidth));
    const playfieldHeight = Math.max(minHeight, Math.min(screenSize.height, maxHeight));

    // Scale speeds based on screen size for consistent gameplay
    const sizeScale = Math.min(playfieldWidth / 800, playfieldHeight / 600);
    
    return {
      playfield: { width: playfieldWidth, height: playfieldHeight },
      playerSpeed: 350 * sizeScale,
      bulletSpeed: 500 * sizeScale,
      chickenSpeed: 30 * sizeScale, // Slower chicken movement
      eggSpeed: 120 * sizeScale, // Much slower egg speed for easier gameplay
      fireRate: 150, // Faster fire rate for smoother shooting
      chickenRows: 4,
      chickenCols: Math.min(Math.floor(playfieldWidth / 80), 12) // Adaptive column count
    };
  }, [screenSize]);

  const gameSettings = getResponsiveSettings();

  // Game loop with improved controls
  const updateGame = useCallback((deltaTime: number) => {
    if (gameData.gameState !== GameState.PLAYING) return;

    const dt = Math.min(deltaTime / 1000, 1/30); // Cap delta time for smoother movement

    // Handle player input (mouse, keyboard, and mobile)
    let playerDx = 0;
    
    // Mouse control - smooth following
    if (mouseState.x > 0) {
      const targetX = mouseState.x - gameData.player.width / 2;
      const currentX = gameData.player.x;
      const distance = targetX - currentX;
      
      // Smooth movement towards mouse position
      if (Math.abs(distance) > 5) {
        playerDx = Math.sign(distance) * Math.min(Math.abs(distance) * 8 * dt, gameSettings.playerSpeed * dt);
      }
    }
    // Keyboard fallback
    else if (keys.current.ArrowLeft || keys.current.KeyA || mobileMove.current === 'left') {
      playerDx -= gameSettings.playerSpeed * dt;
    } else if (keys.current.ArrowRight || keys.current.KeyD || mobileMove.current === 'right') {
      playerDx += gameSettings.playerSpeed * dt;
    }

    // Update player position with smoother movement
    if (playerDx !== 0) {
      const newX = clamp(
        gameData.player.x + playerDx,
        0,
        gameSettings.playfield.width - gameData.player.width
      );
      dispatch({ type: 'UPDATE_PLAYER_POSITION', payload: { x: newX, y: gameData.player.y } });
    }

    // Handle shooting (mouse left click or spacebar)
    if (mouseState.isPressed || keys.current.Space) {
      const hasRapidFire = (gameData.activePowerUps[PowerUpType.RAPID_FIRE] || 0) > 0;
      if (canPlayerFire(gameData.lastShotTime, gameSettings.fireRate, hasRapidFire)) {
        dispatch({ type: 'PLAYER_SHOOT' });
      }
    }

    // Update game entities
    dispatch({ type: 'UPDATE_GAME', payload: { deltaTime, settings: gameSettings } });
  }, [gameData, keys, mouseState, gameSettings]);

  useGameLoop({
    onUpdate: updateGame,
    isRunning: gameData.gameState === GameState.PLAYING
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyP':
          if (gameData.gameState === GameState.PLAYING) {
            dispatch({ type: 'PAUSE_GAME' });
          } else if (gameData.gameState === GameState.PAUSED) {
            dispatch({ type: 'RESUME_GAME' });
          }
          break;
        case 'KeyR':
          if (gameData.gameState === GameState.GAME_OVER || gameData.gameState === GameState.VICTORY) {
            dispatch({ type: 'RESTART_GAME' });
          }
          break;
        case 'KeyF':
        case 'F11':
          // Toggle fullscreen
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.();
          } else {
            document.exitFullscreen?.();
          }
          event.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameData.gameState]);

  // Mobile controls handlers - improved
  const handleMobileMove = useCallback((direction: 'left' | 'right') => {
    if (gameData.gameState !== GameState.PLAYING) return;
    mobileMove.current = direction;
  }, [gameData.gameState]);

  const handleStopMove = useCallback(() => {
    mobileMove.current = null;
  }, []);

  const handleMobileShoot = useCallback(() => {
    if (gameData.gameState !== GameState.PLAYING) return;
    
    const hasRapidFire = (gameData.activePowerUps[PowerUpType.RAPID_FIRE] || 0) > 0;
    if (canPlayerFire(gameData.lastShotTime, gameSettings.fireRate, hasRapidFire)) {
      dispatch({ type: 'PLAYER_SHOOT' });
    }
  }, [gameData.lastShotTime, gameData.activePowerUps, gameData.gameState, gameSettings.fireRate]);

  const handlePause = useCallback(() => {
    if (gameData.gameState === GameState.PLAYING) {
      dispatch({ type: 'PAUSE_GAME' });
    } else if (gameData.gameState === GameState.PAUSED) {
      dispatch({ type: 'RESUME_GAME' });
    }
  }, [gameData.gameState]);

  const handleRestart = useCallback(() => {
    dispatch({ type: 'RESTART_GAME' });
  }, []);

  // Start game if in menu state
  useEffect(() => {
    if (gameData.gameState === GameState.MENU) {
      dispatch({ type: 'START_GAME', payload: gameSettings });
    }
  }, [gameData.gameState, gameSettings]);

  // Calculate star density based on screen size
  const starCount = Math.min(150, Math.floor((screenSize.width * screenSize.height) / 8000));

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-900 via-blue-900 to-black overflow-hidden">
      <div 
        ref={gameContainerRef}
        className="relative w-full h-full bg-gradient-to-b from-blue-950 via-purple-950 to-black overflow-hidden"
        style={{
          width: `${gameSettings.playfield.width}px`,
          height: `${gameSettings.playfield.height}px`,
          cursor: gameData.gameState === GameState.PLAYING ? 'none' : 'default'
        }}
      >
        {/* Enhanced background stars effect - responsive count */}
        <div className="absolute inset-0 opacity-40">
          {Array.from({ length: starCount }, (_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                opacity: 0.3 + Math.random() * 0.7
              }}
            ></div>
          ))}
        </div>

        {/* Responsive nebula effect */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute bg-purple-500 rounded-full blur-3xl animate-pulse"
            style={{
              top: `${gameSettings.playfield.height * 0.1}px`,
              left: `${gameSettings.playfield.width * 0.15}px`,
              width: `${Math.min(128, gameSettings.playfield.width * 0.15)}px`,
              height: `${Math.min(128, gameSettings.playfield.width * 0.15)}px`
            }}
          ></div>
          <div 
            className="absolute bg-blue-500 rounded-full blur-2xl animate-pulse"
            style={{
              top: `${gameSettings.playfield.height * 0.25}px`,
              right: `${gameSettings.playfield.width * 0.1}px`,
              width: `${Math.min(96, gameSettings.playfield.width * 0.12)}px`,
              height: `${Math.min(96, gameSettings.playfield.width * 0.12)}px`,
              animationDelay: '1s'
            }}
          ></div>
          <div 
            className="absolute bg-pink-500 rounded-full blur-3xl animate-pulse"
            style={{
              bottom: `${gameSettings.playfield.height * 0.2}px`,
              left: `${gameSettings.playfield.width * 0.3}px`,
              width: `${Math.min(160, gameSettings.playfield.width * 0.2)}px`,
              height: `${Math.min(160, gameSettings.playfield.width * 0.2)}px`,
              animationDelay: '2s'
            }}
          ></div>
        </div>

        {/* HUD */}
        <HUD gameData={gameData} screenSize={gameSettings.playfield} />

        {/* Game entities */}
        <Player player={gameData.player} />
        
        {gameData.chickens.map(chicken => (
          <Chicken key={chicken.id} chicken={chicken} />
        ))}
        
        {gameData.playerBullets.map(bullet => (
          <Projectile key={bullet.id} projectile={bullet} />
        ))}
        
        {gameData.eggs.map(egg => (
          <Projectile key={egg.id} projectile={egg} isEgg />
        ))}
        
        {gameData.powerUps.map(powerUp => (
          <PowerUpItem key={powerUp.id} powerUp={powerUp} />
        ))}
        
        {gameData.explosions.map(explosion => (
          <Explosion key={explosion.id} explosion={explosion} />
        ))}

        {/* Responsive mobile controls */}
        <MobileControls
          onMoveLeft={() => handleMobileMove('left')}
          onMoveRight={() => handleMobileMove('right')}
          onStopMove={handleStopMove}
          onShoot={handleMobileShoot}
          onPause={handlePause}
          screenSize={gameSettings.playfield}
        />

        {/* Overlays */}
        {gameData.gameState === GameState.PAUSED && (
          <PauseOverlay onResume={() => dispatch({ type: 'RESUME_GAME' })} />
        )}

        {(gameData.gameState === GameState.GAME_OVER || gameData.gameState === GameState.VICTORY) && (
          <GameOverScreen
            score={gameData.score}
            highScore={gameData.highScore}
            wave={gameData.wave}
            isVictory={gameData.gameState === GameState.VICTORY}
            onRestart={handleRestart}
          />
        )}

        {/* Fullscreen toggle hint */}
        <div className="absolute top-20 right-4 text-white text-sm opacity-60 hidden lg:block space-y-1">
          <div>🖱️ Move mouse to control</div>
          <div>🖱️ Left click to shoot</div>
          <div>Press F11 for fullscreen</div>
        </div>
      </div>
    </div>
  );
};
