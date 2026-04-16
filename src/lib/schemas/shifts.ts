import z from "zod";

const baseShiftSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime(),
  maxEmployees: z
    .number()
    .int()
    .positive("Max employees must be a positive integer"),
  status: z.enum(["draft", "published"]).default("draft"),
  managerId: z.number().int().positive("Manager ID must be a positive integer"),
});

export const createShiftSchema = baseShiftSchema.refine(
  (data) => data.endTime > data.startTime,
);

/** Client / API input — manager id is taken from the session server-side. */
export const createShiftClientSchema = baseShiftSchema
  .omit({ managerId: true })
  .refine((data) => data.endTime > data.startTime);

export const updateShiftSchema = baseShiftSchema
  .omit({ managerId: true })
  .extend({
    id: z.number().int().positive("Shift ID must be a positive integer"),
    status: z.enum(["draft", "published", "cancelled", "filled"]),
  })
  .partial()
  .superRefine((data, ctx) => {
    if (data.startTime !== undefined && data.endTime !== undefined) {
      if (data.endTime <= data.startTime) {
        ctx.addIssue({
          code: "custom",
          message: "End time must be after start time",
          path: ["endTime"],
        });
      }
    }
  });

export type ShiftInput = z.infer<typeof createShiftSchema>;
export type CreateShiftClientInput = z.infer<typeof createShiftClientSchema>;
export type UpdateShiftInput = z.infer<typeof updateShiftSchema>;
