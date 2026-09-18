// A deliberate exception to CLAUDE.md's "texture is a pre-rendered asset,
// never CSS" rule — but this isn't approximating the artwork's texture. The
// backgrounds have a ~5.5% feather baked into their top/bottom edges that
// blends into the section's paper tone; object-cover can crop more than
// that off a short screen (~9% at 375x667), exposing a hard edge. These two
// flat-color-to-transparent gradients reinforce the same fade using the
// section's own flat background color — never a texture, gold line or
// grain — so on tall screens where the baked feather survives the crop,
// this just doubles the same color onto itself (harmless). Belt-and-braces,
// not a replacement for the baked-in feather.
export default function EdgeFeather({ color }: { color: string }) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[9%]"
        style={{ background: `linear-gradient(${color}, transparent)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[9%]"
        style={{ background: `linear-gradient(transparent, ${color})` }}
      />
    </>
  );
}
