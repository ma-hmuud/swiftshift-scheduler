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
