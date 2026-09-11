# CLAUDE.md

Context for this repository. Read this before making changes.

## What this is

A single-page mobile wedding invitation website for a client. One page, no
routing, no CMS. The guest opens a link on their phone, watches a ribboned
floral card untie and open, and lands on the invitation.

## Non-negotiable constraints

**Mobile only.** Design and test at 390px wide. Desktop just needs to not look
broken. Do not add `md:` or `lg:` breakpoints unless something genuinely
breaks at those sizes.

**Texture comes from image assets, never from CSS.** The embossed florals, the
paper grain and the gold line work are all pre-rendered files produced outside
the codebase. Do not approximate them with gradients, box-shadows, SVG filters
or CSS `filter`. If a visual needs texture and the asset does not exist, say so
and stop rather than faking it.

**Text stays in HTML.** Never bake copy into an image. Names, dates, times and
venue will all change. Illustrated frames are art only, with empty space
reserved where text will sit.

**The client has rejected four earlier directions.** Do not invent visual
ideas. Build what is specified, and ask before adding decoration, sections,
copy or imagery that was not requested.

## Stack

Next.js (App Router), TypeScript, Tailwind. Deploys to Vercel.

## Design tokens

| token   | hex       | use                                           |
| ------- | --------- | --------------------------------------------- |
| `paper` | `#FFECE1` | page background, matches the artwork's ground |
| `oval`  | `#FAE7D9` | interior of the oval cartouche                |
| `blush` | `#E8C3C6` | soft pink accents                             |
| `sage`  | `#9AA890` | green accents                                 |
| `gold`  | `#B79762` | hairlines, buttons, small ornaments           |
| `ink`   | `#6B5545` | body and heading text                         |

## Typography

Names use a formal engraved script. Small lines (eyebrows, dates, labels) use a
quiet serif in uppercase with wide letterspacing. The contrast between those
two is what carries the formality.

**Never use** Great Vibes, Dancing Script, Sacramento, Parisienne, Allura or
Tangerine, or any bouncy handwriting face. The client rejected that register as
childish. Formal copperplate is fine, casual handwriting is not.

## The initial screen

`components/intro-gate.tsx` renders above the page and is the first thing a
guest sees.

Assets:

- `public/initial-screen/elegant-poster.jpg` — frame 1, the ribboned card closed
- `public/initial-screen/elegant.mp4` — the ribbon unties and the panels part
- `public/hero/hero-frame.jpg` — the video's final frame, the open oval

Mechanic, in order:

1. The poster sits at full opacity over the video, which sits at zero. This
   avoids a blank video box while the clip buffers.
2. The video has `muted`, `playsInline` and `preload="auto"`, and `load()` is
   called on mount so iOS buffers behind the poster.
3. On tap, the two opacities swap over 50ms and the video plays.
4. On `ended`, the overlay fades to zero over 500ms and unmounts. A
   duration-based `setTimeout` backs this up, because `ended` misfires on some
   mobile browsers.
5. The hero is mounted underneath the whole time, so the fade reveals a page
   that is already painted.

Because `hero-frame.jpg` is the video's own final frame, the handoff is
seamless as long as the hero is not scaled or positioned differently from the
video. Both use `object-cover` at full bleed with the same object-position.

Also handled: body scroll lock while the gate is up, `prefers-reduced-motion`
skips the gate, keyboard activation via Enter and Space.

**Known issue:** the assets are 1080x1920, ratio 0.5625, while a phone viewport
is nearer 0.462. `object-cover` crops about 17% off each side, clipping the
outer scrollwork. Because the video and the hero frame crop identically the
handoff still works, but verify the oval and the names sit correctly at 360px,
390px and 430px.

## Section layout pattern

Illustrated sections follow the same shape: a full-width image with text
positioned on top by percentage.

```tsx
<section className="relative w-full">
  <img src="/frames/x.png" alt="" className="w-full h-auto" />
  <div className="absolute inset-x-0 top-[16%] px-6 text-center">
    <h2 className="text-[clamp(2rem,9vw,3.5rem)] font-script">Heading</h2>
  </div>
</section>
```

Percentages plus `vw`-based `clamp()` keep text locked to the artwork across
phone widths. Never use fixed pixel offsets here.

## Performance

- Images and video are the entire page weight. Keep each video under 1.5MB.
- Encode H.264, `yuv420p`, `-movflags +faststart`.
- Compress every image. Prefer JPEG or WebP over PNG unless transparency is
  needed.
- Guests will open this on mobile data at a wedding in Bangladesh. Test
  throttled, not on localhost.

## Copy

Plain, warm, human. No marketing language. No em dashes in user-facing copy.

## Planned sections

1. Initial screen (intro gate) — built
2. Hero — monogram, names, date — built
3. Invitation
4. Countdown
5. Dress code
6. RSVP link

Build them one at a time. Do not scaffold sections that were not asked for.

## Current state

Initial screen and hero are built.

- `src/components/intro-gate.tsx` — poster/video overlay, tap and keyboard to
  open, fades out and unmounts on `ended` (with a duration-based fallback
  timer), skips entirely under `prefers-reduced-motion`.
- `src/components/hero.tsx` — hero-frame.jpg full bleed, monogram/names/rule/
  date/venue staggered into place once the gate closes.
- `src/app/page.tsx` — owns `gateClosed` and wires the two together.
- `src/lib/fonts.ts` — `FONT_OPTION` picks the name typeface (`"A"` Pinyon
  Script, `"B"` Italianno, `"C"` Playfair Display italic); currently `"A"`.
- `src/lib/invitation-content.ts` — placeholder names, date and venue. Real
  details still needed before this can go out.
- Design tokens (`paper`, `oval`, `blush`, `sage`, `gold`, `ink`) are
  registered as Tailwind colors in `src/app/globals.css`.

Renamed `public/inital-screen/` (typo, and it held all three assets) to
`public/initial-screen/` and moved `hero-frame.jpg` into a new
`public/hero/` to match this file's asset paths.

Not yet built: invitation, countdown, dress code, RSVP link.

Unverified: the hero's per-line vertical offsets and max-widths against the
oval were computed from the four measurements in this file, not from looking
at the artwork — see the note in `hero.tsx` above `MONOGRAM_TOP`. Check at
360/390/430 before trusting them.

## When you are unsure

Ask before inventing artwork, copy, names, dates or venue details. None of it
is placeholder-safe on a real wedding invitation.
