"use client";

import { useEffect, useRef, useState } from "react";
import { WHEN_WHERE_CONTENT } from "@/lib/invitation-content";
import OrdinalDate from "@/components/ordinal-date";

const REVEAL_THRESHOLD = 0.25;

function buildGoogleMapsUrl(venue: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`;
}

export default function WhenWhere() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: REVEAL_THRESHOLD },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Both pieces below share this: fully visible by default (so a reduced-
  // motion or no-JS guest just sees the finished layout), and only when
  // motion-safe do they start hidden/offset and transition in once the
  // IntersectionObserver above fires.
  const reveal = (hiddenClasses: string) =>
    `motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-out opacity-100 translate-y-0 ${
      visible ? "" : hiddenClasses
    }`;

  const mapsUrl = buildGoogleMapsUrl(WHEN_WHERE_CONTENT.venue);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] overflow-hidden bg-[#FFF5E4]"
    >
      {/* No aspect-locked wrapper: a fixed-ratio box always letterboxes on
          one axis or the other depending on how the viewport's own ratio
          compares to the artwork's — there's no single box size that
          avoids it for every phone. The image fills the section directly
          via object-cover, so it's always edge to edge on both axes. Text
          and the button below are positioned against the section now (not
          the image), so their boxes are widened ~4% per side from what the
          artwork's own measurements gave, to absorb that drift. */}
      <img
        src="/where/background.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div
        className={`absolute inset-x-[18%] top-[16%] bottom-[30%] flex flex-col items-center justify-center text-center ${reveal(
          "motion-safe:opacity-0 motion-safe:translate-y-4",
        )}`}
      >
        <h2 className="font-script text-[clamp(2rem,8vw,2.2rem)] font-normal tracking-[0.02em] text-ink">
          When &amp; Where
        </h2>

        {/* <p className="mt-7 font-script text-[10px] uppercase tracking-[0.22em] text-ink">
          {WHEN_WHERE_CONTENT.eyebrow}
        </p> */}

        <div className="mt-2 flex w-[55%] items-center gap-1">
          <span className="h-px flex-1 bg-gold" />
          <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
          <span className="h-px flex-1 bg-gold" />
        </div>

        {/* <p className="mt-7 font-script text-[clamp(1.05rem,4.6vw,1.3rem)] font-semibold text-ink">
          {WHEN_WHERE_CONTENT.eventLine}
        </p> */}

        <div className="mt-7 font-formal text-[clamp(0.95rem,4.2vw,1.15rem)] leading-[1.45] text-ink">
          <p>{WHEN_WHERE_CONTENT.venue}</p>
          <p>
            <OrdinalDate value={WHEN_WHERE_CONTENT.date} />
          </p>
          <p>{WHEN_WHERE_CONTENT.ceremonyTime}</p>
        </div>
      </div>

      {/*
        Spec put this at bottom-[22%] "over the pale sky," but in this
        asset that band sits on the domed skyline — border/text render
        correctly but wash out against the detail behind them. Moved up
        into the actual clean sky gap between the text block and the
        skyline, and given a soft translucent fill so it stays legible
        even where a rooftop or minaret tip still reaches into that band.
      */}
      <div
        className={`absolute inset-x-0 bottom-[38%] flex justify-center ${reveal(
          "motion-safe:opacity-0 motion-safe:translate-y-4",
        )}`}
      >
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full uppercase font-garamond border border-gold bg-[#FFF5E4]/80 px-8 py-2 text-[14px] text-ink"
        >
          View map
        </a>
      </div>
    </section>
  );
}
