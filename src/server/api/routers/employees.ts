import { employeesListProc } from "../procedures/employees";
import { createTRPCRouter } from "../trpc";

export const employeesRouter = createTRPCRouter({
  list: employeesListProc,
});
