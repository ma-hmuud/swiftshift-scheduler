import {
  shiftRequestsEmployeeProc,
  shiftRequestsGetAllProc,
  shiftRequestsReplyProc,
  shiftRequestsSendProc,
} from "../procedures/shiftRequests";
import { createTRPCRouter } from "../trpc";

export const shiftRequestsEmployeeRouter = createTRPCRouter({
  // get proc
  list: shiftRequestsEmployeeProc,

  // send proc
  send: shiftRequestsSendProc,
});

export const shiftRequestsManagerRouter = createTRPCRouter({
  // get proc
  list: shiftRequestsGetAllProc,

  // reply proc
  reply: shiftRequestsReplyProc,
});
