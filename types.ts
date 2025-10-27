

export interface Position {
  x: number;
  y: number;
}

export enum EnemyType {
  PC = 'PC',
  HDD = 'HDD',
  RAM = 'RAM',
}

export interface Enemy {
  id: number;
  type: EnemyType;
  position: Position;
  width: number;
  height: number;
  scored?: boolean;
}

export enum PowerUpType {
  SHIELD = 'shield',
  LIFE = 'life',
}

export interface PowerUp {
  id: number;
  type: PowerUpType;
  position: Position;
  width: number;
  height: number;
}

export type GameState = 'menu' | 'playing' | 'paused' | 'mathChallenge' | 'gameOver' | 'gameWon';

export type MathOperation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export interface ScoreRecord {
  name: string;
  score: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  vy: number;
  vx: number;
  color: string;
}