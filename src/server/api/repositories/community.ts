import { eq } from "drizzle-orm";

import { generateInviteCode } from "~/lib/community/invite-code";
import { db } from "~/server/db";
import { community, communityMember, user } from "~/server/db/schema";

function isUniqueViolation(e: unknown): boolean {
  const err = e as { code?: string; cause?: { code?: string } };
  return err?.code === "23505" || err?.cause?.code === "23505";
}

export async function getCommunityIdForUser(userId: number): Promise<number | null> {
  const m = await db.query.communityMember.findFirst({
    where: eq(communityMember.userId, userId),
    columns: { communityId: true },
  });
  return m?.communityId ?? null;
}

export async function createCommunityAsManagerDb(
  userId: number,
  name: string,
): Promise<{ communityId: number; inviteCode: string }> {
  const existingMember = await db.query.communityMember.findFirst({
    where: eq(communityMember.userId, userId),
  });
  if (existingMember) {
    throw new Error("USER_ALREADY_HAS_COMMUNITY");
  }

  for (let attempt = 0; attempt < 8; attempt++) {
    const inviteCode = generateInviteCode();
    try {
      const result = await db.transaction(async (tx) => {
        const [c] = await tx
          .insert(community)
          .values({ name, inviteCode })
          .returning({ id: community.id, inviteCode: community.inviteCode });
        if (!c) throw new Error("COMMUNITY_INSERT_FAILED");

        await tx.insert(communityMember).values({
          userId,
          communityId: c.id,
          role: "manager",
        });

        await tx.update(user).set({ role: "manager" }).where(eq(user.id, userId));

        return { communityId: c.id, inviteCode: c.inviteCode };
      });
      return result;
    } catch (e: unknown) {
      if (isUniqueViolation(e)) {
        continue;
      }
      throw e;
    }
  }
  throw new Error("INVITE_CODE_COLLISION");
}

export async function joinCommunityAsEmployeeDb(
  userId: number,
  normalizedCode: string,
): Promise<{ communityId: number }> {
  const existingMember = await db.query.communityMember.findFirst({
    where: eq(communityMember.userId, userId),
  });
  if (existingMember) {
    throw new Error("USER_ALREADY_HAS_COMMUNITY");
  }

  const c = await db.query.community.findFirst({
    where: eq(community.inviteCode, normalizedCode),
    columns: { id: true },
  });
  if (!c) {
    throw new Error("INVALID_INVITE_CODE");
  }

  await db.transaction(async (tx) => {
    await tx.insert(communityMember).values({
      userId,
      communityId: c.id,
      role: "employee",
    });
    await tx.update(user).set({ role: "employee" }).where(eq(user.id, userId));
  });

  return { communityId: c.id };
}
