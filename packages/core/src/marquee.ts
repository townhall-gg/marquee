import type { Direction, MarqueeInstance, MarqueeOptions, MarqueeState } from "./types";

/**
 * Calculate duration from pixels per second
 */
function pxPerSecond(width: number, speed: number): number {
  return (width / speed) * 1000;
}

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Creates a high-performance marquee animation using Web Animations API
 *
 * @example
 * ```ts
 * const marquee = createMarquee(element, { speed: 100, direction: 1 });
 * marquee.initialize(contentElement);
 * marquee.play();
 * ```
 */
export function createMarquee(element: HTMLElement, options: MarqueeOptions = {}): MarqueeInstance {
  const {
    speed: initialSpeed = 100,
    speedFactor: initialSpeedFactor = 1,
    direction: initialDirection = 1,
    autoplay = true,
    reducedMotion = prefersReducedMotion(),
    autoClone = true,
  } = options;

  // State
  const state: MarqueeState = {
    speed: initialSpeed,
    speedFactor: initialSpeedFactor,
    direction: initialDirection,
    isPlaying: false,
    isDestroyed: false,
    isInitialized: false,
  };

  // Animation reference
  let animation: Animation | null = null;
  let childWidth = 0;
  let resizeObserver: ResizeObserver | null = null;
  let originalChild: HTMLElement | null = null;
  let clonedChild: HTMLElement | null = null;

  /**
   * Start/restart the animation
   */
  function start(dir: Direction, startProgress?: number): void {
    if (state.isDestroyed || !element || !childWidth) return;

    // Cancel existing animation
    animation?.cancel();

    // Skip animation if reduced motion is preferred
    if (reducedMotion) {
      element.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    const duration = pxPerSecond(childWidth, state.speed);
    if (duration <= 0 || !isFinite(duration)) return;

    // Use percentage-based keyframes for seamless looping
    // Content is duplicated, so -50% = one full content width
    const keyframes: Keyframe[] =
      dir === 1
        ? [{ transform: "translate3d(0%, 0, 0)" }, { transform: "translate3d(-50%, 0, 0)" }]
        : [{ transform: "translate3d(-50%, 0, 0)" }, { transform: "translate3d(0%, 0, 0)" }];

    animation = element.animate(keyframes, {
      duration,
      easing: "linear",
      iterations: Infinity,
    });

    // Apply speed factor via playback rate
    animation.playbackRate = state.speedFactor;

    // Apply initial play state
    if (!state.isPlaying) {
      animation.pause();
    }

    // Resume from specific progress if provided (for seamless direction changes)
    if (startProgress !== undefined && animation.effect) {
      animation.currentTime = duration * startProgress;
    }
  }

  /**
   * Set up resize observer
   */
  function setupResizeObserver(): void {
    if (!originalChild) return;

    resizeObserver = new ResizeObserver(() => {
      updateChildSize();
    });

    resizeObserver.observe(originalChild);
  }

  /**
   * Update child size and restart animation if needed
   */
  function updateChildSize(): void {
    if (!originalChild || !state.isInitialized || !animation?.effect) return;

    const newWidth = originalChild.offsetWidth;

    if (newWidth !== childWidth) {
      const timing = animation.effect.getComputedTiming();
      childWidth = newWidth;

      // Remove and recreate clone
      if (clonedChild?.parentNode === element) {
        element.removeChild(clonedChild);
      }

      if (autoClone) {
        clonedChild = originalChild.cloneNode(true) as HTMLElement;
        element.appendChild(clonedChild);
      }

      start(state.direction, (timing.progress as number) ?? undefined);
    }
  }

  /**
   * Initialize the marquee with content element
   */
  function initialize(child?: HTMLElement): void {
    if (state.isDestroyed || state.isInitialized) return;

    // If no child provided, use first child of element
    originalChild = child || (element.children[0] as HTMLElement) || null;

    if (!originalChild) return;

    // Auto-clone the child for seamless loop
    if (autoClone) {
      clonedChild = originalChild.cloneNode(true) as HTMLElement;
      element.appendChild(clonedChild);
    }

    childWidth = originalChild.offsetWidth;
    state.isInitialized = true;

    // Set up styles
    element.style.willChange = "transform";
    element.style.display = "flex";
    element.style.minWidth = "max-content";

    start(state.direction);
    setupResizeObserver();

    if (autoplay) {
      play();
    }
  }

  // Public API
  function play(): void {
    if (state.isDestroyed || !state.isInitialized) return;
    state.isPlaying = true;
    animation?.play();
  }

  function pause(): void {
    if (state.isDestroyed) return;
    state.isPlaying = false;
    animation?.pause();
  }

  function toggle(): void {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function setSpeed(newSpeed: number): void {
    if (state.isDestroyed || !animation?.effect || !childWidth) return;
    if (state.speed === newSpeed) return;

    const timing = animation.effect.getComputedTiming();
    state.speed = Math.max(0, newSpeed);
    start(state.direction, (timing.progress as number) ?? undefined);
  }

  function setSpeedFactor(newSpeedFactor: number): void {
    if (state.isDestroyed || !animation?.effect) return;

    const speedWithDirection = state.speedFactor * state.direction;
    if (speedWithDirection === newSpeedFactor) return;

    const sign = Math.sign(newSpeedFactor) || 1;
    const hasChangedSign = sign !== Math.sign(speedWithDirection);

    if (!hasChangedSign) {
      // Same direction, just update playback rate
      state.direction = sign === 1 ? 1 : -1;
      state.speedFactor = Math.abs(newSpeedFactor);
      animation.playbackRate = state.speedFactor;
      return;
    }

    // Direction changed - need to restart from inverted progress
    const timing = animation.effect.getComputedTiming();
    const progress = timing.progress as number;

    if (progress === undefined || progress === null) return;

    const nextProgress = 1 - progress;
    state.direction = sign === 1 ? 1 : -1;
    state.speedFactor = Math.abs(newSpeedFactor);

    start(state.direction, nextProgress);
  }

  function setDirection(direction: Direction): void {
    if (state.isDestroyed || state.direction === direction) return;
    setSpeedFactor(state.speedFactor * direction);
  }

  function reverse(): void {
    setDirection(state.direction === 1 ? -1 : 1);
  }

  function getState(): Readonly<MarqueeState> {
    return { ...state };
  }

  function destroy(): void {
    if (state.isDestroyed) return;

    state.isDestroyed = true;
    state.isPlaying = false;
    state.isInitialized = false;

    // Cancel animation
    animation?.cancel();
    animation = null;

    // Disconnect observer
    resizeObserver?.disconnect();
    resizeObserver = null;

    // Remove cloned child
    if (clonedChild?.parentNode === element) {
      element.removeChild(clonedChild);
    }
    clonedChild = null;
    originalChild = null;

    // Clean up styles
    element.style.willChange = "";
    element.style.transform = "";
    element.style.minWidth = "";
  }

  return {
    initialize,
    play,
    pause,
    toggle,
    setSpeed,
    setSpeedFactor,
    setDirection,
    reverse,
    getState,
    destroy,
  };
}

/**
 * Marquee class for OOP usage (vanilla JS)
 *
 * @example
 * ```ts
 * const marquee = new Marquee(element, { speed: 100 });
 * marquee.initialize(contentElement);
 * marquee.play();
 * ```
 */
export class Marquee implements MarqueeInstance {
  private instance: MarqueeInstance;

  constructor(element: HTMLElement, options?: MarqueeOptions) {
    this.instance = createMarquee(element, { ...options, autoplay: false });
  }

  initialize = (content?: HTMLElement) => this.instance.initialize(content);
  play = () => this.instance.play();
  pause = () => this.instance.pause();
  toggle = () => this.instance.toggle();
  setSpeed = (speed: number) => this.instance.setSpeed(speed);
  setSpeedFactor = (factor: number) => this.instance.setSpeedFactor(factor);
  setDirection = (direction: Direction) => this.instance.setDirection(direction);
  reverse = () => this.instance.reverse();
  getState = () => this.instance.getState();
  destroy = () => this.instance.destroy();
}
