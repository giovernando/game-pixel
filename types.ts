export enum Direction {
  UP = 0,
  RIGHT = 1,
  DOWN = 2,
  LEFT = 3,
}

export interface CharacterState {
  x: number
  y: number
  direction: Direction
  isMoving: boolean
  frameIndex: number
}

export interface Zombie {
  id: number
  x: number
  y: number
  speed: number
  direction: Direction
  frameIndex: number
  tickCount: number
}

export interface Skeleton {
  id: number
  x: number
  y: number
  speed: number
  direction: Direction
  frameIndex: number
  tickCount: number
}

export interface Wolf {
  id: number
  x: number
  y: number
  speed: number
  direction: Direction
  frameIndex: number
  tickCount: number
}

export interface SpriteConfig {
  rows: number
  cols: number
  scale: number
  speed: number
  animationSpeed: number // Frames to wait before switching sprite frame
}
