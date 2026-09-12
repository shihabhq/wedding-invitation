"use client";

import { useCallback, useRef, useState } from "react";
import Attire from "@/components/attire";
import Countdown from "@/components/countdown";
import Hero from "@/components/hero";
import IntroGate from "@/components/intro-gate";
import Invitation from "@/components/invitation";
import MuteToggle from "@/components/mute-toggle";
import SectionDivider from "@/components/section-divider";
import WhenWhere from "@/components/when-where";

const AUDIO_VOLUME = 0.35;
const AUDIO_RAMP_MS = 1500;
const AUDIO_RAMP_STEPS = 30;

export default function Home() {
  const [gateClosed, setGateClosed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGateClosed = useCallback(() => setGateClosed(true), []);

  // Called synchronously from IntroGate's tap handler — the only guaranteed
  // user gesture, so this is the one chance to get the audio past autoplay
  // blocking. A rejected play() is swallowed so a blocked browser never
  // breaks the opening; the mute toggle still works once the gate closes.
  const startAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0;
    audio.play().catch(() => {});

    const stepMs = AUDIO_RAMP_MS / AUDIO_RAMP_STEPS;
    let step = 0;
    const ramp = setInterval(() => {
      step += 1;
      audio.volume = Math.min(
        AUDIO_VOLUME,
        (AUDIO_VOLUME * step) / AUDIO_RAMP_STEPS,
      );
      if (step >= AUDIO_RAMP_STEPS) clearInterval(ramp);
    }, stepMs);
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/wedding-audio.mp3"
        loop
        preload="auto"
      />
      <IntroGate onClosed={handleGateClosed} onTap={startAudio} />
      <Hero gateClosed={gateClosed} />
      <Countdown />
      <SectionDivider />
      <WhenWhere />
      <Attire />
      <Invitation />
      <MuteToggle audioRef={audioRef} visible={gateClosed} />
    </>
  );
}
