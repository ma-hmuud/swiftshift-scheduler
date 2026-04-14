import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "~/server/db";
import { shiftRequests, shifts, user } from "~/server/db/schema";

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

export const getAllShiftRequestsForManagerDb = async (managerId: number) => {
  return db
    .select({
      id: shiftRequests.id,
      status: shiftRequests.status,
      createdAt: shiftRequests.createdAt,
      employeeName: user.name,
      employeeEmail: user.email,
      shiftId: shifts.id,
      shiftTitle: shifts.title,
      shiftStartTime: shifts.startTime,
      shiftEndTime: shifts.endTime,
    })
    .from(shiftRequests)
    .innerJoin(shifts, eq(shiftRequests.shiftId, shifts.id))
    .innerJoin(user, eq(shiftRequests.employeeId, user.id))
    .where(eq(shifts.managerId, managerId))
    .orderBy(desc(shiftRequests.createdAt));
};

export const getEmployeeRequestsForShiftsDb = async (
  employeeId: number,
  shiftIds: number[],
) => {
  if (shiftIds.length === 0) {
    return [] as {
      shiftId: number;
      status: string;
      createdAt: Date;
      id: number;
    }[];
  }

  return db
    .select({
      id: shiftRequests.id,
      shiftId: shiftRequests.shiftId,
      status: shiftRequests.status,
      createdAt: shiftRequests.createdAt,
    })
    .from(shiftRequests)
    .where(
      and(
        eq(shiftRequests.employeeId, employeeId),
        inArray(shiftRequests.shiftId, shiftIds),
      ),
    )
    .orderBy(desc(shiftRequests.createdAt));
};
