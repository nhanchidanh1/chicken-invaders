import { Entity, Position, Size, GameData, Chicken, PowerUpType, Bullet, PowerUp, Explosion } from '../types/game';

// Collision detection using AABB (Axis-Aligned Bounding Box) with more generous hitboxes
export const checkCollision = (entity1: Entity, entity2: Entity): boolean => {
  // Make collision slightly more generous for better gameplay
  const margin = 2;
  return (
    entity1.x + margin < entity2.x + entity2.width &&
    entity1.x + entity1.width - margin > entity2.x &&
    entity1.y + margin < entity2.y + entity2.height &&
    entity1.y + entity1.height - margin > entity2.y
  );
};

// Generate unique ID for entities
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Clamp value between min and max
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

// Create chicken grid formation with responsive spacing
export const createChickenGrid = (
  rows: number, 
  cols: number, 
  startX: number, 
  startY: number, 
  playfieldWidth: number
): Chicken[] => {
  const chickens: Chicken[] = [];
  
  // Calculate responsive chicken and spacing sizes
  const availableWidth = playfieldWidth - (startX * 2);
  const maxChickenWidth = Math.min(35, availableWidth / (cols * 1.5));
  const chickenWidth = Math.max(25, maxChickenWidth);
  const chickenHeight = Math.max(20, Math.floor(chickenWidth * 0.8));
  
  // Calculate spacing to fit all chickens
  const totalSpacingX = availableWidth - (cols * chickenWidth);
  const spacingX = Math.max(10, totalSpacingX / (cols - 1));
  const spacingY = Math.max(35, chickenHeight + 15);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // First two rows are stronger, but not too much
      const hp = row < 2 ? 2 : 1;
      chickens.push({
        id: generateId(),
        x: startX + col * (chickenWidth + spacingX),
        y: startY + row * spacingY,
        width: chickenWidth,
        height: chickenHeight,
        hp,
        maxHp: hp,
        points: (rows - row) * 5 + 10,
        row,
        col
      });
    }
  }

  return chickens;
};

// Create bullet with better size
export const createBullet = (x: number, y: number, speed: number, damage: number = 1): Bullet => ({
  id: generateId(),
  x: x - 3,
  y,
  width: 6,
  height: 12,
  speed,
  damage
});

// Create power-up
export const createPowerUp = (x: number, y: number, type: PowerUpType): PowerUp => ({
  id: generateId(),
  x: x - 18,
  y,
  width: 36,
  height: 36,
  type
});

// Create explosion effect
export const createExplosion = (x: number, y: number, size: number = 50): Explosion => ({
  id: generateId(),
  x: x - size / 2,
  y: y - size / 2,
  width: size,
  height: size,
  duration: 400,
  maxDuration: 400
});

// Get random power-up type with balanced distribution
export const getRandomPowerUpType = (): PowerUpType => {
  const types = [
    PowerUpType.SPREAD_SHOT,
    PowerUpType.RAPID_FIRE,
    PowerUpType.SHIELD,
    PowerUpType.DAMAGE_UP,
    PowerUpType.SPREAD_SHOT, // Higher chance for spread shot
    PowerUpType.RAPID_FIRE   // Higher chance for rapid fire
  ];
  return types[Math.floor(Math.random() * types.length)];
};

// Save high score to localStorage
export const saveHighScore = (score: number): void => {
  const currentHigh = getHighScore();
  if (score > currentHigh) {
    localStorage.setItem('chickenInvadersHighScore', score.toString());
  }
};

// Get high score from localStorage
export const getHighScore = (): number => {
  const stored = localStorage.getItem('chickenInvadersHighScore');
  return stored ? parseInt(stored, 10) : 0;
};

// Calculate wave difficulty multiplier (more gradual)
export const getWaveDifficulty = (wave: number): number => {
  return 1 + (wave - 1) * 0.15; // 15% increase per wave instead of 20%
};

// Check if chickens reached bottom line
export const checkChickensReachedBottom = (chickens: Chicken[], bottomLine: number): boolean => {
  return chickens.some(chicken => chicken.y + chicken.height >= bottomLine - 50);
};

// Get chicken formation bounds
export const getChickenFormationBounds = (chickens: Chicken[]): { left: number; right: number } => {
  if (chickens.length === 0) return { left: 0, right: 0 };
  
  const leftmost = Math.min(...chickens.map(c => c.x));
  const rightmost = Math.max(...chickens.map(c => c.x + c.width));
  
  return { left: leftmost, right: rightmost };
};

// Check if player can fire (respecting fire rate) - more responsive
export const canPlayerFire = (lastShotTime: number, fireRate: number, hasRapidFire: boolean): boolean => {
  const currentTime = Date.now();
  const cooldown = hasRapidFire ? fireRate / 4 : fireRate;
  return currentTime - lastShotTime >= cooldown;
};
