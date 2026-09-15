// Typography: three faces.
// Pinyon Script (--font-script) — the couple's names in the hero.
// Petit Formal Script (--font-formal) — the smaller accent/detail lines
// (ampersand and date in the hero, Countdown, When & Where's venue/date/
// time and its map button, Attire's dress-code lines, and the Invitation
// sign-off).
// EB Garamond (--font-garamond) — RSVP's heading and button only, brought
// back for that one section after being removed everywhere else.
//
// Rejected by the client, never use: Great Vibes, Dancing Script, Sacramento,
// Parisienne, Allura, Tangerine, or any other bouncy handwriting face.

import { EB_Garamond, Petit_Formal_Script, Pinyon_Script } from "next/font/google";

const pinyonScript = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

const petitFormalScript = Petit_Formal_Script({
  variable: "--font-formal",
  subsets: ["latin"],
  weight: "400",
});

const ebGaramond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: "400",
});

// Applied on <html> so all three custom properties are available anywhere.
export const fontVariables = `${pinyonScript.variable} ${petitFormalScript.variable} ${ebGaramond.variable}`;
