// PLACEHOLDER CONTENT — none of this is real. Replace every value before
// this goes anywhere near a guest; none of it is placeholder-safe on an
// actual wedding invitation.
export const INVITATION_CONTENT = {
  nameOne: "Nazifa", // TODO: first partner's name
  nameTwo: "Arshia", // TODO: second partner's name
  date: "2nd Jan 2027",
  venue: "Hotel Intercontinental",
};

// Same date as INVITATION_CONTENT.date, as an actual instant for the
// countdown to count down to — keep these two in sync by hand if the date
// changes. Midnight is a guess (no ceremony start time is set anywhere on
// the site yet, only the reception's "8pm onwards"); narrow this once a
// real time exists. Written with an explicit +06:00 (Bangladesh Standard
// Time) offset so every guest counts down to the same real moment
// regardless of their own device's timezone.
export const WEDDING_DATETIME = "2027-01-02T00:00:00+06:00";

// Derived from the two names above so there's one source of truth — no
// separate initials to keep in sync by hand.
export const MONOGRAM_LABEL = `${INVITATION_CONTENT.nameOne.charAt(0).toUpperCase()} & ${INVITATION_CONTENT.nameTwo.charAt(0).toUpperCase()}`;

// Content for the When & Where section. venue/date are the same facts as
// above (one source of truth); eyebrow still needs real wording.
export const WHEN_WHERE_CONTENT = {
  venue: INVITATION_CONTENT.venue,
  date: INVITATION_CONTENT.date,
  ceremonyTime: "8pm onwards reception",
};

// PLACEHOLDER — not a real RSVP link yet. Replace with the actual form/
// contact URL before this goes anywhere near a guest.
export const RSVP_URL = "https://app.invitavo.net/i/rrzKiJbLdWjZ2nT7ZaUC1g";
