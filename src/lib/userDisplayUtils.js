/**
 * Firebase phone sign-in uses a synthetic "email" like phone_xxx@cite.phone.
 * These helpers normalize display so we show real email/phone or "Signed in with phone".
 */

const PHONE_EMAIL_SUFFIX = "@cite.phone";

export function isPhoneAuthEmail(value) {
  if (!value || typeof value !== "string") return false;
  return value.includes(PHONE_EMAIL_SUFFIX) || (value.startsWith("phone_") && value.includes("@"));
}

/**
 * If phoneNumber was stored with the synthetic email (e.g. "phone_xxx@cite.phone19876543210"),
 * extract the real number (the part after @cite.phone). Otherwise return phoneNumber if it looks like a phone.
 */
export function getDisplayPhone(user) {
  const raw = user?.phoneNumber || user?.phone;
  if (!raw || typeof raw !== "string") return "—";

  if (raw.includes(PHONE_EMAIL_SUFFIX)) {
    const after = raw.split(PHONE_EMAIL_SUFFIX)[1]?.trim();
    if (after && /^[\d+\s\-()]+$/.test(after)) return after;
    return "—";
  }
  if (raw.includes("@")) return "—";
  return raw;
}

/**
 * For email field: show real email, or "Signed in with phone" when Firebase stored a synthetic email.
 * Optionally show the actual phone number when we have it (so user sees their contact).
 */
export function getDisplayEmail(user) {
  const email = user?.email || user?.username;
  if (!email) return "—";
  if (isPhoneAuthEmail(email)) {
    const phone = getDisplayPhone(user);
    if (phone !== "—") return `Signed in with phone · ${phone}`;
    return "Signed in with phone";
  }
  return email;
}

/**
 * Subtitle under the user's name: email, or phone when they signed in with phone.
 */
export function getDisplaySubtitle(user) {
  const email = user?.email || user?.username;
  if (isPhoneAuthEmail(email)) {
    const phone = getDisplayPhone(user);
    if (phone !== "—") return phone;
    return "Signed in with phone";
  }
  return email || "—";
}
