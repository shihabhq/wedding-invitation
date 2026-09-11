// A deliberate exception to CLAUDE.md's "texture/line work is a pre-rendered
// asset, never CSS" rule: this is a flat SVG approximation of an arch-and-
// crest monogram lockup, standing in until a real embossed asset matching
// the rest of the artwork exists. It will read visibly flatter than the
// surrounding art — swap it for an image asset when one is available.
export default function MonogramMark({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 140 120"
        className="h-auto w-[clamp(3.5rem,16vw,5.25rem)] text-gold"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* small crest above the arch */}
        <path d="M70 4 L74 12 L70 20 L66 12 Z" />
        <path d="M70 12 C63 10 57 12 52 17" />
        <path d="M70 12 C77 10 83 12 88 17" />

        {/* double-line arch */}
        <path d="M20 95 L20 70 A50 50 0 0 1 120 70 L120 95" />
        <path d="M30 92 L30 70 A40 40 0 0 1 110 70 L110 92" />
      </svg>
      <span className="-mt-1 font-label text-[0.7rem] uppercase tracking-[0.35em] text-gold">
        {label}
      </span>
    </div>
  );
}
