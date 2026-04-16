import { TRPCError } from "@trpc/server";

import { protectedProcedure } from "../trpc";
import { getEmployeeDashboardData } from "../repositories/dashboard";
import { tryCatch } from "~/lib/utils/try-catch";

export const employeeProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const role = ctx.session.user.role;
    if (role !== "employee") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "This action is only available to employees",
      });
    }
    return next();
  },
);

export const dashboardProc = employeeProcedure.query(async ({ ctx }) => {
  const { id: employeeId } = ctx.session.user;

  const { data: dashboardData, error: dashError } = await tryCatch(
    getEmployeeDashboardData(Number(employeeId)),
  );

  if (dashError) {
    console.error("Error fetching employee dashboard data:", dashError.message);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch employee dashboard data",
    });
  }

  return { ok: true, data: dashboardData };
});
