import { tryCatch } from "~/lib/utils/try-catch";
import {
  createShiftDb,
  deleteShiftDb,
  getAllShiftsDb,
  updateShiftDb,
} from "../repositories/shifts";
import { managerProcedure } from "./manager";
import { TRPCError } from "@trpc/server";
import { createShiftSchema, updateShiftSchema } from "~/lib/schemas/shifts";
import { getManagerByIdDb } from "../repositories/manager";
import z from "zod";

export const shiftsGetAllProc = managerProcedure.query(async () => {
  const { data: shiftsDb, error: shiftsError } =
    await tryCatch(getAllShiftsDb());

  if (shiftsError) {
    console.error("Error fetching shifts:", shiftsError.message);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch shifts",
    });
  }

  return { ok: true, data: shiftsDb };
});

export const shiftsCreateProc = managerProcedure
  .input(createShiftSchema)
  .mutation(async ({ input }) => {
    const { managerId } = input;
    const { data: manager, error: managerError } = await tryCatch(
      getManagerByIdDb(managerId),
    );

    if (managerError) {
      console.error("Error fetching manager:", managerError.message);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch manager",
      });
    }

    if (!manager) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Manager not found",
      });
    }

    const { data: newShift, error: newShiftError } = await tryCatch(
      createShiftDb(input),
    );
    if (newShiftError && !newShift) {
      console.error("Error creating shift:", newShiftError.message);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create shift",
      });
    }

    return { ok: true, data: newShift };
  });

export const shiftsUpdateProc = managerProcedure
  .input(updateShiftSchema)
  .mutation(async ({ ctx, input }) => {
    const { id: shiftId, ...newShift } = input;
    const { id: managerId } = ctx.session.user;
    if (!shiftId)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Shift ID must be exist",
      });

    const { data: updatedShift, error: updatedShiftError } = await tryCatch(
      updateShiftDb(shiftId, newShift, Number(managerId)),
    );
    if (updatedShiftError) {
      console.error("Error updating shift:", updatedShiftError.message);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update shift",
      });
    }

    if (!updatedShift) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Shift not found or you don't have permission to update it",
      });
    }

    return { ok: true, data: updatedShift };
  });

export const shiftsDeleteProc = managerProcedure
  .input(
    z.object({
      shiftId: z.number().int().positive("Shift ID must be a positive integer"),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { shiftId } = input;
    const { id: managerId } = ctx.session.user;

    const { data: deletedShift, error: deletedShiftError } = await tryCatch(
      deleteShiftDb(shiftId, Number(managerId)),
    );
    if (deletedShiftError) {
      console.error("Error deleting shift:", deletedShiftError.message);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete shift",
      });
    }
    if (!deletedShift) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Shift not found",
      });
    }

    return { ok: true, data: deletedShift };
  });
