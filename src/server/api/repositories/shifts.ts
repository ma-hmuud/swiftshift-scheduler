import { and, eq } from "drizzle-orm";
import type { ShiftInput, UpdateShiftInput } from "~/lib/schemas/shifts";
import { db } from "~/server/db";
import { shifts, user } from "~/server/db/schema";

export const getAllShiftsDb = async () => {
  return db
    .select({
      id: shifts.id,
      title: shifts.title,
      startTime: shifts.startTime,
      endTime: shifts.endTime,
      maxEmployees: shifts.maxEmployees,
      status: shifts.status,
      createdAt: shifts.createdAt,
      updatedAt: shifts.updatedAt,
      managerId: shifts.managerId,
      managerName: user.name,
    })
    .from(shifts)
    .innerJoin(user, eq(shifts.managerId, user.id));
};

export const getManagerShiftDb = async (shiftId: number, managerId: number) => {
  return db
    .select({
      id: shifts.id,
      startTime: shifts.startTime,
      endTime: shifts.endTime,
    })
    .from(shifts)
    .where(and(eq(shifts.id, shiftId), eq(shifts.managerId, managerId)));
};

export const getOneShiftDb = async (shiftId: number) => {
  return db
    .select({
      id: shifts.id,
      startTime: shifts.startTime,
      endTime: shifts.endTime,
      status: shifts.status,
    })
    .from(shifts)
    .where(and(eq(shifts.id, shiftId), eq(shifts.status, "published")))
    .then((res) => res[0]);
};

export const createShiftDb = async (shift: ShiftInput) => {
  return db
    .insert(shifts)
    .values(shift)
    .returning({
      id: shifts.id,
    })
    .then((res) => res[0]);
};

export const updateShiftDb = async (
  shiftId: number,
  shift: UpdateShiftInput,
  managerId: number,
) => {
  return db
    .update(shifts)
    .set(shift)
    .where(and(eq(shifts.id, shiftId), eq(shifts.managerId, managerId)))
    .returning({
      id: shifts.id,
    })
    .then((res) => res[0]);
};

export const deleteShiftDb = async (shiftId: number, managerId: number) => {
  return db
    .delete(shifts)
    .where(and(eq(shifts.id, shiftId), eq(shifts.managerId, managerId)))
    .returning({
      id: shifts.id,
    });
};
