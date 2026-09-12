"use client";

import { type CSSProperties, useEffect, useLayoutEffect, useMemo, useState } from "react";

const PETAL_COUNT = 12;
// blush, dusty rose, cream, pale sage — blush/sage match the site's own
// `blush`/`sage` tokens; the other two are specific to this effect.
const PETAL_COLORS = ["#E8C3C6", "#D9A99C", "#F2E4C9", "#9AA890"];

type Petal = {
  id: number;
  size: number;
  color: string;
  left: number;
  duration: number;
  delay: number;
  sway: number;
  rotate: number;
  opacity: number;
};

// Custom properties consumed by the single shared @keyframes petal-fall
// (globals.css) — this is what lets 12 petals share one keyframe set
// instead of needing one each.
type PetalStyle = CSSProperties & {
  "--petal-sway": string;
  "--petal-rotate": string;
  "--petal-opacity": number;
};

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomSign(): 1 | -1 {
  return Math.random() < 0.5 ? -1 : 1;
}

function randomColor(): string {
  return PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
}

export default function FallingPetals() {
  const [hidden, setHidden] = useState(false);
  const [paused, setPaused] = useState(false);

  // Render nothing at all for reduced-motion guests — this runs before
  // paint so there's no flash of petals first.
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHidden(true);
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => setPaused(document.hidden);
    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Computed once on mount and never again, so petals don't jump or
  // reshuffle on unrelated re-renders (e.g. the paused state above).
  const petals = useMemo<Petal[]>(
    () =>
      Array.from({ length: PETAL_COUNT }, (_, id) => ({
        id,
        size: randomBetween(8, 16),
        color: randomColor(),
        left: randomBetween(0, 100),
        duration: randomBetween(16, 28),
        delay: randomBetween(0, 22),
        sway: randomBetween(10, 28) * randomSign(),
        rotate: randomBetween(180, 420) * randomSign(),
        opacity: randomBetween(0.3, 0.5),
      })),
    [],
  );

  if (hidden) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-40 overflow-hidden ${
        paused ? "petals-paused" : ""
      }`}
    >
      {petals.map((petal) => {
        const style: PetalStyle = {
          left: `${petal.left}%`,
          width: petal.size,
          height: petal.size,
          animationDuration: `${petal.duration}s`,
          animationDelay: `${petal.delay}s`,
          "--petal-sway": `${petal.sway}px`,
          "--petal-rotate": `${petal.rotate}deg`,
          "--petal-opacity": petal.opacity,
        };

        return (
          <span key={petal.id} className="petal absolute top-0" style={style}>
            <svg viewBox="0 0 16 16" width={petal.size} height={petal.size}>
              <path
                d="M8 0C11 3 14 6 14 9.5C14 12.5 11.5 15 8 16C4.5 15 2 12.5 2 9.5C2 6 5 3 8 0Z"
                fill={petal.color}
              />
            </svg>
          </span>
        );
      })}
    </div>
  );
}
