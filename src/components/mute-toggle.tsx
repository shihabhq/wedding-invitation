"use client";

import { type RefObject, useState } from "react";

type MuteToggleProps = {
  audioRef: RefObject<HTMLAudioElement | null>;
  visible: boolean;
};

export default function MuteToggle({ audioRef, visible }: MuteToggleProps) {
  const [muted, setMuted] = useState(false);

  if (!visible) return null;

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    if (audioRef.current) audioRef.current.muted = next;
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={muted ? "Unmute background music" : "Mute background music"}
      className="fixed right-4 top-4 z-40 flex h-8 w-8 items-center justify-center text-ink/40 transition-opacity hover:text-ink/70"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 9v6h4l5 5V4L8 9H4Z" />
        {muted ? (
          <>
            <path d="M16 9l5 6" />
            <path d="M21 9l-5 6" />
          </>
        ) : (
          <>
            <path d="M17.5 8.5a5 5 0 0 1 0 7" />
            <path d="M20 6a8.5 8.5 0 0 1 0 12" />
          </>
        )}
      </svg>
    </button>
  );
}
