import { createTRPCRouter } from "../trpc";
import { availabilitiesRouter } from "./availability";
import { shiftRequestsEmployeeRouter } from "./shiftRequests";

export const employeeRouter = createTRPCRouter({
  availabilities: availabilitiesRouter,
  shiftRequests: shiftRequestsEmployeeRouter
});
