"use client";

import { type ReactNode, useEffect, useState } from "react";
import { INVITATION_CONTENT, MONOGRAM_LABEL } from "@/lib/invitation-content";
import MonogramMark from "@/components/monogram-mark";

type HeroProps = {
  gateClosed: boolean;
};

// The oval cartouche's usable width, measured directly from hero-frame.jpg,
// as a percentage of the IMAGE's own height and width. The image fills the
// section via object-cover (no aspect-locked wrapper — see the section
// below), so these are no longer exactly the artwork's own percentages;
// WIDTH_DRIFT_ALLOWANCE_VW pads the result to compensate. Interpolated
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

// The anchors above were measured as a fraction of the artwork's own width.
// Text is now positioned (and sized) against the section directly rather
// than an aspect-locked wrapper matching the artwork exactly, and the
// section can be wider than the artwork's own rendered content once
// object-cover crops it — so +8 (4vw of headroom on each side) absorbs
// that drift instead of the text wrapping tighter than it used to.
const WIDTH_DRIFT_ALLOWANCE_VW = 8;

function ovalMaxWidthVw(heightPercent: number): number {
  const first = OVAL_WIDTH_ANCHORS[0];
  const last = OVAL_WIDTH_ANCHORS[OVAL_WIDTH_ANCHORS.length - 1];
  if (heightPercent <= first[0]) return first[1] + WIDTH_DRIFT_ALLOWANCE_VW;
  if (heightPercent >= last[0]) return last[1] + WIDTH_DRIFT_ALLOWANCE_VW;
  for (let i = 0; i < OVAL_WIDTH_ANCHORS.length - 1; i++) {
    const [h0, w0] = OVAL_WIDTH_ANCHORS[i];
    const [h1, w1] = OVAL_WIDTH_ANCHORS[i + 1];
    if (heightPercent >= h0 && heightPercent <= h1) {
      const t = (heightPercent - h0) / (h1 - h0);
      return w0 + t * (w1 - w0) + WIDTH_DRIFT_ALLOWANCE_VW;
    }
  }
  return last[1] + WIDTH_DRIFT_ALLOWANCE_VW;
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
    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, [gateClosed]);

  // Alex Brush has a small cap height relative to its em, so it needs to run
  // noticeably larger than a serif to read the same size on the page.
  const nameClassName =
    "font-name text-[clamp(2.4rem,12vw,3.4rem)] leading-none text-ink";

  return (
    <section className="relative h-svh overflow-hidden bg-paper">
      {/* No aspect-locked wrapper: a fixed-ratio box always letterboxes on
          one axis or the other depending on how the viewport's own ratio
          compares to the artwork's — there's no single box size that
          avoids it for every phone. The image fills the section directly
          via object-cover, so it's always edge to edge on both axes. Text
          is positioned against the section now (not the image), which is
          why ovalMaxWidthVw pads its answer — see WIDTH_DRIFT_ALLOWANCE_VW
          above. */}
      <img
        src="/hero/hero-frame.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <RevealItem show={revealed} delayMs={0} topPercent={MONOGRAM_TOP}>
        <div style={{ maxWidth: `${ovalMaxWidthVw(MONOGRAM_TOP)}vw` }}>
          <MonogramMark label={MONOGRAM_LABEL} />
        </div>
      </RevealItem>

      <RevealItem show={revealed} delayMs={100} topPercent={NAME_ONE_TOP}>
        <span
          className={nameClassName}
          style={{ maxWidth: `${ovalMaxWidthVw(NAME_ONE_TOP)}vw` }}
        >
          {INVITATION_CONTENT.nameOne}
        </span>
      </RevealItem>

      <RevealItem show={revealed} delayMs={300} topPercent={AMPERSAND_TOP}>
        <span className="font-name text-[clamp(1.5rem,6vw,2.1rem)] leading-none text-gold">
          &amp;
        </span>
      </RevealItem>

      <RevealItem show={revealed} delayMs={400} topPercent={NAME_TWO_TOP}>
        <span
          className={nameClassName}
          style={{ maxWidth: `${ovalMaxWidthVw(NAME_TWO_TOP)}vw` }}
        >
          {INVITATION_CONTENT.nameTwo}
        </span>
      </RevealItem>

      <RevealItem show={revealed} delayMs={600} topPercent={RULE_TOP}>
        <span className="h-px w-10 bg-gold" />
      </RevealItem>

      <RevealItem show={revealed} delayMs={800} topPercent={DATE_TOP}>
        <span
          className="font-label text-xs uppercase tracking-[0.2em] text-ink"
          style={{ maxWidth: `${ovalMaxWidthVw(DATE_TOP)}vw` }}
        >
          {INVITATION_CONTENT.date}
        </span>
      </RevealItem>
    </section>
  );
}
