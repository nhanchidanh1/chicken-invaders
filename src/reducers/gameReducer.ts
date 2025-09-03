import { 
  GameData, 
  GameState, 
  GameSettings, 
  PowerUpType, 
  Bullet, 
  Chicken, 
  PowerUp, 
  Explosion,
  Position 
} from '../types/game';
import {
  createChickenGrid,
  createBullet,
  createPowerUp,
  createExplosion,
  checkCollision,
  generateId,
  getRandomPowerUpType,
  saveHighScore,
  getHighScore,
  getWaveDifficulty,
  checkChickensReachedBottom,
  getChickenFormationBounds
} from '../utils/gameLogic';

export type GameAction = 
  | { type: 'START_GAME'; payload: GameSettings }
  | { type: 'UPDATE_GAME'; payload: { deltaTime: number; settings: GameSettings } }
  | { type: 'UPDATE_PLAYER_POSITION'; payload: Position }
  | { type: 'PLAYER_SHOOT' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'RESTART_GAME' }
  | { type: 'GAME_OVER' }
  | { type: 'NEXT_WAVE'; payload: GameSettings };

export const initialGameState: GameData = {
  player: {
    id: 'player',
    x: 375,
    y: 550,
    width: 40,
    height: 30,
    lives: 5,
    shield: false
  },
  playerBullets: [],
  chickens: [],
  eggs: [],
  powerUps: [],
  explosions: [],
  score: 0,
  wave: 1,
  highScore: getHighScore(),
  gameState: GameState.MENU,
  activePowerUps: {},
  lastShotTime: 0,
  chickenDirection: 1,
  chickenMoveTimer: 0,
  eggDropTimer: 0
};

