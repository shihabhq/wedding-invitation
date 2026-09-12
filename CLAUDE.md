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
3. Invitation — personalised "Dear {guest}" card, signed by the hosts — built
4. Countdown — built
5. When & Where — venue, date, ceremony time, map link — built
6. Dress code — built
7. RSVP link

Build them one at a time. Do not scaffold sections that were not asked for.

## Current state

Initial screen, hero, invitation, countdown, When & Where, and dress code
(Attire) are built (in that page order).

- `src/components/intro-gate.tsx` — poster/video overlay, tap and keyboard to
  open, starts the background audio in the same synchronous tap handler as
  `video.play()`, fades out and unmounts on `ended` (with a duration-based
  fallback timer), skips entirely under `prefers-reduced-motion`.
- `src/components/hero.tsx` — hero-frame.jpg rendered `object-contain` on
  `bg-paper` (not cropped), monogram/names/rule/date staggered into place
  once the gate closes. Per-line top offsets and max-widths against the oval
  are in the constants above `MONOGRAM_TOP`, interpolated from measurements
  given in chat, not from looking at the artwork directly — checked visually
  at 360/390/430 and adjusted since.
- `src/components/monogram-mark.tsx` — SVG arch-and-crest monogram behind the
  initials. This is a deliberate exception to the "texture is a pre-rendered
  asset" rule above, standing in until a real embossed asset exists; it reads
  flatter than the surrounding art.
- `src/components/invitation.tsx` — background.jpg (Mughal arch, offset-right
  clear panel) is plain `w-full h-auto` on `bg-paper`, no object-fit — a page
  section, not a full-height frame. Text box uses the given asymmetric
  `left-[27%] right-[19%] top-[30%] bottom-[34%]` band (tassel above, marble
  floor below). Guest name comes from the `to` search param
  (`useSearchParams`, wrapped in its own internal `<Suspense>` so the page
  stays statically prerendered), HTML-stripped and falling back to "Guest".
  The "you are receiving this…" disclaimer sits below the artwork in normal
  flow since it doesn't fit inside the panel. Same
  `IntersectionObserver` + `motion-safe:` fade as the other sections, applied
  to both text blocks.
- `src/components/countdown.tsx` — no illustrated asset, just the page's own
  tokens: `bg-paper`, ink numbers, gold unit labels, each unit in a plain
  white rounded box (flat color only, no shadow). Ticks live via
  `setInterval`, counting down to `WEDDING_DATETIME`. Renders `null`-backed
  placeholders (`00`) until mount so server and client markup match, then
  fills in the real value — a guest's clock, not the server's, is what
  should drive this. Fades in once via the same `IntersectionObserver` +
  `motion-safe:` pattern as When & Where.
- `src/components/when-where.tsx` — background.jpg rendered `object-contain`
  on `#FFF5E4`, one safe box (`inset-x-[22%] top-[20%] bottom-[34%]`) holding
  heading/eyebrow/rule/event line/venue/date/time, plus a separately
  positioned "View map" button. Fades in once via `IntersectionObserver`,
  `motion-safe:`-gated. The button's spec position (`bottom-[22%]`, "over the
  pale sky") lands on the domed skyline in this asset, so it's been moved to
  `bottom-[30%]` with a translucent pill fill — check that still holds if the
  background asset changes.
- `src/components/attire.tsx` — dresses.png is a transparent PNG, not a
  full-bleed frame, so it's plain `w-full h-auto` on `bg-paper`, no
  object-fit. Text sits below it in normal flow (not overlaid), final copy
  (not placeholders) written straight into the component since it's generic
  instructions rather than per-wedding facts. The "women" line's given type
  size wrapped with an orphaned "wear" on its own line at all three widths;
  fixed with `text-balance` rather than changing the given font size,
  padding, or tracking. Same `IntersectionObserver` + `motion-safe:` fade as
  When & Where, applied to the text block only (the art itself doesn't fade).
- `src/components/mute-toggle.tsx` — fixed top-right, appears once
  `gateClosed`, toggles the shared `<audio>` element.
- `src/components/section-divider.tsx` — thin gold hairline + diamond
  between Countdown and When & Where, same motif as When & Where's own
  rule. Countdown is flat `bg-paper`; When & Where's artwork starts with an
  illustrated border right at its top edge, so without this the cut from
  plain color straight into dense illustration read as a layout bug rather
  than a section change. A CSS fade over the artwork was considered and
  rejected — same "texture is a pre-rendered asset, not CSS" reasoning as
  elsewhere in this file; a real fade would need the asset's top edge
  redrawn to blend into a flat tone before the border starts.
- `src/app/page.tsx` — owns `gateClosed`, the shared `<audio>` ref and its
  volume ramp, and wires IntroGate/Hero/Invitation/Countdown/SectionDivider/
  WhenWhere/Attire/MuteToggle together, in that order.
- `src/lib/fonts.ts` — Alex Brush for names, Marcellus for small lines, both
  via `next/font/google`. No switching constant; Alex Brush was chosen after
  trying the font-option approach this file used to describe.
- `src/lib/invitation-content.ts` — `INVITATION_CONTENT` (names, date, venue)
  and `WHEN_WHERE_CONTENT` (eyebrow, event line, venue/date reused from
  `INVITATION_CONTENT`, ceremony time). `MONOGRAM_LABEL` is derived from the
  two names, not stored separately. `WEDDING_DATETIME` is the same date as an
  actual instant (with a Bangladesh +06:00 offset) for the countdown to
  target — keep it in sync with `date` by hand if the date ever changes, and
  narrow its midnight guess once a real ceremony start time exists. Only the
  eyebrow line is still a marked placeholder; everything else has real
  values.
- Design tokens (`paper`, `oval`, `blush`, `sage`, `gold`, `ink`) are
  registered as Tailwind colors in `src/app/globals.css`. When & Where's own
  paper tone (`#FFF5E4`) is asset-specific and used inline, not added to this
  table.
- `public/audio/wedding-audio.mp3` — background track, looped, ramped to 0.35
  on the gate tap.
- `public/where/background.jpg` — When & Where's Persian-arch artwork.
- `public/attire/dresses.png` — Attire's transparent embroidered-guests
  artwork.
- `public/invite/background.jpg` — Invitation's Mughal-arch artwork.

Renamed `public/inital-screen/` (typo, and it held all three assets) to
`public/initial-screen/` and moved `hero-frame.jpg` into a new
`public/hero/` to match this file's asset paths. This project no longer has
a `.git` — removed at the client's request.

Not yet built: RSVP link.

Still placeholder: When & Where's eyebrow line. The "View map" link searches
Google Maps for the venue name only ("Hotel Intercontinental"), which is
ambiguous without a city — worth a city/country added to `venue` once
confirmed.

## When you are unsure

Ask before inventing artwork, copy, names, dates or venue details. None of it
is placeholder-safe on a real wedding invitation.
