import { TRPCError } from "@trpc/server";

import { protectedProcedure } from "../trpc";

export const employeeProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const role = ctx.session.user.role;
  if (role !== "employee") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "This action is only available to employees",
    });
  }
  return next();
});
