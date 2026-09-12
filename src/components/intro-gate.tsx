"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type IntroGateProps = {
  onClosed: () => void;
  /**
   * Called synchronously from the tap/keyboard handler, in the same call
   * stack as video.play() — this is the one guaranteed user gesture, so
   * anything needing autoplay permission (the background audio) has to
   * start here or not at all.
   */
  onTap: () => void;
};

// Fallback if the video's own duration can't be read for some reason.
// elegant.mp4 runs about 9 seconds; padded to cover encode/playback jitter.
const FALLBACK_DURATION_MS = 9500;
// Extra time past the video's own duration before the fallback timer fires,
// so `ended` gets first chance and this only backs it up.
const FALLBACK_BUFFER_MS = 400;
const CLOSE_FADE_MS = 500;

export default function IntroGate({ onClosed, onTap }: IntroGateProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const closedRef = useRef(false);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [started, setStarted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [done, setDone] = useState(false);

  const closeGate = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    setClosing(true);
    onClosed();
    setTimeout(() => setDone(true), CLOSE_FADE_MS);
  }, [onClosed]);

  // Guests with reduced-motion enabled skip the gate entirely. This runs
  // before paint so the poster never has a chance to flash on screen.
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      closedRef.current = true;
      onClosed();
      // Deliberately synchronous: a layout effect runs before the browser
      // paints, so this removes the gate before the poster is ever shown
      // instead of after a visible flash.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDone(true);
    }
    // Intentionally run once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // iOS needs an explicit load() while hidden behind the poster so the clip
  // is ready to play instantly on tap.
  useEffect(() => {
    if (done) return;
    videoRef.current?.load();
  }, [done]);

  useEffect(() => {
    if (done) {
      document.body.style.overflow = "";
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [done]);

  const handleOpen = useCallback(() => {
    if (started) return;
    setStarted(true);

    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay-with-sound rejections don't apply here (muted), but if
        // play() is ever refused, fall back to the duration timer alone so
        // the gate still closes.
      });
    }
    // Same synchronous call stack as video.play() above — this is the only
    // guaranteed user gesture, so the background audio has to start here.
    onTap();

    const durationMs =
      video && Number.isFinite(video.duration) && video.duration > 0
        ? video.duration * 1000
        : FALLBACK_DURATION_MS;
    fallbackTimerRef.current = setTimeout(
      closeGate,
      durationMs + FALLBACK_BUFFER_MS,
    );
  }, [started, closeGate, onTap]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleOpen();
      }
    },
    [handleOpen],
  );

  if (done) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Tap to open the invitation"
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      className={`fixed inset-0 z-50 overflow-hidden bg-paper transition-opacity duration-500 ease-out ${
        closing ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* No aspect-locked wrapper: a fixed-ratio box always letterboxes on
          one axis or the other depending on how the viewport's own ratio
          compares to the artwork's (1080/1920 vs a viewport that can be
          either narrower or wider than that) — there's no single box size
          that avoids it for every phone. Poster and video fill this
          fixed-positioned overlay directly via object-cover, so it's always
          edge to edge on both axes, cropping whichever axis needs it. */}
      <img
        src="/initial-screen/elegant-poster.jpg"
        alt=""
        className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-50 ${
          started ? "opacity-0" : "opacity-100"
        }`}
      />
      <video
        ref={videoRef}
        src="/initial-screen/elegant.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={closeGate}
        className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-50 ${
          started ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 transition-opacity duration-150 ${
          started ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="absolute left-1/2 top-[50%] h-14 w-14 -translate-x-1/2 -translate-y-1/2 animate-gate-ring-pulse rounded-full border border-gold" />
        <span className="absolute inset-x-0 bottom-[9%] text-center font-label text-xs uppercase tracking-[0.2em] text-paper">
          Tap to open
        </span>
      </div> */}
    </div>
  );
}
