import { createTRPCRouter } from "../trpc";
import { assignManagerProc } from "../procedures/manager";
import { shiftsRouter } from "./shifts";
import { shiftRequestsManagerRouter } from "./shiftRequests";

export const managerRouter = createTRPCRouter({
  assignManager: assignManagerProc,
  shifts: shiftsRouter,
  shiftRequests: shiftRequestsManagerRouter
});
