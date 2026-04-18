import { TRPCError } from "@trpc/server";
import z from "zod";

import {
  createShiftClientSchema,
  createShiftSchema,
  updateShiftSchema,
} from "~/lib/schemas/shifts";
import { timeIntervalsOverlap } from "~/lib/shifts/overlap";
import { isShiftStillOpen } from "~/lib/shifts/time";
import { tryCatch } from "~/lib/utils/try-catch";
import { getAvailabilityDb } from "../repositories/availability";
import { getManagerByIdDb } from "../repositories/manager";
import { getCommunityIdForUser } from "~/server/api/repositories/community";
import {
  createShiftDb,
  deleteShiftDb,
  getAllShiftsDb,
  getApprovedBookingCountsDb,
  getManagerShiftRowDb,
  getPublishedShiftsWithManagerDb,
  listNonCancelledShiftsForOverlapDb,
  updateShiftDb,
} from "../repositories/shifts";
import { getEmployeeShiftRequestsDb } from "../repositories/shiftRequests";
import { employeeProcedure } from "./employee";
import { managerProcedure } from "./manager";

function findOverlappingShiftTitles(
  candidateStart: string,
  candidateEnd: string,
  others: { title: string; startTime: string; endTime: string }[],
): string[] {
  return others
    .filter((row) =>
      timeIntervalsOverlap(candidateStart, candidateEnd, row.startTime, row.endTime),
    )
    .map((row) => row.title);
}

export const shiftsGetAllProc = managerProcedure.query(async ({ ctx }) => {
  const managerId = Number(ctx.session.user.id);
  const { data, error } = await tryCatch(
    Promise.all([getAllShiftsDb(managerId), getApprovedBookingCountsDb()]),
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
    const communityId = await getCommunityIdForUser(managerId);
    if (!communityId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Create or join a community before creating shifts.",
      });
    }

    const payload = createShiftSchema.parse({ ...input, managerId, communityId });

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

    const { data: siblings, error: siblingsError } = await tryCatch(
      listNonCancelledShiftsForOverlapDb(managerId),
    );
    if (siblingsError) {
      console.error("Error loading shifts for overlap check:", siblingsError.message);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to validate shift schedule",
      });
    }

    const overlappingTitles = findOverlappingShiftTitles(
      payload.startTime,
      payload.endTime,
      siblings,
    );
    if (overlappingTitles.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `This time range overlaps another shift: ${overlappingTitles.map((t) => `"${t}"`).join(", ")}. Change the times or cancel the other shift first.`,
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

    const { data: existing, error: existingError } = await tryCatch(
      getManagerShiftRowDb(shiftId, Number(managerId)),
    );
    if (existingError) {
      console.error("Error loading shift for update:", existingError.message);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to load shift",
      });
    }
    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Shift not found or you don't have permission to update it",
      });
    }

    const mergedStatus = newShift.status ?? existing.status;
    if (mergedStatus !== "cancelled") {
      const mergedStart = newShift.startTime ?? existing.startTime;
      const mergedEnd = newShift.endTime ?? existing.endTime;
      if (mergedEnd <= mergedStart) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "End time must be after start time.",
        });
      }

      const { data: siblings, error: siblingsError } = await tryCatch(
        listNonCancelledShiftsForOverlapDb(Number(managerId), shiftId),
      );
      if (siblingsError) {
        console.error("Error loading shifts for overlap check:", siblingsError.message);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to validate shift schedule",
        });
      }

      const overlappingTitles = findOverlappingShiftTitles(
        mergedStart,
        mergedEnd,
        siblings,
      );
      if (overlappingTitles.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `This time range overlaps another shift: ${overlappingTitles.map((t) => `"${t}"`).join(", ")}. Change the times or cancel the other shift first.`,
        });
      }
    }

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

    const communityId = await getCommunityIdForUser(employeeId);
    if (!communityId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Join a community with an invite code before viewing shifts.",
      });
    }

    const { data, error } = await tryCatch(
      Promise.all([
        getAvailabilityDb(employeeId),
        getPublishedShiftsWithManagerDb(communityId),
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
