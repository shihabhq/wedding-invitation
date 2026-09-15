// Wraps a leading ordinal suffix ("2nd", "21st"...) in a small superscript,
// e.g. "2nd Jan 2027" -> 2 + <sup>nd</sup> + " Jan 2027". Falls back to
// plain text if the string doesn't start with a number.
export default function OrdinalDate({ value }: { value: string }) {
  const match = value.match(/^(\d+)(st|nd|rd|th)(.*)$/i);
  if (!match) return <>{value}</>;
  const [, number, suffix, rest] = match;
  return (
    <>
      {number}
      <sup
        style={{
          fontSize: "0.55em",
          verticalAlign: "super",
          lineHeight: 0,
        }}
      >
        {suffix}
      </sup>
      {rest}
    </>
  );
}
