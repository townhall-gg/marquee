"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { Direction, MarqueeInstance } from "@townhall-gg/marquee";
import { useMarquee, type UseMarqueeTuple } from "./use-marquee";

export interface MarqueeProps {
  /** Content to scroll. Will be auto-cloned for seamless loop. */
  children: ReactNode;
  /** Base speed in pixels per second. Default: 100 */
  speed?: number;
  /** Speed multiplier. Default: 1 */
  speedFactor?: number;
  /** Direction: 1 = left, -1 = right. Default: 1 */
  direction?: Direction;
  /** Whether the marquee is playing. Default: true */
  play?: boolean;
  /** Class name for the root container */
  className?: string;
  /** Class name for the marquee element */
  marqueeClassName?: string;
  /** Style for the root container */
  style?: CSSProperties;
  /** Pass an existing useMarquee tuple [ref, marquee] */
  instance?: UseMarqueeTuple;
  /** Callback when marquee is ready */
  onReady?: (instance: MarqueeInstance) => void;
  /** Number of times to repeat content (in case autoClone isn't enough). Default: 1 */
  repeat?: number;
  /** Gap between content items */
  gap?: number | string;
}

export interface MarqueeRef {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setSpeed: (speed: number) => void;
  setSpeedFactor: (factor: number) => void;
  setDirection: (direction: Direction) => void;
  reverse: () => void;
  getInstance: () => MarqueeInstance | null;
}

// Root container styles - matches JOYCO's overflow approach
const rootStyles: CSSProperties = {
  overflowX: "clip",
  overflowY: "visible",
  maxWidth: "100%",
};

// Marquee instance styles
const marqueeStyles: CSSProperties = {
  minWidth: "max-content",
  display: "flex",
};

/**
 * Marquee component for creating smooth, infinite scrolling content
 *
 * @example Basic usage
 * ```tsx
 * <Marquee speed={100} direction={1}>
 *   <span>Your scrolling content here&nbsp;</span>
 * </Marquee>
 * ```
 *
 * @example With useMarquee hook (for external control)
 * ```tsx
 * function ScrollBoundMarquee({ inverted }: { inverted?: boolean }) {
 *   const [ref, marquee] = useMarquee({ speed: 100, direction: inverted ? -1 : 1 });
 *
 *   useLenis(({ velocity }) => {
 *     if (!marquee) return;
 *     const sign = Math.sign(velocity) || 1;
 *     marquee.setSpeedFactor((1 * sign + velocity / 5) * (inverted ? -1 : 1));
 *   });
 *
 *   return (
 *     <Marquee instance={[ref, marquee]}>
 *       <span>Content&nbsp;</span>
 *     </Marquee>
 *   );
 * }
 * ```
 */
export const Marquee = forwardRef<MarqueeRef, MarqueeProps>(function Marquee(
  {
    children,
    speed = 100,
    speedFactor = 1,
    direction = 1,
    play = true,
    className,
    marqueeClassName,
    style,
    instance: externalInstance,
    onReady,
    repeat = 1,
    gap,
  },
  forwardedRef,
) {
  // Use external instance tuple or create internal one
  const internalTuple = useMarquee({ speed, speedFactor, direction, play });
  const [ref, marquee] = externalInstance ?? internalTuple;

  // Sync props to marquee instance
  useEffect(() => {
    if (!marquee || externalInstance) return;
    marquee.setSpeed(speed);
  }, [speed, marquee, externalInstance]);

  useEffect(() => {
    if (!marquee || externalInstance) return;
    marquee.setSpeedFactor(speedFactor);
  }, [speedFactor, marquee, externalInstance]);

  useEffect(() => {
    if (!marquee || externalInstance) return;
    marquee.setDirection(direction);
  }, [direction, marquee, externalInstance]);

  useEffect(() => {
    if (!marquee) return;
    if (play) {
      marquee.play();
    } else {
      marquee.pause();
    }
  }, [play, marquee]);

  // Notify when ready
  useEffect(() => {
    if (marquee && onReady) {
      onReady(marquee);
    }
  }, [marquee, onReady]);

  // Expose imperative handle
  useImperativeHandle(
    forwardedRef,
    () => ({
      play: () => marquee?.play(),
      pause: () => marquee?.pause(),
      toggle: () => marquee?.toggle(),
      setSpeed: (s: number) => marquee?.setSpeed(s),
      setSpeedFactor: (f: number) => marquee?.setSpeedFactor(f),
      setDirection: (d: Direction) => marquee?.setDirection(d),
      reverse: () => marquee?.reverse(),
      getInstance: () => marquee,
    }),
    [marquee],
  );

  // Build content with optional repeats and gap
  const gapStyle = gap ? { paddingRight: typeof gap === "number" ? `${gap}px` : gap } : {};
  const content =
    repeat > 1 ? (
      <div className="flex" style={gapStyle}>
        {Array.from({ length: repeat }).map((_, i) => (
          <div key={i} style={i < repeat - 1 ? gapStyle : undefined}>
            {children}
          </div>
        ))}
      </div>
    ) : (
      <div className="flex" style={gapStyle}>
        {children}
      </div>
    );

  return (
    <div className={className} style={{ ...rootStyles, ...style }} aria-hidden="true">
      <div ref={ref} className={marqueeClassName} style={marqueeStyles}>
        {content}
      </div>
    </div>
  );
});
