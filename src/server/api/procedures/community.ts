import { TRPCError } from "@trpc/server";
import z from "zod";

import { normalizeInviteCode } from "~/lib/community/invite-code";
import {
  createCommunityAsManagerDb,
  joinCommunityAsEmployeeDb,
} from "~/server/api/repositories/community";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const communityRouter = createTRPCRouter({
  createManagerCommunity: protectedProcedure
    .input(z.object({ name: z.string().trim().min(2).max(80) }))
    .mutation(async ({ ctx, input }) => {
      const userId = Number(ctx.session.user.id);
      try {
        const row = await createCommunityAsManagerDb(userId, input.name);
        return { ok: true as const, data: row };
      } catch (e) {
        const msg = (e as Error).message;
        if (msg === "USER_ALREADY_HAS_COMMUNITY") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You already belong to a community.",
          });
        }
        if (msg === "INVITE_CODE_COLLISION") {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not generate a unique invite code. Try again.",
          });
        }
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create community.",
        });
      }
    }),

  joinWithInviteCode: protectedProcedure
    .input(z.object({ inviteCode: z.string().min(3).max(32) }))
    .mutation(async ({ ctx, input }) => {
      const userId = Number(ctx.session.user.id);
      const code = normalizeInviteCode(input.inviteCode);
      if (code.length < 4) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Enter a valid invite code.",
        });
      }
      try {
        const row = await joinCommunityAsEmployeeDb(userId, code);
        return { ok: true as const, data: row };
      } catch (e) {
        const msg = (e as Error).message;
        if (msg === "USER_ALREADY_HAS_COMMUNITY") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You already belong to a community.",
          });
        }
        if (msg === "INVALID_INVITE_CODE") {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No community matches this invite code.",
          });
        }
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not join community.",
        });
      }
    }),
});
