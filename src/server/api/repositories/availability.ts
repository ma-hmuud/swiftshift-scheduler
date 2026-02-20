import { and, eq } from "drizzle-orm";
import type { AvailabilityInput } from "~/lib/schemas/availability";
import { db } from "~/server/db";
import { availability } from "~/server/db/schema";

export const getAvailabilityDb = async (employeeId: number) => {
  return db
    .select()
    .from(availability)
    .where(eq(availability.employeeId, employeeId));
};

export const createAvailabilityDb = async (
  av: AvailabilityInput,
  employeeId: number,
) => {
  return db
    .insert(availability)
    .values({
      employeeId,
      daysOfWeek: av.daysOfWeek,
    })
    .returning({
      id: availability.id,
    })
    .then((res) => res[0]);
};

export const updateAvailabilityDb = async (
  avId: number,
  av: AvailabilityInput,
  employeeId: number,
) => {
  return db
    .update(availability)
    .set({
      daysOfWeek: av.daysOfWeek,
    })
    .where(
      and(eq(availability.employeeId, employeeId), eq(availability.id, avId)),
    )
    .returning({
      id: availability.id,
    })
    .then((res) => res[0]);
};

export const deleteAvailabilityDb = async (
  avId: number,
  employeeId: number,
) => {
  return db
    .delete(availability)
    .where(
      and(eq(availability.employeeId, employeeId), eq(availability.id, avId)),
    )
    .returning({
      id: availability.id,
    })
    .then((res) => res[0]);
};
