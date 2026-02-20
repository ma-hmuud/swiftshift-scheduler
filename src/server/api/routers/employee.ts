import { createTRPCRouter } from "../trpc";
import { availabilitiesRouter } from "./availability";

export const employeeRouter = createTRPCRouter({
  availabilities: availabilitiesRouter,
});
