"use client";

import { useEffect, useRef, useState } from "react";

// Once the guest has scrolled past this, the cue has served its purpose.
const SCROLL_FADE_THRESHOLD_PX = 40;

type ScrollCueProps = {
  /** Gated by the caller: gate closed, and the last name reveal has settled. */
  visible: boolean;
};

export default function ScrollCue({ visible }: ScrollCueProps) {
  const [scrolled, setScrolled] = useState(false);
  const tickingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > SCROLL_FADE_THRESHOLD_PX);
        tickingRef.current = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shown = visible && !scrolled;

  return (
    <div
      aria-hidden
      className={`pointer-events-none flex flex-col items-center gap-2 text-ink transition-opacity duration-[400ms] ease-out ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="font-serif text-[10px] font-normal uppercase tracking-[0.28em] text-ink/65">
        Scroll
      </span>
      <svg
        width="18"
        height="9"
        viewBox="0 0 18 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        className="motion-safe:animate-[scroll-cue-bob_2.4s_ease-in-out_infinite]"
      >
        <path d="M1 1L9 8L17 1" />
      </svg>
    </div>
  );
}
