"use client";

import { useState } from "react";

import { buttonVariants } from "~/components/ui/button-variants";
import { cn } from "~/lib/utils";

type ManagerInviteCodeBannerProps = {
  inviteCode: string;
  communityName: string;
};

export function ManagerInviteCodeBanner({
  inviteCode,
  communityName,
}: ManagerInviteCodeBannerProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    void navigator.clipboard.writeText(inviteCode).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="border-b border-border/70 bg-[color-mix(in_srgb,var(--card)_92%,transparent)] px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Invite code · {communityName}
          </p>
          <p className="font-mono text-lg font-semibold tracking-[0.25em] text-foreground sm:text-xl">
            {inviteCode}
          </p>
        </div>
        <button
          type="button"
          onClick={copy}
          className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "shrink-0 self-start sm:self-center")}
        >
          {copied ? "Copied" : "Copy code"}
        </button>
      </div>
    </div>
  );
}
