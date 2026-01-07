"use client";

import { useState, useRef, useEffect } from "react";
import { Marquee, useMarquee, type MarqueeRef } from "@townhall-gg/marquee-react";

// Townhall Logo
function TownhallLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <img
      src="https://cdn.townhall.gg/TownHall/da46fc5a-9428-4076-a741-5e7871b9ca8d/47d26eaf-1855-4dd8-bf7b-d1a04ee2cf61/c2989029-608b-4ea0-b209-c7d1e9117330.svg"
      alt="Townhall"
      className={className}
    />
  );
}

// Icons
function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <path stroke="currentColor" strokeWidth="2.5" d="M8 6v20l18-10L8 6Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <path
        stroke="currentColor"
        strokeWidth="2.5"
        d="M6.5 5.5H12v21H6.5V5.5ZM20 5.5h5.5v21H20V5.5Z"
      />
    </svg>
  );
}

function LeftArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <path
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="2.5"
        d="m13 8-8 8 8 8m-6-8h20"
      />
    </svg>
  );
}

function RightArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <path
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="2.5"
        d="m19 8 8 8-8 8m6-8H5"
      />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 86 87"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M56.9097 27.5281L43.7907 0.0351563L30.6717 27.5281L0.470276 31.5093L22.5637 52.482L17.0172 82.4354L43.7907 67.9043L70.5641 82.4354L65.0176 52.482L87.111 31.5093L56.9097 27.5281Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 49" fill="none" aria-hidden="true">
      <path
        d="M24 4.4C35.05 4.4 44 13.35 44 24.4C43.999 28.59 42.684 32.68 40.24 36.08C37.795 39.48 34.345 42.04 30.375 43.38C29.375 43.58 29 42.95 29 42.43C29 41.75 29.025 39.6 29.025 36.93C29.025 35.05 28.4 33.85 27.675 33.23C32.125 32.73 36.8 31.03 36.8 23.35C36.8 21.15 36.025 19.38 34.75 17.98C34.95 17.48 35.65 15.43 34.55 12.68C34.55 12.68 32.875 12.13 29.05 14.73C27.45 14.28 25.75 14.05 24.05 14.05C22.35 14.05 20.65 14.28 19.05 14.73C15.225 12.15 13.55 12.68 13.55 12.68C12.45 15.43 13.15 17.48 13.35 17.98C12.075 19.38 11.3 21.18 11.3 23.35C11.3 31 15.95 32.73 20.4 33.23C19.825 33.73 19.3 34.6 19.125 35.9C17.975 36.43 15.1 37.28 13.3 34.25C12.925 33.65 11.8 32.18 10.225 32.2C8.55 32.23 9.55 33.15 10.25 33.53C11.1 34 12.075 35.78 12.3 36.35C12.7 37.48 14 39.63 19.025 38.7C19.025 40.38 19.05 41.95 19.05 42.43C19.05 42.95 18.675 43.55 17.675 43.38C13.692 42.05 10.227 39.5 7.772 36.1C5.318 32.69 3.998 28.6 4 24.4C4 13.35 12.95 4.4 24 4.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

// Control button
function ControlButton({
  onClick,
  active,
  children,
  className = "",
  ariaLabel,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={`btn w-14 h-14 ${active ? "btn-primary" : "btn-secondary"} ${className}`}
    >
      {children}
    </button>
  );
}

