// PLACEHOLDER CONTENT — none of this is real. Replace every value before
// this goes anywhere near a guest; none of it is placeholder-safe on an
// actual wedding invitation.
export const INVITATION_CONTENT = {
  nameOne: "Nazifa", // TODO: first partner's name
  nameTwo: "Arshia", // TODO: second partner's name
  date: "2nd Jan 2027", // TODO: e.g. "12 · 12 · 2026"
  venue: "Dorset House, 100 Queen Street, Bristol, BS1 4NT", // TODO: venue name and city
};

// Derived from the two names above so there's one source of truth — no
// separate initials to keep in sync by hand.
export const MONOGRAM_LABEL = `${INVITATION_CONTENT.nameOne.charAt(0).toUpperCase()} & ${INVITATION_CONTENT.nameTwo.charAt(0).toUpperCase()}`;
