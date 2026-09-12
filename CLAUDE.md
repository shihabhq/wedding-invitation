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
| `paper` | `#FFECE1` | page background; also hero, intro gate, and Attire's own ground |
| `oval`  | `#FAE7D9` | interior of the oval cartouche                |
| `blush` | `#E8C3C6` | soft pink accents                             |
| `sage`  | `#9AA890` | green accents                                 |
| `gold`  | `#B79762` | hairlines, buttons, small ornaments           |
| `ink`   | `#6B5545` | body and heading text                         |

Each image-led section has its own letterbox color matching its own asset's
ground, not one shared value: hero and intro gate `#FFECE1` (`paper`), When &
Where `#FFF5E4`, Invitation `#FFF0DF`, Attire `#FFECE1` (`paper`). Only
`paper` is a registered token; the other two are asset-specific and used
inline (`bg-[#FFF5E4]`, `bg-[#FFF0DF]`) rather than added to this table.

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
video. Both follow the section layout pattern below (`object-cover` filling
the section directly, no wrapper) with the same object-position, so the last
frame of the video and the hero's own artwork land in exactly the same
place.

Also handled: body scroll lock while the gate is up, `prefers-reduced-motion`
skips the gate, keyboard activation via Enter and Space.

The assets are 1080x1920 (ratio 0.5625) against a phone viewport nearer
0.462 — narrower/taller than the art, so filling the screen edge to edge
crops roughly 11% off each side at 390×844 (more on a taller phone — see
"Section layout pattern"). Verify the oval and the names still read clearly,
and nothing sits in the cropped-off 11%, at 360px, 390px and 430px.

## Section layout pattern

The sections built entirely around one piece of full-width art (intro gate,
hero, When & Where, Invitation) all read as exactly one screen: `h-[100svh]`,
not `100vh` or `h-screen` (iOS Safari's `100vh` includes the URL bar and cuts
the bottom off) and not `dvh` either (that resizes as the bar hides and makes
the image jump mid-scroll). All four now fill edge to edge on both axes:

```tsx
<section className="relative h-[100svh] overflow-hidden bg-[...]">
  <img className="absolute inset-0 h-full w-full object-cover object-center" alt="" />
  <div className="absolute inset-x-0 top-[16%] px-6 text-center">
    <h2 className="text-[clamp(2rem,9vw,3.5rem)] font-script">Heading</h2>
  </div>
</section>
```

The image is a plain absolutely-positioned layer filling the section
directly — no wrapper box of any kind. Text is positioned against the
**section**, not the image, and the section is always the full viewport, so
percentages are stable across every phone regardless of how much the image
gets cropped.

Two earlier approaches were tried here and both broke on some phone size, in
case either looks tempting to bring back:

