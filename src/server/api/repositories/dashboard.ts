import "server-only";

import { count, desc, eq } from "drizzle-orm";

import { isShiftStillOpen } from "~/lib/shifts/time";
import { db } from "~/server/db";
import { shiftRequests, shifts, user } from "~/server/db/schema";

const DASHBOARD_LIST_LIMIT = 5;

type AvailabilityDays = Record<number, boolean>;

export type ManagerDashboardData = {
  recentRequests: {
    id: number;
    shiftId: number;
    shiftTitle: string;
    employeeName: string;
    status: string;
    createdAt: Date;
  }[];
  recentShifts: {
    id: number;
    title: string;
    startTime: string;
    endTime: string;
    status: string;
    maxEmployees: number;
    createdAt: Date;
  }[];
  requestsCount: number;
  shiftsCount: number;
  employeesCount: number;
};

export type EmployeeDashboardData = {
  recentRequests: {
    id: number;
    shiftId: number;
    shiftTitle: string;
    status: string;
    createdAt: Date;
    shiftStartTime: string;
    shiftEndTime: string;
  }[];
  requestsCount: number;
  shiftsCount: number;
};

const matchesAvailability = (
  availabilityDays: AvailabilityDays,
  shift: { startTime: string; endTime: string },
) => {
  const shiftStartDay = new Date(shift.startTime).getUTCDay();
  const shiftEndDay = new Date(shift.endTime).getUTCDay();

  return Boolean(availabilityDays[shiftStartDay] && availabilityDays[shiftEndDay]);
};

export const getManagerDashboardData = async (
  managerId: number,
): Promise<ManagerDashboardData> => {
  const [
    recentRequests,
    recentShifts,
    requestsCountResult,
    shiftsCountResult,
    employeesCountResult,
  ] = await Promise.all([
    db
      .select({
        id: shiftRequests.id,
        shiftId: shifts.id,
        shiftTitle: shifts.title,
        employeeName: user.name,
        status: shiftRequests.status,
        createdAt: shiftRequests.createdAt,
      })
      .from(shiftRequests)
      .innerJoin(shifts, eq(shiftRequests.shiftId, shifts.id))
      .innerJoin(user, eq(shiftRequests.employeeId, user.id))
      .where(eq(shifts.managerId, managerId))
      .orderBy(desc(shiftRequests.createdAt))
      .limit(DASHBOARD_LIST_LIMIT),
    db
      .select({
        id: shifts.id,
        title: shifts.title,
        startTime: shifts.startTime,
        endTime: shifts.endTime,
        status: shifts.status,
        maxEmployees: shifts.maxEmployees,
        createdAt: shifts.createdAt,
      })
      .from(shifts)
      .where(eq(shifts.managerId, managerId))
      .orderBy(desc(shifts.createdAt))
      .limit(DASHBOARD_LIST_LIMIT),
    db
      .select({
        count: count(shiftRequests.id),
      })
      .from(shiftRequests)
      .innerJoin(shifts, eq(shiftRequests.shiftId, shifts.id))
      .where(eq(shifts.managerId, managerId)),
    db
      .select({
        count: count(shifts.id),
      })
      .from(shifts)
      .where(eq(shifts.managerId, managerId)),
    db
      .select({
        count: count(user.id),
      })
      .from(user)
      .where(eq(user.role, "employee")),
  ]);

  return {
    recentRequests,
    recentShifts,
    requestsCount: requestsCountResult[0]?.count ?? 0,
    shiftsCount: shiftsCountResult[0]?.count ?? 0,
    employeesCount: employeesCountResult[0]?.count ?? 0,
  };
};

export const getEmployeeDashboardData = async (
  employeeId: number,
): Promise<EmployeeDashboardData> => {
  const [recentRequests, requestsCountResult, availabilityRecord, publishedShifts] =
    await Promise.all([
      db
        .select({
          id: shiftRequests.id,
          shiftId: shifts.id,
          shiftTitle: shifts.title,
          status: shiftRequests.status,
          createdAt: shiftRequests.createdAt,
          shiftStartTime: shifts.startTime,
          shiftEndTime: shifts.endTime,
        })
        .from(shiftRequests)
        .innerJoin(shifts, eq(shiftRequests.shiftId, shifts.id))
        .where(eq(shiftRequests.employeeId, employeeId))
        .orderBy(desc(shiftRequests.createdAt))
        .limit(DASHBOARD_LIST_LIMIT),
      db
        .select({
          count: count(shiftRequests.id),
        })
        .from(shiftRequests)
        .where(eq(shiftRequests.employeeId, employeeId)),
      db.query.availability.findFirst({
        where: (availability, { eq }) => eq(availability.employeeId, employeeId),
        columns: {
          daysOfWeek: true,
        },
      }),
      db
        .select({
          id: shifts.id,
          startTime: shifts.startTime,
          endTime: shifts.endTime,
        })
        .from(shifts)
        .where(eq(shifts.status, "published")),
    ]);

  const availabilityDays =
    (availabilityRecord?.daysOfWeek as AvailabilityDays | undefined) ?? null;

  const shiftsCount = availabilityDays
    ? publishedShifts
        .filter((shift) => isShiftStillOpen(shift.endTime))
        .filter((shift) => matchesAvailability(availabilityDays, shift)).length
    : 0;

  return {
    recentRequests,
    requestsCount: requestsCountResult[0]?.count ?? 0,
    shiftsCount,
  };
};
