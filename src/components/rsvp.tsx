"use client";

import { useEffect, useRef, useState } from "react";
import { RSVP_URL } from "@/lib/invitation-content";

const REVEAL_THRESHOLD = 0.25;

export default function Rsvp() {
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

  const reveal = (hiddenClasses: string) =>
    `motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-out opacity-100 translate-y-0 ${
      visible ? "" : hiddenClasses
    }`;

  return (
    <section ref={sectionRef} className="relative w-full mb-40 bg-paper">
      {/* Transparent PNG, not a full-bleed frame — no object-fit, just the
          artwork sitting on the page's own paper color. */}
      <img src="/rsvp/background.png" alt="" className="w-full h-auto" />

      {/* The clear interior runs 16%–80% of the image height, ~56%–67% of
          the width across that band. inset-x-[24%]/top-[20%]/bottom-[24%]
          sits inside that with margin on every side. Heading + button only
          — nothing else, the frame is already the decoration. */}
      <div
        className={`absolute inset-x-[24%] top-[20%] bottom-[24%] flex flex-col items-center justify-center text-center ${reveal(
          "motion-safe:opacity-0 motion-safe:translate-y-4",
        )}`}
      >
        <h2 className="font-script text-[clamp(2.6rem,8vw,2.2rem)] font-semibold  tracking-[0.08em] text-ink">
          RSVP
        </h2>

        <a
          href={RSVP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex min-h-[44px] font-garamond items-center rounded-full border border-gold bg-transparent px-7 py-3 font-normal text-base uppercase tracking-[0.16em] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          Reserve
        </a>
      </div>
    </section>
  );
}
