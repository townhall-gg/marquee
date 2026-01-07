# @townhall-gg/marquee

A blazing-fast, buttery-smooth marquee animation library using the Web Animations API.

[![npm version](https://img.shields.io/npm/v/@townhall-gg/marquee.svg)](https://www.npmjs.com/package/@townhall-gg/marquee)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@townhall-gg/marquee)](https://bundlephobia.com/package/@townhall-gg/marquee)

## Features

- 🚀 **Blazing Fast** - Uses Web Animations API for GPU-accelerated, off-main-thread animations
- 🎯 **Zero Dependencies** - Core package has no dependencies
- 📦 **Tiny Bundle** - Less than 2KB gzipped
- ♿ **Accessible** - Respects `prefers-reduced-motion`
- 🔧 **Framework Agnostic** - Core works with any framework, React bindings included
- 🎮 **Full Control** - Play, pause, reverse, adjust speed on the fly
- 📱 **Responsive** - Automatically adapts to container size changes

## Why Web Animations API?

We leverage the Web Animations API (WAAPI) for several key advantages:

- **Precise Control** - Programmatic control over animation playback, allowing dynamic speed adjustment and direction changes without recreating the animation
- **Performance** - Uses the browser's native animation engine for smooth performance off the main thread
- **Runtime Flexibility** - Modify animation parameters (speed, direction) on the fly

## Installation

```bash
# Core (vanilla JS)
pnpm add @townhall-gg/marquee

# React
pnpm add @townhall-gg/marquee-react
```

## Quick Start

### React

```tsx
import { Marquee } from "@townhall-gg/marquee-react";

function App() {
  return (
    <Marquee speed={100} direction={1}>
      <span>Your scrolling content here&nbsp;</span>
    </Marquee>
  );
}
```

### Vanilla JavaScript

```ts
import { Marquee } from "@townhall-gg/marquee";

const element = document.getElementById("marquee-root");

const marquee = new Marquee(element, {
  speed: 100,
  direction: 1,
  speedFactor: 1,
});

marquee.initialize(element.children[0]);
marquee.play();
```

## React API

### `<Marquee>` Component

```tsx
<Marquee
  speed={100} // Base speed in px/s (default: 100)
  speedFactor={1} // Speed multiplier (default: 1)
  direction={1} // 1 = left, -1 = right (default: 1)
  play={true} // Play/pause state (default: true)
  repeat={2} // Times to duplicate content (default: 2)
  gap={16} // Gap between repeated content
  className="my-marquee"
  marqueeClassName="my-content"
  onReady={(instance) => console.log("Ready!")}
>
  <YourContent />
</Marquee>
```

### Props

- `speed` (number): Base speed of the marquee animation in px/s
- `speedFactor` (number): Multiplier for the base speed
- `direction` (1 | -1): Direction of movement (1 for right-to-left, -1 for left-to-right)
- `play` (boolean): Controls whether the marquee is playing or paused (default: true)
- `className` (string): Class name for the root container
- `marqueeClassName` (string): Class name for the marquee element
- `repeat` (number): Times to duplicate content (default: 2)
- `gap` (number | string): Gap between repeated content
- `instance` (tuple): Pass a useMarquee tuple for external control
- `onReady` (function): Callback when marquee is ready

### `useMarquee` Hook

For more control, use the `useMarquee` hook. Returns a tuple `[ref, marquee]`:

```tsx
import { useMarquee, Marquee } from "@townhall-gg/marquee-react";
import { useLenis } from "lenis/react";

function ScrollVelocityMarquee({ inverted }: { inverted?: boolean }) {
  const [ref, marquee] = useMarquee({
    speed: 100,
    speedFactor: 1,
    direction: inverted ? -1 : 1,
  });

  useLenis(({ velocity }) => {
    if (!marquee) return;
    const sign = Math.sign(velocity) || 1;
    marquee.setSpeedFactor((1 * sign + velocity / 5) * (inverted ? -1 : 1));
  });

  return (
    <Marquee instance={[ref, marquee]}>
      <MarqueeContent />
    </Marquee>
  );
}
```

The `useMarquee` hook returns a tuple containing:

- `ref`: A ref to attach to your container element
- `marquee`: A marquee instance with methods:
  - `play()`: Start the marquee animation
  - `pause()`: Pause the marquee animation
  - `toggle()`: Toggle play/pause
  - `setSpeed(speed: number)`: Update the base speed
  - `setSpeedFactor(factor: number)`: Update the speed multiplier
  - `setDirection(direction: 1 | -1)`: Change the scroll direction
  - `reverse()`: Flip direction
  - `getState()`: Get current state
  - `destroy()`: Clean up the marquee (automatically called on unmount)

## Core API

### `new Marquee(element, options)`

Creates a marquee instance (OOP style for vanilla JS).

```ts
import { Marquee } from "@townhall-gg/marquee";

const element = document.getElementById("marquee-root");

const marquee = new Marquee(element, {
  speed: 100, // px/s (default: 100)
  speedFactor: 1, // Multiplier (default: 1)
  direction: 1, // 1 or -1 (default: 1)
});

// Initialize with the content element
marquee.initialize(element.children[0]);
marquee.play();
```

### `createMarquee(element, options)`

Functional API for creating marquees.

```ts
import { createMarquee } from "@townhall-gg/marquee";

const marquee = createMarquee(element, { speed: 100 });
marquee.play();
```

### Instance Methods

```ts
marquee.initialize(content); // Initialize with content element (vanilla JS)
marquee.play(); // Start animation
marquee.pause(); // Pause animation
marquee.toggle(); // Toggle play/pause
marquee.setSpeed(200); // Set base speed
marquee.setSpeedFactor(1.5); // Set speed multiplier
marquee.setDirection(-1); // Change direction
marquee.reverse(); // Flip direction
marquee.getState(); // Get current state
marquee.destroy(); // Clean up
```

## Notes

- The marquee component only supports a single child element. Wrap multiple elements in a container if needed.
- The marquee automatically handles cleanup on unmount.
- The component provides built-in styles for proper overflow handling and content positioning.
- You are responsible for making the marquee cover the full width of its render area. This library **DOES NOT** auto-fill that space.

## Accessibility

The marquee automatically respects `prefers-reduced-motion`. When enabled, no animation occurs and content remains static.

You can override this:

```ts
new Marquee(element, { reducedMotion: false });
```

## Running the Demo

```bash
cd marquee
pnpm install
pnpm build
pnpm --filter=@townhall-gg/marquee-demo dev
```

Then open http://localhost:3333

## Browser Support

Works in all modern browsers that support [Web Animations API](https://caniuse.com/web-animation) (95%+ global support).

## License

MIT © [Townhall](https://th.gg)
