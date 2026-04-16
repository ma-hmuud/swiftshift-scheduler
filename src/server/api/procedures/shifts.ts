import { TRPCError } from "@trpc/server";
import z from "zod";

import {
  createShiftClientSchema,
  createShiftSchema,
  updateShiftSchema,
} from "~/lib/schemas/shifts";
import { isShiftStillOpen } from "~/lib/shifts/time";
import { tryCatch } from "~/lib/utils/try-catch";
import { getAvailabilityDb } from "../repositories/availability";
import { getManagerByIdDb } from "../repositories/manager";
import {
  createShiftDb,
  deleteShiftDb,
  getAllShiftsDb,
  getApprovedBookingCountsDb,
  getPublishedShiftsWithManagerDb,
  updateShiftDb,
} from "../repositories/shifts";
import { getEmployeeShiftRequestsDb } from "../repositories/shiftRequests";
import { employeeProcedure } from "./employee";
import { managerProcedure } from "./manager";

export const shiftsGetAllProc = managerProcedure.query(async () => {
  const { data, error } = await tryCatch(
    Promise.all([getAllShiftsDb(), getApprovedBookingCountsDb()]),
  );

  if (error) {
    console.error("Error fetching shifts:", error.message);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch shifts",
    });
  }

  const [shiftsDb, counts] = data;
  const countMap = new Map(counts.map((c) => [c.shiftId, c.booked]));

  return {
    ok: true,
    data: shiftsDb.map((s) => ({
      ...s,
      bookedCount: countMap.get(s.id) ?? 0,
    })),
  };
});

export const shiftsCreateProc = managerProcedure
  .input(createShiftClientSchema)
  .mutation(async ({ ctx, input }) => {
    const managerId = Number(ctx.session.user.id);
    const payload = createShiftSchema.parse({ ...input, managerId });

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
      createShiftDb(payload),
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

function latestRequestStatusByShift(
  rows: { shiftId: number; status: string; createdAt: Date }[],
) {
  const sorted = [...rows].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
  const map = new Map<number, string>();
  for (const r of sorted) {
    if (!map.has(r.shiftId)) {
      map.set(r.shiftId, r.status);
    }
  }
  return map;
}

export const shiftsCalendarForEmployeeProc = employeeProcedure.query(
  async ({ ctx }) => {
    const employeeId = Number(ctx.session.user.id);

    const { data, error } = await tryCatch(
      Promise.all([
        getAvailabilityDb(employeeId),
        getPublishedShiftsWithManagerDb(),
        getApprovedBookingCountsDb(),
        getEmployeeShiftRequestsDb(employeeId),
      ]),
    );

    if (error) {
      console.error("Error building employee calendar:", error.message);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to load calendar",
      });
    }

    const [availability, publishedShifts, counts, myRequests] = data;

    if (!availability) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "Employee availability not found. Please set your availability before viewing shifts.",
      });
    }

    const countMap = new Map(counts.map((c) => [c.shiftId, c.booked]));
    const statusByShift = latestRequestStatusByShift(myRequests);

    const { daysOfWeek } = availability as {
      daysOfWeek: Record<number, boolean>;
    };

    const filtered = publishedShifts.filter((shift) => {
      if (!isShiftStillOpen(shift.endTime)) return false;
      const shiftStartDay = new Date(shift.startTime).getUTCDay();
      const shiftEndDay = new Date(shift.endTime).getUTCDay();
      return Boolean(daysOfWeek[shiftStartDay] && daysOfWeek[shiftEndDay]);
    });

    return {
      ok: true,
      data: filtered.map((s) => ({
        ...s,
        bookedCount: countMap.get(s.id) ?? 0,
        myRequestStatus: statusByShift.get(s.id) ?? null,
      })),
    };
  },
);
