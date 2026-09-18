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
    <section
      ref={sectionRef}
      className="relative h-[100svh] overflow-hidden bg-[#F7E6D6]"
    >
      {/* Full-bleed cream linen, same pattern as the hero — no aspect-locked
          wrapper, object-cover fills the section directly on both axes
          regardless of how the viewport's ratio compares to the artwork's.
          A 13% fade is baked into this asset's own top/bottom edges, so no
          CSS edge gradient here — layering one on top would double the
          effect and band on cheap screens. */}
      <img
        src="/rsvp/background.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* The cartouche interior sits inside inset-x-[24%]/top-[36%]/
          bottom-[36%] with margin at every phone size. */}
      <div
        className={`absolute inset-x-[24%] top-[36%] bottom-[36%] flex flex-col items-center justify-center text-center ${reveal(
          "motion-safe:opacity-0 motion-safe:translate-y-4",
        )}`}
      >
        <p className="font-serif text-[clamp(1.2rem,4.4vw,1.2rem)] leading-[1.6] text-ink">
          We invite you to celebrate with us, and we hope you can make it!
        </p>

        <p className="mt-5 font-serif text-[clamp(1rem,4.4vw,1.2rem)] leading-[1.6] text-ink">
          Please RSVP below.
        </p>

        <a
          href={RSVP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-full border border-gold bg-transparent px-7 py-3 font-serif text-base uppercase tracking-[0.16em] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        >
          RSVP
        </a>
      </div>
    </section>
  );
}
