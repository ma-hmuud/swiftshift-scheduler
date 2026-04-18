import { and, asc, eq } from "drizzle-orm";

import { db } from "~/server/db";
import { communityMember, user } from "~/server/db/schema";

export const listEmployeesDb = async (communityId: number) => {
  return db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    })
    .from(communityMember)
    .innerJoin(user, eq(communityMember.userId, user.id))
    .where(
      and(
        eq(communityMember.communityId, communityId),
        eq(communityMember.role, "employee"),
      ),
    )
    .orderBy(asc(user.name));
};
