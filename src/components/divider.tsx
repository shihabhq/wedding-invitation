// Purely decorative — marks a section boundary honestly rather than trying
// to hide it, so it's aria-hidden. Sits between every pair of sections.
//
// `from`/`to` must match the exact background color of the section directly
// above and below this divider. Each section now has its own paper tone
// (they're no longer all the same #FFECE1), so a single flat background on
// the divider would just relocate the seam to one edge of the divider
// instead of removing it — this instead sits `from`'s color on the top half
// and `to`'s on the bottom half, split at the same point the ornament sits,
// so there's no visible line at either edge.
type DividerProps = {
  from: string;
  to: string;
};

export default function Divider({ from, to }: DividerProps) {
  return (
    <div aria-hidden className="relative flex w-full justify-center">
      <div className="absolute inset-0 flex flex-col">
        <div className="flex-1" style={{ backgroundColor: from }} />
        <div className="flex-1" style={{ backgroundColor: to }} />
      </div>
      <div className="relative flex w-[60px] items-center gap-2 py-8">
        <span className="h-px flex-1 bg-gold/50" />
        <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
        <span className="h-px flex-1 bg-gold/50" />
      </div>
    </div>
  );
}
