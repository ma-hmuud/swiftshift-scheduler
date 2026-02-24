import { and, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { shiftRequests, shifts } from "~/server/db/schema";

export const getManagerShiftsRequestsDb = async (
  shiftId: number,
  managerId: number,
) => {
  return db
    .select()
    .from(shiftRequests)
    .innerJoin(shifts, eq(shiftRequests.shiftId, shifts.id))
    .where(
      and(eq(shiftRequests.shiftId, shiftId), eq(shifts.managerId, managerId)),
    );
};

export const replyToShiftRequestDb = async (
  requestId: number,
  status: "approved" | "rejected",
  managerId: number,
) => {
  return db
    .update(shiftRequests)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(
      and(eq(shiftRequests.id, requestId), eq(shifts.managerId, managerId)),
    )
    .from(shifts)
    .returning({
      id: shiftRequests.id,
    })
    .then((res) => res[0]);
};

export const getEmployeeShiftRequestsDb = async (employeeId: number) => {
  return db
    .select()
    .from(shiftRequests)
    .where(eq(shiftRequests.employeeId, employeeId));
};

export const sendShiftRequestDb = async (
  employeeId: number,
  shiftId: number,
) => {
  return db
    .insert(shiftRequests)
    .values({
      employeeId,
      shiftId,
    })
    .returning({
      id: shiftRequests.id,
    });
};
