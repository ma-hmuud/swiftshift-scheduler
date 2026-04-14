import { tryCatch } from "~/lib/utils/try-catch";
import { listEmployeesDb } from "../repositories/employees";
import { managerProcedure } from "./manager";
import { TRPCError } from "@trpc/server";

export const employeesListProc = managerProcedure.query(async () => {
  const { data, error } = await tryCatch(listEmployeesDb());

  if (error) {
    console.error("Error listing employees:", error.message);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to list employees",
    });
  }

  return { ok: true, data };
});
