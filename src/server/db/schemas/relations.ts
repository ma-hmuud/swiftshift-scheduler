import { relations } from "drizzle-orm";

import { community, communityMember } from "./community";
import { shiftRequests, shifts } from "./shift";
import { account, availability, session, user } from "./user";

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  shifts: many(shifts),
  availability: one(availability, {
    fields: [user.id],
    references: [availability.employeeId],
  }),
  shiftRequests: many(shiftRequests),
  communityMembership: one(communityMember, {
    fields: [user.id],
    references: [communityMember.userId],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const availabilityRelations = relations(availability, ({ one }) => ({
  employee: one(user, {
    fields: [availability.employeeId],
    references: [user.id],
  }),
}));

export const communityRelations = relations(community, ({ many }) => ({
  members: many(communityMember),
}));

export const communityMemberRelations = relations(communityMember, ({ one }) => ({
  community: one(community, {
    fields: [communityMember.communityId],
    references: [community.id],
  }),
  user: one(user, {
    fields: [communityMember.userId],
    references: [user.id],
  }),
}));

export const shiftRelations = relations(shifts, ({ one, many }) => ({
  manager: one(user, {
    fields: [shifts.managerId],
    references: [user.id],
  }),
  community: one(community, {
    fields: [shifts.communityId],
    references: [community.id],
  }),
  shiftRequests: many(shiftRequests),
}));

export const shiftRequestRelations = relations(shiftRequests, ({ one }) => ({
  shift: one(shifts, {
    fields: [shiftRequests.shiftId],
    references: [shifts.id],
  }),
  employee: one(user, {
    fields: [shiftRequests.employeeId],
    references: [user.id],
  }),
}));