- **A `w-full`-driven wrapper** (`<div className="relative w-full"><img
  className="w-full h-auto object-contain" /></div>`) sizes the box from the
  image's own intrinsic ratio, decoupled from the section, so it never
  crops. It letterboxes instead — fine when the artwork is reliably wider
  than the viewport (hero and When & Where's assets, ratio 0.5625, always
  are, against any realistic phone), but on an asset closer to a phone's own
  ratio (Invitation's second background, 0.4629) a *wider* viewport than the
  art (e.g. 375×667 is 0.562) means the box comes out *narrower* than the
  section, and you get cream bars on the sides instead of nothing — a fixed
  box can only avoid letterboxing on one axis, never both, depending on
  which way the mismatch runs.
- **An `h-full` + `aspect-[W/H]` wrapper** with `shrink-0` (to stop flex from
  shrinking the box back down to the section's width) does fill the height
  and crop the sides, and was the interim fix — but it has the exact same
  problem in reverse: on a viewport *wider* than the art's own ratio, the
  box comes out too narrow and still letterboxes sideways, just without
  `shrink-0` ever helping (there's nothing to shrink from). There's no fixed
  aspect ratio that avoids letterboxing on both possible mismatch directions
  at once.

Removing the wrapper and letting `object-cover` size directly against the
section is what actually guarantees no bars on either axis regardless of how
the artwork's ratio compares to the viewport's: it always crops whichever
axis needs it. The cost is that text boxes calibrated against the artwork's
own measurements need padding out (see `WIDTH_DRIFT_ALLOWANCE_VW` in
`hero.tsx`, and the widened insets in `when-where.tsx`/`invitation.tsx`) to
absorb the crop, since they're now measured against the section instead.

Percentages plus `vw`-based `clamp()` keep text locked to the artwork across
phone widths. Never use fixed pixel offsets here.

Countdown and Attire don't follow either shape: Countdown has no image, and
Attire's art is short enough (ratio 0.80) that forcing it to one screen would
mostly show empty paper — both stay natural height instead.

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

Initial screen, hero, countdown, When & Where, dress code (Attire), and
invitation are built, in that page order (`src/app/page.tsx` puts Invitation
last, after Attire — the numbered list above is the original planning order,
not the render order).

Every full-screen section is now exactly `h-[100svh]` tall (was `min-h-svh`
or unset), fixing a real bug that would otherwise have followed: once a
section's height is forced rather than auto/minimum, text absolutely
positioned by percentage against the *section* drifts from the artwork,
because the section can be taller than the image's own letterboxed size.
Every image-led section positions its text against the inner `w-full` image
wrapper instead — see "Section layout pattern" above. Countdown and Attire
are unaffected (see that section for why).

- `src/components/intro-gate.tsx` — poster/video overlay, tap and keyboard to
  open, starts the background audio in the same synchronous tap handler as
  `video.play()`, fades out and unmounts on `ended` (with a duration-based
  fallback timer), skips entirely under `prefers-reduced-motion`.
- `src/components/hero.tsx` — hero-frame.jpg fills the section edge to edge
  directly via `object-cover` (no wrapper — see "Section layout pattern"),
  `bg-paper` letterbox color never actually shows, monogram/names/rule/date
  staggered into place once the gate closes. Per-line top offsets and
  max-widths against the oval are in the constants above `MONOGRAM_TOP`,
  interpolated from measurements given in chat, not from looking at the
  artwork directly — checked visually at 360/390/430 and adjusted since.
  `WIDTH_DRIFT_ALLOWANCE_VW` pads every `ovalMaxWidthVw()` result because
  those anchors are the artwork's own measurements but the max-width is now
  set against the section, not the artwork.
- `src/components/monogram-mark.tsx` — SVG arch-and-crest monogram behind the
  initials. This is a deliberate exception to the "texture is a pre-rendered
  asset" rule above, standing in until a real embossed asset exists; it reads
  flatter than the surrounding art.
- `src/components/invitation.tsx` — background.jpg (Mughal arch, offset-right
  clear panel; now 1080/2333, ratio 0.4629, close enough to a phone's own
  ratio that filling the screen crops very little on most phones) fills the
  section edge to edge directly via `object-cover` (no wrapper — see
  "Section layout pattern"), on this section's own paper tone `bg-[#FFF0DF]`,
  not the shared `bg-paper`. The disclaimer block below the artwork uses the
  same `#FFF0DF` so there's no seam directly under the section. Text box is
  `left-[22%] right-[16%] top-[28%] bottom-[26%]` — wider than the artwork's
  own tassel-at-26%/marble-at-72% measurements on every side, since the box
  is now positioned against the section and needs to absorb whichever axis a
  given phone's ratio crops. Guest name comes from the `to` search param
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
- `src/components/when-where.tsx` — background.jpg fills the section edge to
  edge directly via `object-cover` (no wrapper — see "Section layout
  pattern"), `#FFF5E4` letterbox color never actually shows, one safe box
  (`inset-x-[18%] top-[16%] bottom-[30%]`, widened ~4% per side from the
  artwork's own `22%/20%/34%` since it's positioned against the section now)
  holding heading/eyebrow/rule/event line/venue/date/time, plus a separately
  positioned "View map" button. Fades in once via `IntersectionObserver`,
  `motion-safe:`-gated. The button's spec position (`bottom-[22%]`, "over the
  pale sky") lands on the domed skyline in this asset, so it's been moved to
  `bottom-[26%]` with a translucent pill fill — check that still holds if the
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
- `src/components/falling-petals.tsx` — `fixed inset-0 z-40`, mounted once in
  `page.tsx` (not per section), sits below the gate's `z-50` so it never
  shows through the closed envelope. 12 petals, one shared `@keyframes
  petal-fall` (globals.css) driven by per-petal CSS custom properties
  (`--petal-sway`, `--petal-rotate`, `--petal-opacity`) set inline, rather
  than 12 separate keyframe blocks. Only `transform`/`opacity` animate.
  Random values (size, color, position, timing, sway, rotation, opacity) are
  drawn once via `useMemo`. `.petal` needs `animation-fill-mode: both` —
  without it, a petal sits fully opaque and untransformed at its default
  position for the whole length of its own `animation-delay` (up to 22s)
  instead of staying invisible until its turn; verified this against a live
  render, it's easy to miss since a screenshot taken at the wrong instant
  looks fine either way. The eslint `react-hooks/purity` rule flags a raw
  `Math.random()` call written inline in the component but not one called
  through a named helper function (`randomBetween`, `randomSign`,
  `randomColor`) — not obviously correct, but that's what made the rule
  stop complaining here. Renders `null` (checked via `matchMedia` in a
  layout effect, before paint, same pattern as the intro gate's
  reduced-motion skip) under `prefers-reduced-motion: reduce`, and pauses
  every petal's animation via a `petals-paused` class when `document.hidden`
  (Page Visibility API).
- `src/components/divider.tsx` — thin gold hairline + diamond ornament,
  same motif as When & Where's own rule, between every pair of sections (not
  just one seam — this superseded the earlier one-off `section-divider.tsx`).
  Takes `from`/`to` color props that must match the exact background of the
  section immediately above and below: since each section now has its own
  paper tone, a single flat divider background would just move the seam to
  one edge of the divider instead of removing it. Renders `from` on its top
  half and `to` on its bottom half (two flat blocks, not a gradient — the
  split sits exactly where the ornament is, so it's invisible), see the
  color list in "Design tokens" above and match `page.tsx`'s usage if a
  section's background ever changes. Originally this (and the illustrated
  border starting right at an asset's top edge) was worth papering over with
  a divider rather than a CSS fade — same "texture is a pre-rendered asset,
  not CSS" reasoning as elsewhere in this file.
- `src/app/page.tsx` — owns `gateClosed`, the shared `<audio>` ref and its
  volume ramp, and wires IntroGate/Hero/Countdown/WhenWhere/Attire/
  Invitation together (a `Divider` between each pair) plus FallingPetals and
  MuteToggle, in that order.
- `scroll-behavior: smooth` on `html` in globals.css, gated behind
  `@media (prefers-reduced-motion: no-preference)`, for in-page anchors.
  Native scrolling otherwise — no Lenis/Locomotive/scroll-hijacking, on
  purpose.
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

The When & Where and Invitation backgrounds, and the Attire artwork, have
been replaced with feathered versions whose own top and bottom ~7% fade into
their section's paper tone. Do not add a CSS fade/gradient over these
images — the feather is baked into the asset now, and a CSS one on top would
double the effect and band on cheap screens.

Unverified: falling petals and smooth-scroll feel were checked in desktop
Chromium (DOM/timing correctness, reduced-motion, tab-hidden pausing, actual
z-index stacking against the gate) but not on a real iOS device — check that
petals read as noticeable-not-distracting and never sit on top of text long
enough to hurt legibility, and that scroll still feels native (momentum,
rubber-banding) with `scroll-behavior: smooth` on.

Not yet built: RSVP link.

Still placeholder: When & Where's eyebrow line. The "View map" link searches
Google Maps for the venue name only ("Hotel Intercontinental"), which is
ambiguous without a city — worth a city/country added to `venue` once
confirmed.

## When you are unsure

Ask before inventing artwork, copy, names, dates or venue details. None of it
is placeholder-safe on a real wedding invitation.
