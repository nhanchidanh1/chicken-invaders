export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Entity extends Position, Size {
  id: string;
}

export interface Player extends Entity {
  lives: number;
  shield: boolean;
}

export interface Bullet extends Entity {
  speed: number;
  damage: number;
}

export interface Chicken extends Entity {
  hp: number;
  maxHp: number;
  points: number;
  row: number;
  col: number;
}

export interface PowerUp extends Entity {
  type: PowerUpType;
  duration?: number;
}

export interface Explosion extends Entity {
  duration: number;
  maxDuration: number;
}

export enum PowerUpType {
  SPREAD_SHOT = 'spread_shot',
  RAPID_FIRE = 'rapid_fire',
  SHIELD = 'shield',
  DAMAGE_UP = 'damage_up'
}

export enum GameState {
  MENU = 'menu',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'game_over',
  VICTORY = 'victory'
}

export interface GameData {
  player: Player;
  playerBullets: Bullet[];
  chickens: Chicken[];
  eggs: Bullet[];
  powerUps: PowerUp[];
  explosions: Explosion[];
  score: number;
  wave: number;
  highScore: number;
  gameState: GameState;
  activePowerUps: { [key in PowerUpType]?: number };
  lastShotTime: number;
  chickenDirection: number;
  chickenMoveTimer: number;
  eggDropTimer: number;
}

export interface GameSettings {
  playfield: Size;
  playerSpeed: number;
  bulletSpeed: number;
  chickenSpeed: number;
  eggSpeed: number;
  fireRate: number;
  chickenRows: number;
  chickenCols: number;
}
