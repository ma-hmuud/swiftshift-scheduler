/** Alphanumeric without ambiguous 0/O/1/I. */
const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** 8-character invite code for display / entry (no separator required). */
export function generateInviteCode(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += CHARSET[bytes[i]! % CHARSET.length];
  }
  return out;
}

/** Normalize user input for lookup (uppercase, strip spaces/dashes). */
export function normalizeInviteCode(input: string): string {
  return input.replace(/[\s-]/g, "").toUpperCase();
}
