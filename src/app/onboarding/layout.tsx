import { type ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCommunityMembership } from "~/server/community/membership";
import { getSession } from "~/server/better-auth/server";

export default async function OnboardingLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const membership = await getCommunityMembership(Number(session.user.id));
  if (membership) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="landing-page flex min-h-screen flex-col">
        <div className="landing-mesh" aria-hidden />
        <div className="relative z-1 flex flex-1 flex-col">{children}</div>
      </main>
    </div>
  );
}
