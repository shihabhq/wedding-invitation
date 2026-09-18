// Typography: two faces.
// Aston Script (--font-script) — the couple's names in the hero, and
// nowhere else. Self-hosted local file (public/fonts/Aston Script.ttf),
// not a Google Font.
// Cormorant (--font-serif) — everything else that isn't the names: hero's
// ampersand and date, Countdown, When & Where's venue/date/time and its map
// button, Attire's dress-code lines, Invitation's sign-off, and RSVP's
// heading and button. Loaded with both normal and italic styles so either
// is available via Tailwind's `italic` utility, though nothing currently
// uses italic.
//
// Rejected by the client, never use: Great Vibes, Dancing Script, Sacramento,
// Parisienne, Allura, Tangerine, or any other bouncy handwriting face.

import { Cormorant } from "next/font/google";
import localFont from "next/font/local";

const astonScript = localFont({
  src: "../../public/fonts/Aston Script.ttf",
  variable: "--font-script",
  weight: "400",
  display: "swap",
});

const cormorant = Cormorant({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Applied on <html> so both custom properties are available anywhere.
export const fontVariables = `${astonScript.variable} ${cormorant.variable}`;
