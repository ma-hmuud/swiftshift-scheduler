import { bigint, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./user";

export const community = pgTable("community", {
  id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  inviteCode: text("invite_code").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const communityMember = pgTable(
  "community_member",
  {
    userId: bigint("user_id", { mode: "number" })
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    communityId: bigint("community_id", { mode: "number" })
      .notNull()
      .references(() => community.id, { onDelete: "cascade" }),
    /** Role within this community — mirrors `user.role` after onboarding. */
    role: text("role").notNull(),
  },
  (table) => [index("community_member_community_id_idx").on(table.communityId)],
);
