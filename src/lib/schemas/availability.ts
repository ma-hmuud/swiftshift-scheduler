import z from "zod";

export const availabilitySchema = z.object({
  daysOfWeek: z.record(
    z.enum(
      ["0", "1", "2", "3", "4", "5", "6"],
      "Day of week must be between 0 (Sunday) and 6 (Saturday)",
    ),
    z.boolean("Availability must be a boolean value"),
  ),
});

export type AvailabilityInput = z.infer<typeof availabilitySchema>;

export const updateAvailabilitySchema = availabilitySchema
  .extend({
    id: z.number().int().positive("Availability ID must be a positive integer"),
  });

export const WEEKDAY_KEYS = ["0", "1", "2", "3", "4", "5", "6"] as const;
export type WeekdayKey = (typeof WEEKDAY_KEYS)[number];

export const WEEKDAY_LABELS: Record<WeekdayKey, string> = {
  "0": "Sunday",
  "1": "Monday",
  "2": "Tuesday",
  "3": "Wednesday",
  "4": "Thursday",
  "5": "Friday",
  "6": "Saturday",
};

export function defaultDaysOfWeek(): AvailabilityInput["daysOfWeek"] {
  return {
    "0": false,
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false,
    "6": false,
  };
}

/** Merge stored JSON with defaults so every weekday key is present. */
export function normalizeDaysOfWeek(raw: unknown): AvailabilityInput["daysOfWeek"] {
  const out = defaultDaysOfWeek();
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>;
    for (const k of WEEKDAY_KEYS) {
      const v = o[k];
      if (typeof v === "boolean") out[k] = v;
    }
  }
  return out;
}
