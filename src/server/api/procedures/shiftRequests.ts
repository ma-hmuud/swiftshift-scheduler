import z from "zod";
import { getCommunityIdForUser } from "~/server/api/repositories/community";
import { employeeProcedure } from "./employee";
import { managerProcedure } from "./manager";
import { tryCatch } from "~/lib/utils/try-catch";
import {
  countApprovedAssignmentsForShiftDb,
  deleteShiftRequestByManagerDb,
  getAllShiftRequestsForManagerDb,
  getApprovedAssignmentsForShiftDb,
  getEmployeeShiftRequestsDb,
  getManagerShiftsRequestsDb,
  getShiftRequestReplyContextDb,
  replyToShiftRequestDb,
  sendShiftRequestDb,
} from "../repositories/shiftRequests";
import { TRPCError } from "@trpc/server";
import { hasShiftEnded } from "~/lib/shifts/time";
import { getAvailabilityDb } from "../repositories/availability";
import { getOneShiftDb } from "../repositories/shifts";

// Manager proces
export const shiftRequestsListAllForManagerProc = managerProcedure.query(
  async ({ ctx }) => {
    const managerId = Number(ctx.session.user.id);

    const { data: shiftRequests, error: shiftRequestsError } = await tryCatch(
      getAllShiftRequestsForManagerDb(managerId),
    );
    if (shiftRequestsError) {
      console.error("Error fetching shift requests:", shiftRequestsError);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch shift requests",
      });
    }

    return { ok: true, data: shiftRequests };
  },
);

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

export const shiftRequestsListApprovedForShiftProc = managerProcedure
  .input(
    z.object({
      shiftId: z.number().int().positive("Shift ID must be positive"),
    }),
  )
  .query(async ({ input, ctx }) => {
    const { shiftId } = input;
    const managerId = Number(ctx.session.user.id);

    const { data, error } = await tryCatch(
      getApprovedAssignmentsForShiftDb(shiftId, managerId),
    );
    if (error) {
      console.error("Error loading shift assignments:", error.message);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to load assigned employees",
      });
    }

    return { ok: true as const, data };
  });

export const shiftRequestsRemoveAssignmentProc = managerProcedure
  .input(
    z.object({
      requestId: z.number().int().positive("Request ID must be positive"),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const managerId = Number(ctx.session.user.id);

    const { data, error } = await tryCatch(
      deleteShiftRequestByManagerDb(input.requestId, managerId),
    );
    if (error) {
      console.error("Error removing assignment:", error.message);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to remove employee from shift",
      });
    }

    if (!data) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Assignment not found or you do not have permission to remove it",
      });
    }

    return { ok: true as const, data };
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
    const managerIdNum = Number(ctx.session.user.id);

    if (status === "approved") {
      const { data: replyCtx, error: ctxError } = await tryCatch(
        getShiftRequestReplyContextDb(shiftRequestId, managerIdNum),
      );
      if (ctxError) {
        console.error("Error loading shift request:", ctxError.message);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to validate approval",
        });
      }
      if (!replyCtx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Shift request not found or you do not have permission to reply to it",
        });
      }

      if (replyCtx.requestStatus !== "approved") {
        const { data: approvedCount, error: countError } = await tryCatch(
          countApprovedAssignmentsForShiftDb(replyCtx.shiftId, managerIdNum),
        );
        if (countError) {
          console.error("Error counting approvals:", countError.message);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to validate shift capacity",
          });
        }
        if (approvedCount >= replyCtx.maxEmployees) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `This shift is at capacity (${replyCtx.maxEmployees} approved). Increase capacity or remove an employee before approving this request.`,
          });
        }
      }
    }

    const { data: shiftRequests, error: shiftRequestsError } = await tryCatch(
      replyToShiftRequestDb(shiftRequestId, status, managerIdNum),
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
export const shiftRequestsEmployeeProc = employeeProcedure.query(
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

export const shiftRequestsSendProc = employeeProcedure
  .input(
    z.object({
      shiftId: z.number().int().positive("Shift ID must be positive"),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { shiftId } = input;
    const employeeIdNum = Number(ctx.session.user.id);

    const communityId = await getCommunityIdForUser(employeeIdNum);
    if (!communityId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Join a community before requesting shifts.",
      });
    }

    // get availability for employee and the shift time to check if the employee is available for that shift before sending the request

    const { data, error } = await tryCatch(
      Promise.all([getAvailabilityDb(employeeIdNum), getOneShiftDb(shiftId)]),
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

    if (shift.communityId == null || shift.communityId !== communityId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "This shift is not available in your community.",
      });
    }

    if (hasShiftEnded(shift.endTime)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "This shift has already ended.",
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
      sendShiftRequestDb(employeeIdNum, shiftId),
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
