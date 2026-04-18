import {
  shiftRequestsEmployeeProc,
  shiftRequestsGetAllProc,
  shiftRequestsListAllForManagerProc,
  shiftRequestsListApprovedForShiftProc,
  shiftRequestsRemoveAssignmentProc,
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
  listAll: shiftRequestsListAllForManagerProc,
  list: shiftRequestsGetAllProc,
  listApprovedForShift: shiftRequestsListApprovedForShiftProc,
  removeAssignment: shiftRequestsRemoveAssignmentProc,
  reply: shiftRequestsReplyProc,
});