export const gameReducer = (state: GameData, action: GameAction): GameData => {
  switch (action.type) {
    case 'START_GAME': {
      const settings = action.payload;
      
      // Calculate responsive chicken grid starting position
      const gridStartX = Math.max(50, settings.playfield.width * 0.1);
      const gridStartY = Math.max(80, settings.playfield.height * 0.15);
      
      return {
        ...initialGameState,
        gameState: GameState.PLAYING,
        chickens: createChickenGrid(
          settings.chickenRows,
          settings.chickenCols,
          gridStartX,
          gridStartY,
          settings.playfield.width
        ),
        player: {
          ...initialGameState.player,
          x: settings.playfield.width / 2 - 20,
          y: settings.playfield.height - Math.max(60, settings.playfield.height * 0.1),
          width: Math.min(40, settings.playfield.width * 0.05),
          height: Math.min(30, settings.playfield.height * 0.05)
        }
      };
    }

    case 'UPDATE_GAME': {
      const { deltaTime, settings } = action.payload;
      const dt = deltaTime / 1000;
      let newState = { ...state };

      // Update power-up durations
      const updatedPowerUps: { [key in PowerUpType]?: number } = {};
      Object.entries(newState.activePowerUps).forEach(([type, duration]) => {
        const remainingTime = (duration || 0) - deltaTime;
        if (remainingTime > 0) {
          updatedPowerUps[type as PowerUpType] = remainingTime;
        }
      });
      newState.activePowerUps = updatedPowerUps;

      // Update player shield status
      newState.player = {
        ...newState.player,
        shield: (newState.activePowerUps[PowerUpType.SHIELD] || 0) > 0
      };

      // Update player bullets
      newState.playerBullets = newState.playerBullets
        .map(bullet => ({
          ...bullet,
          y: bullet.y - settings.bulletSpeed * dt
        }))
        .filter(bullet => bullet.y + bullet.height > 0);

      // Update eggs
      newState.eggs = newState.eggs
        .map(egg => ({
          ...egg,
          y: egg.y + settings.eggSpeed * dt
        }))
        .filter(egg => egg.y < settings.playfield.height);

      // Update power-ups
      newState.powerUps = newState.powerUps
        .map(powerUp => ({
          ...powerUp,
          y: powerUp.y + 80 * dt
        }))
        .filter(powerUp => powerUp.y < settings.playfield.height);

      // Update explosions
      newState.explosions = newState.explosions
        .map(explosion => ({
          ...explosion,
          duration: explosion.duration - deltaTime
        }))
        .filter(explosion => explosion.duration > 0);

      // Update chicken movement - responsive to screen size
      newState.chickenMoveTimer += deltaTime;
      const moveInterval = 1200 / (settings.chickenSpeed * getWaveDifficulty(newState.wave));
      
      if (newState.chickenMoveTimer >= moveInterval) {
        const bounds = getChickenFormationBounds(newState.chickens);
        const margin = Math.max(30, settings.playfield.width * 0.05);
        
        // Check if chickens need to reverse direction
        if ((newState.chickenDirection > 0 && bounds.right >= settings.playfield.width - margin) ||
            (newState.chickenDirection < 0 && bounds.left <= margin)) {
          newState.chickenDirection *= -1;
          // Move chickens down - responsive step size
          const stepDown = Math.max(15, settings.playfield.height * 0.025);
          newState.chickens = newState.chickens.map(chicken => ({
            ...chicken,
            y: chicken.y + stepDown
          }));
        } else {
          // Move chickens horizontally - responsive step size
          const stepX = Math.max(15, settings.playfield.width * 0.02);
          newState.chickens = newState.chickens.map(chicken => ({
            ...chicken,
            x: chicken.x + newState.chickenDirection * stepX
          }));
        }
        
        newState.chickenMoveTimer = 0;
      }

      // Chicken egg dropping
      newState.eggDropTimer += deltaTime;
      const eggDropInterval = 3000 / getWaveDifficulty(newState.wave);
      
      if (newState.eggDropTimer >= eggDropInterval) {
        if (newState.chickens.length > 0) {
          const playerX = newState.player.x + newState.player.width / 2;
          const sortedChickens = [...newState.chickens].sort((a, b) => {
            const distA = Math.abs((a.x + a.width / 2) - playerX);
            const distB = Math.abs((b.x + b.width / 2) - playerX);
            return distA - distB;
          });
          
          const targetChickens = sortedChickens.slice(0, 3);
          const randomChicken = targetChickens[Math.floor(Math.random() * targetChickens.length)];
          
          const egg = createBullet(
            randomChicken.x + randomChicken.width / 2,
            randomChicken.y + randomChicken.height,
            settings.eggSpeed
          );
          newState.eggs.push(egg);
        }
        newState.eggDropTimer = 0;
      }

      // Collision detection: Player bullets vs Chickens
      const bulletsToRemove = new Set<string>();
      const chickensToRemove = new Set<string>();
      
      newState.playerBullets.forEach(bullet => {
        newState.chickens.forEach(chicken => {
          if (checkCollision(bullet, chicken) && !bulletsToRemove.has(bullet.id)) {
            bulletsToRemove.add(bullet.id);
            
            const damage = newState.activePowerUps[PowerUpType.DAMAGE_UP] ? 2 : 1;
            const updatedChicken = { ...chicken, hp: chicken.hp - damage };
            
            if (updatedChicken.hp <= 0) {
              chickensToRemove.add(chicken.id);
              newState.score += chicken.points;
              
              // Create explosion
              newState.explosions.push(createExplosion(
                chicken.x + chicken.width / 2,
                chicken.y + chicken.height / 2
              ));
              
              // Power-up drop
              if (Math.random() < 0.2) {
                newState.powerUps.push(createPowerUp(
                  chicken.x + chicken.width / 2,
                  chicken.y + chicken.height / 2,
                  getRandomPowerUpType()
                ));
              }
            } else {
              // Update chicken hp
              const chickenIndex = newState.chickens.findIndex(c => c.id === chicken.id);
              if (chickenIndex !== -1) {
                newState.chickens[chickenIndex] = updatedChicken;
              }
            }
          }
        });
      });

      // Remove hit bullets and destroyed chickens
      newState.playerBullets = newState.playerBullets.filter(bullet => !bulletsToRemove.has(bullet.id));
      newState.chickens = newState.chickens.filter(chicken => !chickensToRemove.has(chicken.id));

      // Collision detection: Eggs vs Player
      const eggsToRemove = new Set<string>();
      newState.eggs.forEach(egg => {
        if (checkCollision(egg, newState.player)) {
          eggsToRemove.add(egg.id);
          
          if (newState.player.shield) {
            delete newState.activePowerUps[PowerUpType.SHIELD];
          } else {
            newState.player = { ...newState.player, lives: newState.player.lives - 1 };
            
            newState.explosions.push(createExplosion(
              newState.player.x + newState.player.width / 2,
              newState.player.y + newState.player.height / 2,
              60
            ));
          }
        }
      });
      
      newState.eggs = newState.eggs.filter(egg => !eggsToRemove.has(egg.id));

      // Collision detection: Power-ups vs Player
      const powerUpsToRemove = new Set<string>();
      newState.powerUps.forEach(powerUp => {
        if (checkCollision(powerUp, newState.player)) {
          powerUpsToRemove.add(powerUp.id);
          
          const duration = 15000;
          newState.activePowerUps = {
            ...newState.activePowerUps,
            [powerUp.type]: duration
          };
        }
      });
      
      newState.powerUps = newState.powerUps.filter(powerUp => !powerUpsToRemove.has(powerUp.id));

      // Check win condition
      if (newState.chickens.length === 0) {
        return gameReducer(newState, { type: 'NEXT_WAVE', payload: settings });
      }

      // Check lose conditions
      if (newState.player.lives <= 0 || checkChickensReachedBottom(newState.chickens, settings.playfield.height)) {
        saveHighScore(newState.score);
        return { ...newState, gameState: GameState.GAME_OVER, highScore: Math.max(newState.score, newState.highScore) };
      }

      return newState;
    }

    case 'UPDATE_PLAYER_POSITION': {
      return {
        ...state,
        player: { ...state.player, ...action.payload }
      };
    }

    case 'PLAYER_SHOOT': {
      const hasSpreadShot = (state.activePowerUps[PowerUpType.SPREAD_SHOT] || 0) > 0;
      const bullets: Bullet[] = [];
      
      if (hasSpreadShot) {
        bullets.push(
          createBullet(state.player.x + state.player.width / 2 - 15, state.player.y, 450),
          createBullet(state.player.x + state.player.width / 2, state.player.y, 450),
          createBullet(state.player.x + state.player.width / 2 + 15, state.player.y, 450)
        );
      } else {
        bullets.push(createBullet(state.player.x + state.player.width / 2, state.player.y, 450));
      }
      
      return {
        ...state,
        playerBullets: [...state.playerBullets, ...bullets],
        lastShotTime: Date.now()
      };
    }

    case 'NEXT_WAVE': {
      const settings = action.payload;
      const newWave = state.wave + 1;
      
      const isBossWave = newWave % 5 === 0;
      
      let newChickens: Chicken[];
      if (isBossWave) {
        const bossSize = Math.min(60, settings.playfield.width * 0.08);
        newChickens = [
          {
            id: generateId(),
            x: settings.playfield.width / 2 - bossSize,
            y: Math.max(120, settings.playfield.height * 0.2),
            width: bossSize,
            height: Math.floor(bossSize * 0.75),
            hp: 8,
            maxHp: 8,
            points: 300,
            row: 0,
            col: 0
          },
          {
            id: generateId(),
            x: settings.playfield.width / 2 + 20,
            y: Math.max(120, settings.playfield.height * 0.2),
            width: bossSize,
            height: Math.floor(bossSize * 0.75),
            hp: 8,
            maxHp: 8,
            points: 300,
            row: 0,
            col: 1
          }
        ];
      } else {
        const rows = Math.min(settings.chickenRows + Math.floor(newWave / 4), 6);
        const cols = settings.chickenCols;
        const gridStartX = Math.max(50, settings.playfield.width * 0.1);
        const gridStartY = Math.max(80, settings.playfield.height * 0.15);
        
        newChickens = createChickenGrid(rows, cols, gridStartX, gridStartY, settings.playfield.width);
      }
      
      return {
        ...state,
        wave: newWave,
        chickens: newChickens,
        chickenDirection: 1,
        chickenMoveTimer: 0,
        eggDropTimer: 0,
        playerBullets: [],
        eggs: [],
        explosions: []
      };
    }

    case 'PAUSE_GAME': {
      return { ...state, gameState: GameState.PAUSED };
    }

    case 'RESUME_GAME': {
      return { ...state, gameState: GameState.PLAYING };
    }

    case 'RESTART_GAME': {
      return {
        ...initialGameState,
        highScore: Math.max(state.score, state.highScore),
        gameState: GameState.MENU
      };
    }

    case 'GAME_OVER': {
      saveHighScore(state.score);
      return {
        ...state,
        gameState: GameState.GAME_OVER,
        highScore: Math.max(state.score, state.highScore)
      };
    }

    default:
      return state;
  }
};
