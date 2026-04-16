import { dashboardProc } from "../procedures/employee";
import { createTRPCRouter } from "../trpc";
import { availabilitiesRouter } from "./availability";
import { shiftRequestsEmployeeRouter } from "./shiftRequests";
import { shiftsEmployeeRouter } from "./shifts";

export const employeeRouter = createTRPCRouter({
  availabilities: availabilitiesRouter,
  shiftRequests: shiftRequestsEmployeeRouter,
  shifts: shiftsEmployeeRouter,
  dashboard: dashboardProc,
});
