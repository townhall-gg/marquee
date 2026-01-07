/**
 * Direction of marquee movement
 * 1 = left (content moves right-to-left)
 * -1 = right (content moves left-to-right)
 */
export type Direction = 1 | -1;

/**
 * Configuration options for the marquee
 */
export interface MarqueeOptions {
  /** Base speed in pixels per second. Default: 100 */
  speed?: number;
  /** Speed multiplier. Useful for dynamic speed changes. Default: 1 */
  speedFactor?: number;
  /** Direction of movement. 1 = left, -1 = right. Default: 1 */
  direction?: Direction;
  /** Whether to start playing immediately. Default: true */
  autoplay?: boolean;
  /** Reduce motion for accessibility. Default: respects prefers-reduced-motion */
  reducedMotion?: boolean;
  /** For vanilla JS: require manual initialize() call. Default: false */
  manualInit?: boolean;
  /** Auto-clone the child element for seamless loop. Default: true */
  autoClone?: boolean;
  /**
   * Apply required layout styles (display: flex, min-width: max-content, will-change: transform).
   * Set to false if you want to handle container styles yourself.
   * Default: true
   */
  applyStyles?: boolean;
}

/**
 * Internal state of the marquee
 */
export interface MarqueeState {
  speed: number;
  speedFactor: number;
  direction: Direction;
  isPlaying: boolean;
  isDestroyed: boolean;
  isInitialized: boolean;
}

/**
 * Marquee instance interface
 */
export interface MarqueeInstance {
  /** Initialize the marquee (for vanilla JS usage) */
  initialize(content?: HTMLElement): void;
  /** Start the animation */
  play(): void;
  /** Pause the animation */
  pause(): void;
  /** Toggle between play and pause */
  toggle(): void;
  /** Set the base speed (px/s) */
  setSpeed(speed: number): void;
  /** Set the speed multiplier */
  setSpeedFactor(factor: number): void;
  /** Set the direction (1 = left, -1 = right) */
  setDirection(direction: Direction): void;
  /** Reverse the current direction */
  reverse(): void;
  /** Get current state */
  getState(): Readonly<MarqueeState>;
  /** Clean up and destroy the instance */
  destroy(): void;
}
