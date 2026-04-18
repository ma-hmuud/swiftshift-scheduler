import "server-only";

import { eq } from "drizzle-orm";

import { db } from "~/server/db";
import { community, communityMember } from "~/server/db/schema";

export type CommunityMembershipRow = {
  communityId: number;
  role: string;
  communityName: string;
  inviteCode: string;
};

export async function getCommunityMembership(
  userId: number,
): Promise<CommunityMembershipRow | null> {
  const row = await db
    .select({
      communityId: communityMember.communityId,
      role: communityMember.role,
      communityName: community.name,
      inviteCode: community.inviteCode,
    })
    .from(communityMember)
    .innerJoin(community, eq(communityMember.communityId, community.id))
    .where(eq(communityMember.userId, userId))
    .limit(1)
    .then((r) => r[0]);

  return row ?? null;
}
