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
  const guestName = "Meftaur Rahman";

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
        className="relative h-svh overflow-hidden bg-[#FFF0DF]"
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
          className={`absolute left-[25%] right-[20%] top-[15%] bottom-[26%] flex flex-col items-center justify-center text-center ${reveal(
            "motion-safe:opacity-0 motion-safe:translate-y-4",
          )}`}
        >
          <p className="font-script text-[clamp(1.8rem,4.6vw,1.3rem)] font-medium leading-[1.45] text-ink">
            Dear <br /> {guestName},
          </p>

          <p className="font-formal mt-2 text-[clamp(0.5rem,4.2vw,1rem)] font-normal leading-[1.45] text-ink">
            your presence at our daughter&rsquo;s big day would make it more
            special
          </p>

          {/* <p className="mt-7 font-script text-[clamp(1.4rem,4.6vw,1.3rem)] font-semibold leading-[1.45] text-ink">
            Mr &amp; Mrs <br />
            Meftaur Rahman
          </p> */}
        </div>
      </section>
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
