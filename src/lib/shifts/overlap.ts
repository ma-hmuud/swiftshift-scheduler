/**
 * Two [start, end) intervals overlap if they share any instant (touching endpoints do not overlap).
 * Times are ISO 8601 strings parseable by Date.
 */
export function timeIntervalsOverlap(
  aStartIso: string,
  aEndIso: string,
  bStartIso: string,
  bEndIso: string,
): boolean {
  const a0 = new Date(aStartIso).getTime();
  const a1 = new Date(aEndIso).getTime();
  const b0 = new Date(bStartIso).getTime();
  const b1 = new Date(bEndIso).getTime();
  if ([a0, a1, b0, b1].some((n) => Number.isNaN(n))) {
    return false;
  }
  return a0 < b1 && b0 < a1;
}
