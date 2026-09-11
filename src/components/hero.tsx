"use client";

import { type ReactNode, useEffect, useState } from "react";
import { INVITATION_CONTENT, MONOGRAM_LABEL } from "@/lib/invitation-content";
import MonogramMark from "@/components/monogram-mark";

type HeroProps = {
  gateClosed: boolean;
};

// The oval cartouche's usable width, measured directly from hero-frame.jpg,
// as a percentage of the IMAGE's own height and width. The wrapper below
// renders the image at its native 0.5625 ratio (object-contain, letterboxed
// on the paper background rather than cropped), so these percentages track
// the artwork itself regardless of viewport aspect ratio. Interpolated
// linearly between anchors; held flat past either end.
const OVAL_WIDTH_ANCHORS: Array<[heightPercent: number, widthVw: number]> = [
  [32, 31],
  [35, 38],
  [44, 48],
  [50, 50],
  [59, 47],
  [65, 40],
  [68, 34],
  [71, 25],
];

function ovalMaxWidthVw(heightPercent: number): number {
  const first = OVAL_WIDTH_ANCHORS[0];
  const last = OVAL_WIDTH_ANCHORS[OVAL_WIDTH_ANCHORS.length - 1];
  if (heightPercent <= first[0]) return first[1];
  if (heightPercent >= last[0]) return last[1];
  for (let i = 0; i < OVAL_WIDTH_ANCHORS.length - 1; i++) {
    const [h0, w0] = OVAL_WIDTH_ANCHORS[i];
    const [h1, w1] = OVAL_WIDTH_ANCHORS[i + 1];
    if (heightPercent >= h0 && heightPercent <= h1) {
      const t = (heightPercent - h0) / (h1 - h0);
      return w0 + t * (w1 - w0);
    }
  }
  return last[1];
}

// Top offsets, as a percentage of the image's own height, for each line.
// The oval interior runs 27%–74%; there is no venue line here, only the
// invitation section (not yet built) has room for it. Monogram sits near
// the top, name/&/name are grouped tightly, then a wider gap separates
// that group from the rule + date.
const MONOGRAM_TOP = 31;
const NAME_ONE_TOP = 43;
const AMPERSAND_TOP = 50;
const NAME_TWO_TOP = 53;
const RULE_TOP = 62;
const DATE_TOP = 65;

const REVEAL_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

function RevealItem({
  show,
  delayMs,
  topPercent,
  children,
}: {
  show: boolean;
  delayMs: number;
  topPercent: number;
  children: ReactNode;
}) {
  return (
    <div
      className={`absolute inset-x-0 flex justify-center px-6 text-center leading-none transition-[opacity,transform] duration-1200 ${
        show ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
      style={{
        top: `${topPercent}%`,
        transitionDelay: `${delayMs}ms`,
        transitionTimingFunction: REVEAL_EASING,
      }}
    >
      {children}
    </div>
  );
}

export default function Hero({ gateClosed }: HeroProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!gateClosed) return;
    const timer = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(timer);
  }, [gateClosed]);

  // Alex Brush has a small cap height relative to its em, so it needs to run
  // noticeably larger than a serif to read the same size on the page.
  const nameClassName =
    "font-name text-[clamp(2.4rem,12vw,3.4rem)] leading-none text-ink";

  return (
    <section className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-paper">
      <div className="relative w-full">
        <img
          src="/hero/hero-frame.jpg"
          alt=""
          className="w-full h-auto object-contain object-center"
        />

        <RevealItem show={revealed} delayMs={0} topPercent={MONOGRAM_TOP}>
          <div style={{ maxWidth: `${ovalMaxWidthVw(MONOGRAM_TOP)}vw` }}>
            <MonogramMark label={MONOGRAM_LABEL} />
          </div>
        </RevealItem>

        <RevealItem show={revealed} delayMs={400} topPercent={NAME_ONE_TOP}>
          <span
            className={nameClassName}
            style={{ maxWidth: `${ovalMaxWidthVw(NAME_ONE_TOP)}vw` }}
          >
            {INVITATION_CONTENT.nameOne}
          </span>
        </RevealItem>

        <RevealItem show={revealed} delayMs={800} topPercent={AMPERSAND_TOP}>
          <span className="font-name text-[clamp(1.5rem,6vw,2.1rem)] leading-none text-gold">
            &amp;
          </span>
        </RevealItem>

        <RevealItem show={revealed} delayMs={1200} topPercent={NAME_TWO_TOP}>
          <span
            className={nameClassName}
            style={{ maxWidth: `${ovalMaxWidthVw(NAME_TWO_TOP)}vw` }}
          >
            {INVITATION_CONTENT.nameTwo}
          </span>
        </RevealItem>

        <RevealItem show={revealed} delayMs={1600} topPercent={RULE_TOP}>
          <span className="h-px w-10 bg-gold" />
        </RevealItem>

        <RevealItem show={revealed} delayMs={1900} topPercent={DATE_TOP}>
          <span
            className="font-label text-xs uppercase tracking-[0.2em] text-ink"
            style={{ maxWidth: `${ovalMaxWidthVw(DATE_TOP)}vw` }}
          >
            {INVITATION_CONTENT.date}
          </span>
        </RevealItem>
      </div>
    </section>
  );
}
