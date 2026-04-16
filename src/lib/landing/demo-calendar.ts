export type DemoDept = "field" | "floor" | "kitchen" | "routing";

export type DemoShift = {
  id: string;
  dept: DemoDept;
  label: string;
};

/** Stable demo shifts by day-of-month (1–31) for the hero calendar. */
export const DEMO_SHIFTS_BY_DAY: Record<number, DemoShift[]> = {
  2: [
    { id: "a", dept: "field", label: "Dawn route" },
    { id: "b", dept: "routing", label: "Night handoff" },
  ],
  3: [{ id: "c", dept: "kitchen", label: "Prep block" }],
  7: [
    { id: "d", dept: "floor", label: "Front desk" },
    { id: "e", dept: "field", label: "Site audit" },
  ],
  12: [{ id: "f", dept: "routing", label: "Logistics" }],
  14: [
    { id: "g", dept: "kitchen", label: "Line A" },
    { id: "h", dept: "floor", label: "Coverage" },
    { id: "i", dept: "field", label: "Field sync" },
  ],
  16: [{ id: "j", dept: "field", label: "Morning crew" }],
  21: [{ id: "k", dept: "floor", label: "Closing" }],
  24: [{ id: "l", dept: "kitchen", label: "Batch cook" }],
  28: [{ id: "m", dept: "routing", label: "Dispatch" }],
};

export function buildCalendarGrid(year: number, month: number): {
  date: Date;
  inMonth: boolean;
}[] {
  const first = new Date(year, month, 1);
  const pad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: { date: Date; inMonth: boolean }[] = [];

  for (let i = pad - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month, -i), inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1]!.date;
    const next = new Date(last);
    next.setDate(next.getDate() + 1);
    cells.push({ date: next, inMonth: false });
  }
  while (cells.length < 42) {
    const last = cells[cells.length - 1]!.date;
    const next = new Date(last);
    next.setDate(next.getDate() + 1);
    cells.push({ date: next, inMonth: false });
  }
  return cells.slice(0, 42);
}
