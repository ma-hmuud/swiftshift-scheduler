import { createTRPCRouter } from "../trpc";
import { assignManagerProc, dashboardProc } from "../procedures/manager";
import { shiftsRouter } from "./shifts";
import { shiftRequestsManagerRouter } from "./shiftRequests";
import { employeesRouter } from "./employees";

export const managerRouter = createTRPCRouter({
  assignManager: assignManagerProc,
  shifts: shiftsRouter,
  shiftRequests: shiftRequestsManagerRouter,
  employees: employeesRouter,
  dashboard: dashboardProc,
});
