// Typography for the invitation.
//
// Names: Alex Brush. Small lines (monogram, date): Marcellus.
//
// Rejected by the client, never use: Great Vibes, Dancing Script, Sacramento,
// Parisienne, Allura, Tangerine, or any other bouncy handwriting face.

import { Alex_Brush, Marcellus } from "next/font/google";

const alexBrush = Alex_Brush({
  variable: "--font-name",
  subsets: ["latin"],
  weight: "400",
});

const marcellus = Marcellus({
  variable: "--font-label",
  subsets: ["latin"],
  weight: "400",
});

// Applied on <html> alongside the label font's variable so both CSS custom
// properties (--font-name, --font-label) are available anywhere in the tree.
export const fontVariables = `${alexBrush.variable} ${marcellus.variable}`;
