"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const REVEAL_THRESHOLD = 0.25;

// searchParams.get() already percent-decodes; this only strips tags so a
// guest-supplied name can't inject markup into the page.
function sanitizeGuestName(raw: string | null): string {
  if (!raw) return "Guest";
  const stripped = raw.replace(/<[^>]*>/g, "").trim();
  return stripped || "Guest";
}

function InvitationSkeleton() {
  return (
    <section className="relative h-[100svh] overflow-hidden bg-[#FFF0DF]">
      <img
        src="/invite/background.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
    </section>
  );
}

function InvitationContent() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const searchParams = useSearchParams();
  const guestName = sanitizeGuestName(searchParams.get("to"));

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

  // Fully visible by default (reduced-motion/no-JS guests just see the
  // finished layout); motion-safe: classes add the hidden/offset start and
  // the transition, only removed once the observer above fires.
  const reveal = (hiddenClasses: string) =>
    `motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-out opacity-100 translate-y-0 ${
      visible ? "" : hiddenClasses
    }`;

  return (
    <>
      <section
        ref={sectionRef}
        className="relative h-[100svh] overflow-hidden bg-[#FFF0DF]"
      >
        {/* No aspect-locked wrapper: a fixed-ratio box always letterboxes on
            one axis or the other depending on how the viewport's own ratio
            compares to the artwork's (this asset is 1080/2333, ratio
            0.4629 — close to a phone's own ratio, but a 375x667 screen is
            0.562, wider than that, so a fixed box there would show cream
            bars on the sides). The image fills the section directly via
            object-cover instead, so it's always edge to edge on both axes,
            cropping whichever axis a given phone needs. */}
        <img
          src="/invite/background.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/*
          The clear panel is offset right, not centred — hence the
          asymmetric left/right insets. A tassel hangs in above ~26% and the
          marble floor starts around 72% — text is positioned against the
          section now (not the image), so this box is widened from the
          artwork's own measurements to absorb whichever axis gets cropped.
        */}
        <div
          className={`absolute left-[22%] right-[16%] top-[15%] bottom-[26%] flex flex-col items-center justify-center text-center ${reveal(
            "motion-safe:opacity-0 motion-safe:translate-y-4",
          )}`}
        >
          <p className="font-name text-[clamp(1.3rem,6.5vw,1.9rem)] leading-[1.1] text-ink">
            Dear {guestName}
          </p>

          <p className="mt-2 font-label text-[clamp(0.9rem,3.5vw,1.15rem)] leading-[1.6] text-ink">
            You and your family are cordially invited
          </p>

          <div className="h-3" />

          <p className="font-label italic text-[clamp(0.8rem,3.4vw,1rem)] text-ink">
            Regards
          </p>

          <p className="mt-1 font-label text-[clamp(0.85rem,3.8vw,1.1rem)] leading-[1.5] text-ink">
            Md. Meftaur Rahman and Mrs. Meftaur Rahman
          </p>
        </div>
      </section>

      {/* This disclaimer line doesn't fit inside the panel, which is why it
          sits below the artwork as its own block instead of inside the
          fixed-height section above. */}
      <div
        className={`bg-[#FFF0DF] px-10 pt-5 pb-14 text-center ${reveal(
          "motion-safe:opacity-0 motion-safe:translate-y-4",
        )}`}
      >
        <span className="mx-auto block h-px w-[40%] bg-gold" />
        <p className="mt-4 font-label text-[11px] leading-[1.6] text-ink/70">
          You are receiving this because you are on the guest list for the
          Marriage Reception.
        </p>
      </div>
    </>
  );
}

export default function Invitation() {
  return (
    <Suspense fallback={<InvitationSkeleton />}>
      <InvitationContent />
    </Suspense>
  );
}
