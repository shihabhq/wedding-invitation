"use client";

import { useEffect, useRef, useState } from "react";

const REVEAL_THRESHOLD = 0.25;

export default function Attire() {
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

  return (
    <section ref={sectionRef} className="relative w-full bg-paper">
      {/* Transparent PNG, not a full-bleed frame — no object-fit needed, the
          artwork just sits on the page's own paper color. */}
      <img src="/attire/dresses.png" alt="" className="w-full h-auto" />

      {/* The figures reach 96.6% of the image height, so this pt-6 is doing
          the only real separation between the art and the text — don't
          shrink it. */}
      <div
        className={`px-10 pt-6 pb-14 text-center motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-out opacity-100 translate-y-0 ${
          visible ? "" : "motion-safe:opacity-0 motion-safe:translate-y-4"
        }`}
      >
        <h2 className="font-script text-[clamp(2rem,8vw,2.2rem)] font-normal tracking-[0.02em] text-ink">
          Dress Code
        </h2>

        <div className="mx-auto mt-3 flex w-[55%] items-center gap-2">
          <span className="h-px flex-1 bg-gold" />
          <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
          <span className="h-px flex-1 bg-gold" />
        </div>

        <div className="mt-3 font-formal text-[12px] font-semibold uppercase leading-[1.7] tracking-widest text-ink">
          <p className="text-balance mt-3">
            <span className="font-bold text-base">Women:</span> <br /> Saree or
            traditional wear
          </p>
          <p className="text-balance mt-3">
            <span className="font-bold text-base">Men:</span> <br /> Suit or
            Sherwani
          </p>
        </div>
      </div>
    </section>
  );
}
