# @townhall-gg/marquee

## 0.2.1

### Patch Changes

- Fix duplicate ID issue: cloned elements now have all `id` attributes removed
- Fix accessibility: cloned content is now marked with `aria-hidden="true"` for screen readers
- Add `applyStyles` option to opt-out of automatic layout styles (`display: flex`, `min-width: max-content`)
- Auto-fill narrow content: when content is narrower than container, multiple clones are created to prevent gaps
- Recalculate clones on container resize for responsive behavior

## 0.2.0

### Minor Changes

- bc8094c: Initial release 🎉

  - Blazing-fast marquee animations using Web Animations API (WAAPI)
  - Zero dependencies core package
  - React wrapper with hooks
  - Scroll velocity binding support
  - Direction and speed control
  - Accessible with reduced motion support

### Patch Changes

- Fix seamless loop animation by using pixel-based transforms instead of percentage-based

## 0.1.0

### Minor Changes

- bc8094c: Initial release 🎉
  - Blazing-fast marquee animations using Web Animations API (WAAPI)
  - Zero dependencies core package
  - React wrapper with hooks
  - Scroll velocity binding support
  - Direction and speed control
  - Accessible with reduced motion support
