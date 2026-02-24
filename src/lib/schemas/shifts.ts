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
  managerId: z.number().int().positive("Manager ID must be a positive integer"),
});

export const createShiftSchema = baseShiftSchema.refine(
  (data) => data.endTime > data.startTime,
);

export const updateShiftSchema = baseShiftSchema
  .omit({ managerId: true })
  .extend({
    id: z.number().int().positive("Manager ID must be a positive integer"),
    status: z.enum(["draft", "published", "cancelled", "filled"]),
  })
  .refine((data) => data.endTime > data.startTime)
  .partial();

export type ShiftInput = z.infer<typeof createShiftSchema>;
export type UpdateShiftInput = z.infer<typeof updateShiftSchema>;
