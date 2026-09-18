"use client";

import { useEffect, useRef, useState } from "react";
import { WEDDING_DATETIME } from "@/lib/invitation-content";

const REVEAL_THRESHOLD = 0.25;

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(target: number): TimeLeft {
  const totalSeconds = Math.max(0, Math.floor((target - Date.now()) / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const UNITS: Array<{ key: keyof TimeLeft; label: string; pad: boolean }> = [
  { key: "days", label: "Days", pad: false },
  { key: "hours", label: "Hours", pad: true },
  { key: "minutes", label: "Minutes", pad: true },
  { key: "seconds", label: "Seconds", pad: true },
];

export default function Countdown() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  // null until mount so the server-rendered markup never shows a value that
  // depends on the visitor's clock — avoids a hydration mismatch.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const target = new Date(WEDDING_DATETIME).getTime();
    // Deliberately synchronous: this fills in the real value right after
    // mount instead of leaving the placeholder up for a full second until
    // the first interval tick. The placeholder-on-server/real-on-client
    // split above is what actually avoids the hydration mismatch, not this.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(getTimeLeft(target));
    const interval = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
  }, []);

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
    <section
      ref={sectionRef}
      className={`relative w-full bg-paper px-6 py-16 text-center motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-out opacity-100 translate-y-0 ${
        visible ? "" : "motion-safe:opacity-0 motion-safe:translate-y-4"
      }`}
    >
      <p className="font-serif text-base uppercase font-bold tracking-[0.22em] text-ink">
        Counting the days
      </p>

      <div className="mt-6 flex justify-center gap-2">
        {UNITS.map(({ key, label, pad }) => {
          const value = timeLeft ? timeLeft[key] : 0;
          return (
            <div
              key={key}
              className="flex w-19 flex-col items-center rounded-lg border border-gold/25 bg-white px-2 py-4"
            >
              <span className="font-serif text-[clamp(1.5rem,7vw,2.25rem)] leading-none tabular-nums text-ink">
                {pad ? String(value).padStart(2, "0") : value}
              </span>
              <span className="mt-2 font-serif text-[9px] font-bold uppercase tracking-[0.2em] text-gold">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
