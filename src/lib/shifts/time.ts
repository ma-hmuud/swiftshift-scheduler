/**
 * Shifts store `startTime` / `endTime` as ISO 8601 strings (UTC).
 * Employee-facing views should ignore shifts that have already ended.
 */
export function hasShiftEnded(endTimeIso: string, now: Date = new Date()): boolean {
  const end = new Date(endTimeIso);
  if (Number.isNaN(end.getTime())) {
    return true;
  }
  return end < now;
}

/** Published shift is still relevant for booking, counts, and the employee calendar. */
export function isShiftStillOpen(endTimeIso: string, now: Date = new Date()): boolean {
  return !hasShiftEnded(endTimeIso, now);
}
