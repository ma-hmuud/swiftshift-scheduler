import { tryCatch } from "~/lib/utils/try-catch";
import { protectedProcedure } from "../trpc";
import {
  createAvailabilityDb,
  deleteAvailabilityDb,
  getAvailabilityDb,
  updateAvailabilityDb,
} from "../repositories/availability";
import { TRPCError } from "@trpc/server";
import {
  availabilitySchema,
  updateAvailabilitySchema,
} from "~/lib/schemas/availability";
import z from "zod";

export const availabilityGetAllProc = protectedProcedure.query(
  async ({ ctx }) => {
    const { id: employeeId } = ctx.session.user;

    const { data: avDb, error: avError } = await tryCatch(
      getAvailabilityDb(Number(employeeId)),
    );

    if (avError) {
      console.error("Error fetching availability:", avError.message);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch availability",
      });
    }

    return { ok: true, data: avDb };
  },
);

export const availabilityCreateProc = protectedProcedure
  .input(availabilitySchema)
  .mutation(async ({ ctx, input }) => {
    const { id: employeeId } = ctx.session.user;

    const { data: newAv, error: newAvError } = await tryCatch(
      createAvailabilityDb(input, Number(employeeId)),
    );

    if (newAvError && !newAv) {
      console.error("Error creating availability:", newAvError.message);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create availability",
      });
    }

    return { ok: true, data: newAv };
  });

export const availabilityUpdateProc = protectedProcedure
  .input(updateAvailabilitySchema)
  .mutation(async ({ ctx, input }) => {
    const { id: employeeId } = ctx.session.user;
    const { id: avId, ...newAv } = input;
    const { data: updatedAv, error: updatedAvError } = await tryCatch(
      updateAvailabilityDb(avId, newAv, Number(employeeId)),
    );

    if (updatedAvError) {
      console.error("Error updating availability:", updatedAvError.message);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update availability",
      });
    }

    if (!updatedAv) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Availability not found or could not be updated.",
      });
    }

    return { ok: true, data: updatedAv };
  });

export const availabilityDeleteProc = protectedProcedure
  .input(
    z.object({
      avId: z
        .number()
        .int()
        .positive("Availability ID must be a positive integer"),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { id: employeeId } = ctx.session.user;
    const { avId } = input;
    const { data: deletedAv, error: deletedAvError } = await tryCatch(
      deleteAvailabilityDb(avId, Number(employeeId)),
    );

    if (deletedAvError) {
      console.error("Error deleting availability:", deletedAvError.message);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete availability",
      });
    }

    if (!deletedAv) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Availability not found or could not be deleted.",
      });
    }

    return { ok: true, data: deletedAv };
  });
