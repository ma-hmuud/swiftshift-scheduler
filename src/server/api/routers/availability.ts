import {
  availabilityCreateProc,
  availabilityDeleteProc,
  availabilityGetAllProc,
  availabilityUpdateProc,
} from "../procedures/availability";
import { createTRPCRouter } from "../trpc";

export const availabilitiesRouter = createTRPCRouter({
  list: availabilityGetAllProc,
  create: availabilityCreateProc,
  update: availabilityUpdateProc,
  delete: availabilityDeleteProc,
});
