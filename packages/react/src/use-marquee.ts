"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createMarquee, type MarqueeInstance, type MarqueeOptions } from "@townhall-gg/marquee";

export type UseMarqueeOptions = {
  speed?: number;
  speedFactor?: number;
  direction?: 1 | -1;
  play?: boolean;
  autoClone?: boolean;
  onReady?: () => void;
};

/**
 * Tuple return type: [ref, marquee]
 */
export type UseMarqueeTuple = readonly [React.RefCallback<HTMLDivElement>, MarqueeInstance | null];

/**
 * Hook for creating and controlling a marquee animation
 * Returns a tuple [ref, marquee] for easy destructuring
 *
 * @example
 * ```tsx
 * const [ref, marquee] = useMarquee({ speed: 100, direction: 1 });
 *
 * // Control via marquee instance
 * marquee?.setSpeedFactor(2);
 * marquee?.reverse();
 *
 * return (
 *   <Marquee instance={[ref, marquee]}>
 *     <Content />
 *   </Marquee>
 * );
 * ```
 *
 * @example With scroll velocity (Lenis)
 * ```tsx
 * const [ref, marquee] = useMarquee({ speed: 100 });
 *
 * useLenis(({ velocity }) => {
 *   if (!marquee) return;
 *   marquee.setSpeedFactor(1 + velocity / 5);
 * });
 * ```
 */
export function useMarquee({
  speed = 100,
  speedFactor = 1,
  direction = 1,
  play = true,
  autoClone = true,
  onReady,
}: UseMarqueeOptions = {}): UseMarqueeTuple {
  const [marquee, setMarquee] = useState<MarqueeInstance | null>(null);
  const marqueeRef = useRef<MarqueeInstance | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      marqueeRef.current?.destroy();
      marqueeRef.current = null;
    };
  }, []);

  // Handle play state
  useEffect(() => {
    if (!marquee) return;
    if (play) {
      marquee.play();
    } else {
      marquee.pause();
    }
  }, [play, marquee]);

  // Callback ref for the element
  const ref = useCallback(
    (element: HTMLDivElement | null) => {
      // Cleanup previous instance
      if (marqueeRef.current) {
        marqueeRef.current.destroy();
        marqueeRef.current = null;
        setMarquee(null);
      }

      elementRef.current = element;

      // Create new instance if element exists
      if (element) {
        const children = element.children;
        if (children.length === 0) return;

        const instance = createMarquee(element, {
          speed,
          speedFactor,
          direction,
          autoplay: play,
          autoClone,
        });

        // Initialize with first child
        instance.initialize(children[0] as HTMLElement);

        marqueeRef.current = instance;
        setMarquee(instance);
        onReady?.();
      }
    },
    // Only recreate on mount, not on prop changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return [ref, marquee] as const;
}
