// A small, honest break between two flat/illustrated sections, instead of
// letting one section's artwork cut in hard against the section above it.
// Reuses the same hairline+diamond motif already used inside When & Where.
export default function SectionDivider() {
  return (
    <div className="flex w-full justify-center bg-paper py-8">
      <div className="flex w-24 items-center gap-2">
        <span className="h-px flex-1 bg-gold" />
        <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
        <span className="h-px flex-1 bg-gold" />
      </div>
    </div>
  );
}
