import z from "zod";
import { managerProcedure } from "./manager";
import { tryCatch } from "~/lib/utils/try-catch";
import {
  getEmployeeShiftRequestsDb,
  getManagerShiftsRequestsDb,
  replyToShiftRequestDb,
  sendShiftRequestDb,
} from "../repositories/shiftRequests";
import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../trpc";
import { getAvailabilityDb } from "../repositories/availability";
import { getOneShiftDb } from "../repositories/shifts";

// Manager proces
export const shiftRequestsGetAllProc = managerProcedure
  .input(
    z.object({
      shiftId: z.number().int().positive("Shift ID must be positive"),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { shiftId } = input;
    const { id: managerId } = ctx.session.user;

    const { data: shiftRequests, error: shiftRequestsError } = await tryCatch(
      getManagerShiftsRequestsDb(shiftId, Number(managerId)),
    );
    if (shiftRequestsError) {
      console.error("Error fetching shift requests:", shiftRequestsError);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch shift requests",
      });
    }

    return { ok: true, data: shiftRequests };
  });

export const shiftRequestsReplyProc = managerProcedure
  .input(
    z.object({
      shiftRequestId: z
        .number()
        .int()
        .positive("Shift Request ID must be positive"),
      status: z.enum(["approved", "rejected"]),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { shiftRequestId, status } = input;
    const { id: managerId } = ctx.session.user;

    const { data: shiftRequests, error: shiftRequestsError } = await tryCatch(
      replyToShiftRequestDb(shiftRequestId, status, Number(managerId)),
    );
    if (shiftRequestsError) {
      console.error("Error fetching shift requests:", shiftRequestsError);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch shift requests",
      });
    }

    if (!shiftRequests) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "Shift request not found or you do not have permission to reply to it",
      });
    }

    return { ok: true, data: shiftRequests };
  });

// Employee proces
export const shiftRequestsEmployeeProc = protectedProcedure.query(
  async ({ ctx }) => {
    const { id: employeeId } = ctx.session.user;

    const { data: shiftRequests, error: shiftRequestsError } = await tryCatch(
      getEmployeeShiftRequestsDb(Number(employeeId)),
    );

    if (shiftRequestsError) {
      console.error(
        "Error fetching employee shift requests:",
        shiftRequestsError,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch employee shift requests",
      });
    }

    return { ok: true, data: shiftRequests };
  },
);

export const shiftRequestsSendProc = protectedProcedure
  .input(
    z.object({
      shiftId: z.number().int().positive("Shift ID must be positive"),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { shiftId } = input;
    const { id: employeeId } = ctx.session.user;

    // get availability for employee and the shift time to check if the employee is available for that shift before sending the request

    const { data, error } = await tryCatch(
      Promise.all([
        getAvailabilityDb(Number(employeeId)),
        getOneShiftDb(shiftId),
      ]),
    );
    if (error) {
      console.error(
        "Error fetching employee availability or shift: ",
        error.message,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch employee availability or shift",
      });
    }

    const [availability, shift] = data;

    if (!availability) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "Employee availability not found. Please set your availability before sending shift requests.",
      });
    }
    if (!shift) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Shift not found",
      });
    }

    const shiftStartDay = new Date(shift.startTime).getUTCDay();
    const shiftEndDay = new Date(shift.endTime).getUTCDay();
    const { daysOfWeek } = availability as {
      daysOfWeek: Record<number, boolean>;
    };

    const isAvailable = daysOfWeek[shiftStartDay] && daysOfWeek[shiftEndDay];

    if (!isAvailable) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "You are not available for this shift based on your availability settings.",
      });
    }

    const { data: shiftRequest, error: sendRequestError } = await tryCatch(
      sendShiftRequestDb(Number(employeeId), shiftId),
    );

    if (sendRequestError && !shiftRequest) {
      console.error("Error sending shift request:", sendRequestError);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to send shift request",
      });
    }

    return { ok: true, data: shiftRequest };
  });
