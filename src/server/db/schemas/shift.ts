import { bigint, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { community } from "./community";
import { user } from "./user";

export const shifts = pgTable("shifts", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  managerId: bigint("manager_id", { mode: "number" })
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  communityId: bigint("community_id", { mode: "number" }).references(() => community.id, {
    onDelete: "cascade",
  }),
  title: text("title").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  maxEmployees: integer("max_employees").notNull(),
  status: text("status").notNull().default("draft"), // draft | published | cancelled | filled
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const shiftRequests = pgTable("shift_requests", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  shiftId: bigint("shift_id", { mode: "number" })
    .references(() => shifts.id, { onDelete: "cascade" })
    .notNull(),
  employeeId: bigint("employee_id", { mode: "number" })
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  status: text("status").notNull().default("pending"), // pending | approved | rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

