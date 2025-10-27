import { EnemyType } from './types';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const GROUND_Y = GAME_HEIGHT - 50; // The Y position of the ground

export const PLAYER_WIDTH = 50;
export const PLAYER_HEIGHT = 80;
export const PLAYER_INITIAL_X = 50;
export const PLAYER_SPEED = 5;
export const JUMP_STRENGTH = -18;
export const GRAVITY = 0.8;

export const INITIAL_LIVES = 3;
export const TOTAL_LEVELS = 12;

export const LEVEL_SCORE_TARGET = 1000;

interface LevelConfig {
    enemySpeed: number;
    spawnInterval: number;
    pointsPerDodge: number;
}

export const LEVEL_CONFIG: Record<number, LevelConfig> = {
  1: { enemySpeed: 4, spawnInterval: 2000, pointsPerDodge: 100 },
  2: { enemySpeed: 4.5, spawnInterval: 1900, pointsPerDodge: 120 },
  3: { enemySpeed: 5, spawnInterval: 1800, pointsPerDodge: 140 },
  4: { enemySpeed: 5.5, spawnInterval: 1700, pointsPerDodge: 160 },
  5: { enemySpeed: 6, spawnInterval: 1600, pointsPerDodge: 180 },
  6: { enemySpeed: 6.5, spawnInterval: 1500, pointsPerDodge: 200 },
  7: { enemySpeed: 7, spawnInterval: 1400, pointsPerDodge: 220 },
  8: { enemySpeed: 7.5, spawnInterval: 1300, pointsPerDodge: 240 },
  9: { enemySpeed: 8, spawnInterval: 1200, pointsPerDodge: 260 },
  10: { enemySpeed: 8.5, spawnInterval: 1100, pointsPerDodge: 280 },
  11: { enemySpeed: 9, spawnInterval: 1000, pointsPerDodge: 300 },
  12: { enemySpeed: 10, spawnInterval: 900, pointsPerDodge: 350 },
};

interface EnemyConfig {
    width: number;
    height: number;
}

export const ENEMY_CONFIG: Record<EnemyType, EnemyConfig> = {
  [EnemyType.PC]: { width: 70, height: 70 },
  [EnemyType.HDD]: { width: 50, height: 30 },
  [EnemyType.RAM]: { width: 80, height: 20 },
};

// Power-up Constants
export const POWERUP_WIDTH = 40;
export const POWERUP_HEIGHT = 40;
export const SHIELD_POWERUP_SPAWN_CHANCE = 0.001; // Chance per frame for shield
export const LIFE_POWERUP_SPAWN_CHANCE = 0.0005; // Chance per frame for life, it's rarer
export const SHIELD_DURATION = 5000; // 5 seconds in ms
export const POWERUP_SPEED = 3;