// Tech logos for image marquee
const TECH_LOGOS = [
  {
    name: "React",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Next.js",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  },
  {
    name: "TypeScript",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "Tailwind",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  },
  {
    name: "Vercel",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
  },
  {
    name: "GitHub",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  },
  {
    name: "Figma",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  },
  {
    name: "VS Code",
    url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
  },
];

export default function DemoPage() {
  // Interactive marquee state
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(300);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [speedFactor, setSpeedFactor] = useState(0.5);
  const [copied, setCopied] = useState(false);
  const marqueeRef = useRef<MarqueeRef>(null);

  // Update marquee when controls change
  useEffect(() => {
    if (marqueeRef.current) {
      marqueeRef.current.setSpeedFactor(speedFactor);
    }
  }, [speedFactor]);

  const handleCopy = () => {
    navigator.clipboard.writeText("pnpm add @townhall-gg/marquee-react");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <main id="main-content" className="min-h-screen">
        {/* Header */}
        <header className="fixed top-0 left-1/2 -translate-x-1/2 z-50 bg-white text-[#0a0a0a] px-6 h-14 rounded-b-2xl flex items-center gap-5 shadow-lg">
          <a
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
            aria-label="Townhall Marquee home"
          >
            <TownhallLogo className="w-6 h-6" />
            <span>townhall</span>
          </a>
          <nav className="flex items-center gap-4 mono text-sm" aria-label="Main navigation">
            <a
              href="https://github.com/townhall-gg/marquee"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              GitHub
            </a>
            <a
              href="https://th.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              Townhall
            </a>
          </nav>
        </header>

        {/* Hero Section */}
        <section
          className="flex flex-col items-center pt-36 pb-20 px-6"
          aria-labelledby="hero-title"
        >
          <p className="mono font-medium text-base uppercase tracking-widest mb-4 text-[rgba(255,255,255,0.5)]">
            The All-In-One Marquee
          </p>

          {/* Hero Marquee */}
          <div className="w-full marquee-mask" aria-hidden="true">
            <Marquee speed={120} direction={1} repeat={8}>
              <span className="font-bold uppercase whitespace-nowrap text-5xl md:text-7xl lg:text-8xl tracking-tight px-4">
                @townhall-gg/marquee
              </span>
            </Marquee>
          </div>

          {/* Install command */}
          <div className="flex h-11 bg-[#1a1a1a] border border-[rgba(255,255,255,0.12)] rounded-lg mt-10 items-center overflow-hidden">
            <div className="px-4 h-full flex items-center border-r border-[rgba(255,255,255,0.12)]">
              <span className="mono text-[rgba(255,255,255,0.5)] text-sm">pnpm</span>
            </div>
            <div className="px-5 mono text-white text-sm">add @townhall-gg/marquee-react</div>
            <button
              className="h-full px-4 border-l border-[rgba(255,255,255,0.12)] text-[rgba(255,255,255,0.5)] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              onClick={handleCopy}
              aria-label={copied ? "Copied!" : "Copy install command"}
            >
              {copied ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4 text-green-400"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <CopyIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </section>

        {/* Tagline Section */}
        <section className="py-14 bg-[#111111]" aria-label="Features marquee">
          <div className="marquee-mask" aria-hidden="true">
            <Marquee speed={80} direction={-1} repeat={12}>
              <span className="mono font-medium uppercase whitespace-nowrap text-xl text-[rgba(255,255,255,0.4)] px-4">
                Performant marquee animations built on top of Web Animations API
              </span>
            </Marquee>
          </div>
          <div className="marquee-mask -mt-2" aria-hidden="true">
            <Marquee speed={100} direction={1} repeat={6}>
              <div className="flex items-center gap-10 px-6">
                <span className="font-bold uppercase whitespace-nowrap text-6xl md:text-8xl lg:text-9xl tracking-tight">
                  THE ONLY
                </span>
                <StarIcon className="w-12 h-12 md:w-20 md:h-20 text-[#3b82f6]" />
                <span className="font-bold uppercase whitespace-nowrap text-6xl md:text-8xl lg:text-9xl tracking-tight">
                  MARQUEE
                </span>
                <StarIcon className="w-12 h-12 md:w-20 md:h-20 text-[#3b82f6]" />
                <span className="font-bold uppercase whitespace-nowrap text-6xl md:text-8xl lg:text-9xl tracking-tight">
                  YOU NEED
                </span>
                <StarIcon className="w-12 h-12 md:w-20 md:h-20 text-[#3b82f6]" />
              </div>
            </Marquee>
          </div>
        </section>

        {/* Interactive Controls Section */}
        <section className="py-20 px-6" aria-labelledby="controls-title">
          <h2 id="controls-title" className="sr-only">
            Interactive Controls
          </h2>
          <div className="max-w-5xl mx-auto">
            {/* Controls */}
            <div className="flex flex-wrap gap-6 justify-center items-end bg-[#111111] border border-[rgba(255,255,255,0.08)] p-6 rounded-xl mb-6">
              {/* Play/Pause */}
              <div className="flex flex-col gap-2 items-center">
                <span className="mono text-[rgba(255,255,255,0.5)] font-medium uppercase text-xs">
                  State
                </span>
                <ControlButton
                  onClick={() => setIsPlaying(!isPlaying)}
                  active={isPlaying}
                  ariaLabel={isPlaying ? "Pause marquee" : "Play marquee"}
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </ControlButton>
              </div>

              {/* Direction */}
              <div className="flex flex-col gap-2 items-center">
                <span className="mono text-[rgba(255,255,255,0.5)] font-medium uppercase text-xs">
                  Direction
                </span>
                <div className="flex gap-2" role="group" aria-label="Direction controls">
                  <ControlButton
                    onClick={() => setDirection(1)}
                    active={direction === 1}
                    ariaLabel="Scroll left"
                  >
                    <LeftArrow />
                  </ControlButton>
                  <ControlButton
                    onClick={() => setDirection(-1)}
                    active={direction === -1}
                    ariaLabel="Scroll right"
                  >
                    <RightArrow />
                  </ControlButton>
                </div>
              </div>

              {/* Speed Factor */}
              <div className="flex flex-col gap-2 items-center">
                <label
                  htmlFor="speed-factor"
                  className="mono text-[rgba(255,255,255,0.5)] font-medium uppercase text-xs"
                >
                  Speed Factor: {Math.round(speedFactor * 100)}%
                </label>
                <div className="w-64 bg-[#1a1a1a] h-14 rounded-lg flex items-center px-4 border border-[rgba(255,255,255,0.08)]">
                  <input
                    id="speed-factor"
                    type="range"
                    min="0"
                    max="2"
                    step="0.01"
                    value={speedFactor}
                    onChange={(e) => setSpeedFactor(Number(e.target.value))}
                    className="w-full"
                    aria-valuemin={0}
                    aria-valuemax={2}
                    aria-valuenow={speedFactor}
                  />
                </div>
              </div>

              {/* Speed Presets */}
              <div className="flex flex-col gap-2 items-center">
                <span className="mono text-[rgba(255,255,255,0.5)] font-medium uppercase text-xs">
                  Speed (px/s)
                </span>
                <div className="flex gap-2" role="group" aria-label="Speed presets">
                  {[100, 300, 500].map((s) => (
                    <ControlButton
                      key={s}
                      onClick={() => setSpeed(s)}
                      active={speed === s}
                      ariaLabel={`Set speed to ${s} pixels per second`}
                    >
                      <span className="text-sm font-semibold">{s}</span>
                    </ControlButton>
                  ))}
                </div>
              </div>
            </div>

            {/* Demo Marquee */}
            <div
              className="bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded-xl py-10 marquee-mask"
              aria-hidden="true"
            >
              <Marquee
                ref={marqueeRef}
                speed={speed}
                speedFactor={speedFactor}
                direction={direction}
                play={isPlaying}
                repeat={8}
              >
                <span className="font-bold uppercase whitespace-nowrap text-4xl md:text-6xl tracking-tight px-6">
                  TOWNHALL MARQUEE
                </span>
              </Marquee>
            </div>
          </div>
        </section>

        {/* Image/Logo Marquee Section */}
        <section className="py-20 bg-white text-[#0a0a0a]" aria-labelledby="images-title">
          <div className="text-center mb-10 px-6">
            <h2
              id="images-title"
              className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-3"
            >
              Works With Images
            </h2>
            <p className="mono text-base text-[rgba(10,10,10,0.6)]">
              Seamlessly scroll logos, photos, or any content
            </p>
          </div>

          {/* Logo Marquee */}
          <div className="py-6" aria-hidden="true">
            <Marquee speed={60} direction={1} repeat={4}>
              <div className="flex items-center">
                {TECH_LOGOS.map((logo) => (
                  <div
                    key={logo.name}
                    className="flex items-center justify-center px-8 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <img
                      src={logo.url}
                      alt={logo.name}
                      className="h-10 w-auto"
                      style={{ filter: "brightness(0)" }}
                    />
                  </div>
                ))}
              </div>
            </Marquee>
          </div>

          {/* Reverse direction */}
          <div className="py-6" aria-hidden="true">
            <Marquee speed={80} direction={-1} repeat={4}>
              <div className="flex items-center">
                {[...TECH_LOGOS].reverse().map((logo) => (
                  <div
                    key={logo.name}
                    className="flex items-center justify-center px-8 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <img
                      src={logo.url}
                      alt={logo.name}
                      className="h-10 w-auto"
                      style={{ filter: "brightness(0)" }}
                    />
                  </div>
                ))}
              </div>
            </Marquee>
          </div>
        </section>

        {/* Text Content Marquee */}
        <section className="py-20" aria-labelledby="content-title">
          <div className="text-center mb-10 px-6">
            <h2
              id="content-title"
              className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-3"
            >
              Rich Content Support
            </h2>
            <p className="mono text-base text-[rgba(255,255,255,0.5)]">
              Cards, badges, any React components
            </p>
          </div>

          <div aria-hidden="true">
            <Marquee speed={50} direction={1} repeat={3} gap={24}>
              <div className="flex items-center gap-4">
                {[
                  "React 19",
                  "Next.js 16",
                  "TypeScript 5",
                  "WAAPI",
                  "Zero Dependencies",
                  "< 2KB gzipped",
                ].map((text) => (
                  <div
                    key={text}
                    className="px-5 py-2.5 rounded-full border border-[rgba(255,255,255,0.2)] font-semibold text-base whitespace-nowrap"
                  >
                    {text}
                  </div>
                ))}
              </div>
            </Marquee>

            <div className="mt-6">
              <Marquee speed={70} direction={-1} repeat={3} gap={24}>
                <div className="flex items-center gap-4">
                  {[
                    "GPU Accelerated",
                    "Off Main Thread",
                    "Scroll Velocity",
                    "Play/Pause",
                    "Direction Control",
                    "Speed Factor",
                  ].map((text) => (
                    <div
                      key={text}
                      className="px-5 py-2.5 rounded-full bg-white text-[#0a0a0a] font-semibold text-base whitespace-nowrap"
                    >
                      {text}
                    </div>
                  ))}
                </div>
              </Marquee>
            </div>
          </div>
        </section>

        {/* Code Example Section */}
        <section className="py-20 px-6 bg-[#111111]" aria-labelledby="code-title">
          <div className="max-w-3xl mx-auto">
            <h2
              id="code-title"
              className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-8 text-center"
            >
              Quick Start
            </h2>

            <pre className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 overflow-x-auto mono text-sm leading-relaxed">
              <code className="text-[rgba(255,255,255,0.85)]">{`import { Marquee, useMarquee } from "@townhall-gg/marquee-react";

// Basic usage
<Marquee speed={100} direction={1}>
  <span>Your content here&nbsp;</span>
</Marquee>

// With hook for scroll velocity binding
const [ref, marquee] = useMarquee({ speed: 100 });

useLenis(({ velocity }) => {
  marquee?.setSpeedFactor(1 + velocity / 5);
});

<Marquee instance={[ref, marquee]}>
  <span>Scroll-bound content&nbsp;</span>
</Marquee>`}</code>
            </pre>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-28 text-center px-6" aria-labelledby="cta-title">
          <h2 id="cta-title" className="sr-only">
            Get Started
          </h2>
          <div className="mb-10">
            <p className="mono text-base text-[rgba(255,255,255,0.5)] mb-8">
              We're always cooking, so if you don't want to miss a thing
            </p>
            <div className="flex flex-col items-center gap-5 text-xl font-bold uppercase">
              <a
                href="https://github.com/townhall-gg/marquee"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-[#3b82f6] transition-colors"
              >
                <span>Leave that</span>
                <StarIcon className="w-8 h-8" />
                <span>Star</span>
              </a>
              <a
                href="https://github.com/townhall-gg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-[#3b82f6] transition-colors"
              >
                <span>Follow us on</span>
                <GitHubIcon className="w-8 h-8" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          <p className="mono text-sm text-[rgba(255,255,255,0.4)]">
            Made with ❤️ by{" "}
            <a href="https://th.gg" className="underline hover:text-white transition-colors">
              Townhall
            </a>
          </p>
        </section>

        {/* Footer Marquee */}
        <footer className="bg-white py-3" aria-hidden="true">
          <Marquee speed={150} direction={1} repeat={10}>
            <span className="font-bold uppercase whitespace-nowrap text-2xl text-[#0a0a0a] px-4">
              TOWNHALL MARQUEE • WEB ANIMATIONS API • BLAZING FAST •
            </span>
          </Marquee>
        </footer>
      </main>
    </>
  );
}
