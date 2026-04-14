import {
  shiftsGetAllProc,
  shiftsCreateProc,
  shiftsUpdateProc,
  shiftsDeleteProc,
  shiftsCalendarForEmployeeProc,
} from "../procedures/shifts";
import { createTRPCRouter } from "../trpc";

export const shiftsRouter = createTRPCRouter({
  // get proc
  list: shiftsGetAllProc,

  // create proc
  create: shiftsCreateProc,

  // update proc
  update: shiftsUpdateProc,

  // delete proc
  delete: shiftsDeleteProc,
});

export const shiftsEmployeeRouter = createTRPCRouter({
  calendar: shiftsCalendarForEmployeeProc,
});