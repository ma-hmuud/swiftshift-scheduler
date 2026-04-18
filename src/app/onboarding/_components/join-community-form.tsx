"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { buttonVariants } from "~/components/ui/button-variants";
import { Spinner } from "~/components/ui/spinner";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export function JoinCommunityForm() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const join = api.community.joinWithInviteCode.useMutation({
    onSuccess: () => {
      router.refresh();
      router.push("/employee");
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length < 3) return;
    join.mutate({ inviteCode: code.trim() });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="invite-code" className="text-sm font-medium text-foreground">
          Invite code
        </label>
        <input
          id="invite-code"
          name="inviteCode"
          autoComplete="off"
          className="mt-2 w-full rounded-xl border border-(--landing-border) bg-card/80 px-4 py-3 font-mono text-base tracking-widest text-foreground uppercase outline-none transition placeholder:text-muted-foreground placeholder:normal-case focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="From your manager"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          minLength={4}
          maxLength={32}
          required
        />
      </div>
      {join.error && (
        <p className="text-sm text-destructive" role="alert">
          {join.error.message}
        </p>
      )}
      <button
        type="submit"
        disabled={join.isPending || code.trim().length < 3}
        className={cn(buttonVariants({ size: "lg" }), "w-full rounded-full sm:w-auto")}
      >
        {join.isPending ? <Spinner /> : "Join community"}
      </button>
    </form>
  );
}
