"use client";

import { useEffect, useRef, useState } from "react";
import { WHEN_WHERE_CONTENT } from "@/lib/invitation-content";

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
    <section ref={sectionRef} className="relative w-full bg-[#FFF5E4]">
      <img
        src="/where/background.jpg"
        alt=""
        className="w-full h-auto object-contain object-center"
      />

      <div
        className={`absolute inset-x-[22%] top-[20%] bottom-[34%] flex flex-col items-center justify-center text-center ${reveal(
          "motion-safe:opacity-0 motion-safe:translate-y-4",
        )}`}
      >
        <h2 className="font-name text-[clamp(2rem,10vw,3rem)] leading-tight text-ink">
          When &amp; Where
        </h2>

        <p className="mt-2 font-label text-[10px] uppercase tracking-[0.22em] text-ink">
          {WHEN_WHERE_CONTENT.eyebrow}
        </p>

        <div className="my-3 flex w-[55%] items-center gap-2">
          <span className="h-px flex-1 bg-gold" />
          <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
          <span className="h-px flex-1 bg-gold" />
        </div>

        <p className="font-label italic text-[clamp(1.05rem,5vw,1.5rem)] text-ink">
          {WHEN_WHERE_CONTENT.eventLine}
        </p>

        <div className="mt-3 font-label text-[clamp(0.95rem,4.2vw,1.25rem)] leading-[1.5] text-ink">
          <p>{WHEN_WHERE_CONTENT.venue}</p>
          <p>{WHEN_WHERE_CONTENT.date}</p>
          <p>{WHEN_WHERE_CONTENT.ceremonyTime}</p>
        </div>
      </div>

      {/*
        Spec put this at bottom-[22%] "over the pale sky," but in this asset
        that band sits on the domed skyline — border/text render correctly
        but wash out against the detail behind them. Moved up into the
        actual clean sky gap between the text block and the skyline, and
        given a soft translucent fill so it stays legible even where a
        rooftop or minaret tip still reaches into that band.
      */}
      <div
        className={`absolute inset-x-0 bottom-[26%] flex justify-center ${reveal(
          "motion-safe:opacity-0 motion-safe:translate-y-4",
        )}`}
      >
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-gold bg-[#FFF5E4]/80 px-8 py-2 font-label text-[14px] text-ink"
        >
          View map
        </a>
      </div>
    </section>
  );
}
