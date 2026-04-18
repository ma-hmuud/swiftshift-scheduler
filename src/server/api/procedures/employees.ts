import { TRPCError } from "@trpc/server";

import { tryCatch } from "~/lib/utils/try-catch";
import { getCommunityIdForUser } from "~/server/api/repositories/community";
import { listEmployeesDb } from "../repositories/employees";
import { managerProcedure } from "./manager";

export const employeesListProc = managerProcedure.query(async ({ ctx }) => {
  const managerId = Number(ctx.session.user.id);
  const communityId = await getCommunityIdForUser(managerId);
  if (!communityId) {
    return { ok: true as const, data: [] };
  }

  const { data, error } = await tryCatch(listEmployeesDb(communityId));

  if (error) {
    console.error("Error listing employees:", error.message);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to list employees",
    });
  }

  return { ok: true as const, data };
});
