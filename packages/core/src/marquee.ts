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
 * Sanitize a cloned element for marquee use:
 * - Removes all id attributes to prevent duplicate IDs in the DOM
 * - Adds aria-hidden="true" so screen readers don't read duplicate content
 */
function sanitizeClonedElement(element: HTMLElement): void {
  // Hide from screen readers - it's a visual duplicate
  element.setAttribute("aria-hidden", "true");

  // Remove id from the clone itself
  if (element.id) {
    element.removeAttribute("id");
  }

  // Recursively remove id from all descendants
  const elementsWithId = element.querySelectorAll("[id]");
  elementsWithId.forEach((el) => {
    el.removeAttribute("id");
  });
}

/**
 * Calculate how many clones are needed to fill at least 2x the container width.
 * This prevents gaps when content is narrower than the container.
 */
function calculateRequiredClones(childWidth: number, containerWidth: number): number {
  if (childWidth <= 0) return 1;
  // We need total content width >= 2x container width for seamless looping
  // Total width = childWidth * (1 + numClones), so numClones >= (2 * containerWidth / childWidth) - 1
  const minTotalWidth = containerWidth * 2;
  const numClones = Math.ceil(minTotalWidth / childWidth);
  // At minimum, we need 1 clone for the seamless loop
  return Math.max(1, numClones);
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
    applyStyles = true,
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
  let clonedChildren: HTMLElement[] = [];

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

    // Duration is based on scrolling one full content width
    const duration = pxPerSecond(childWidth, state.speed);
    if (duration <= 0 || !isFinite(duration)) return;

    // Use pixel-based keyframes for precise seamless looping
    // We translate exactly one content width, then the animation loops
    const translateAmount = childWidth;
    const keyframes: Keyframe[] =
      dir === 1
        ? [
            { transform: "translate3d(0px, 0, 0)" },
            { transform: `translate3d(-${translateAmount}px, 0, 0)` },
          ]
        : [
            { transform: `translate3d(-${translateAmount}px, 0, 0)` },
            { transform: "translate3d(0px, 0, 0)" },
          ];

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
   * Set up resize observer for both content and container
   */
  function setupResizeObserver(): void {
    if (!originalChild) return;

    resizeObserver = new ResizeObserver(() => {
      updateChildSize();
    });

    // Observe content for size changes
    resizeObserver.observe(originalChild);

    // Also observe container parent for viewport/layout changes
    // This ensures we recalculate clones when container width changes
    if (element.parentElement) {
      resizeObserver.observe(element.parentElement);
    }
  }

  // Track container width to detect when we need to recalculate clones
  let lastContainerWidth = 0;

  /**
   * Update child size and restart animation if needed
   */
  function updateChildSize(): void {
    if (!originalChild || !state.isInitialized || !animation?.effect) return;

    const newWidth = originalChild.offsetWidth;
    const containerWidth = element.parentElement?.offsetWidth || element.offsetWidth;
    const containerChanged = containerWidth !== lastContainerWidth;

    if (newWidth !== childWidth || containerChanged) {
      const timing = animation.effect.getComputedTiming();
      childWidth = newWidth;
      lastContainerWidth = containerWidth;

      // Recreate clones with new sizing
      if (autoClone) {
        createClones();
      }

      start(state.direction, (timing.progress as number) ?? undefined);
    }
  }

  /**
   * Remove all cloned children from the DOM
   */
  function removeClones(): void {
    for (const clone of clonedChildren) {
      if (clone.parentNode === element) {
        element.removeChild(clone);
      }
    }
    clonedChildren = [];
  }

  /**
   * Create clones to fill the container width for seamless looping
   */
  function createClones(): void {
    if (!originalChild || !autoClone) return;

    removeClones();

    const contentWidth = originalChild.offsetWidth;
    const containerWidth = element.parentElement?.offsetWidth || element.offsetWidth;
    const numClones = calculateRequiredClones(contentWidth, containerWidth);

    for (let i = 0; i < numClones; i++) {
      const clone = originalChild.cloneNode(true) as HTMLElement;
      sanitizeClonedElement(clone);
      element.appendChild(clone);
      clonedChildren.push(clone);
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

    // Set up styles first (can be disabled if user handles layout themselves)
    if (applyStyles) {
      element.style.willChange = "transform";
      element.style.display = "flex";
      element.style.minWidth = "max-content";
    }

    // Auto-clone the child for seamless loop (creates enough clones to fill container)
    if (autoClone) {
      createClones();
    }

    childWidth = originalChild.offsetWidth;
    state.isInitialized = true;

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

    // Remove all cloned children
    removeClones();
    originalChild = null;

    // Clean up styles (only if we applied them)
    if (applyStyles) {
      element.style.willChange = "";
      element.style.display = "";
      element.style.minWidth = "";
    }
    element.style.transform = "";
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
