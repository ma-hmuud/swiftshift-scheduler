import { type ReactNode } from "react";
import { redirect } from "next/navigation";

import { ManagerInviteCodeBanner } from "~/components/features/dashboard/manager-invite-code-banner";
import { AppShellHeader } from "~/components/layout/app-shell-header";
import { ManagerSidebar } from "~/components/layout/manager-sidebar";
import { getCommunityMembership } from "~/server/community/membership";
import { getSession } from "~/server/better-auth/server";

export default async function ManagerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const membership = await getCommunityMembership(Number(session.user.id));
  if (!membership) {
    redirect("/onboarding");
  }

  if (session.user.role !== "manager") {
    redirect("/employee");
  }

  return (
    <div className="min-h-screen bg-background">
      <ManagerSidebar
        userName={session.user.name ?? null}
        userRole={session.user.role ?? null}
        userEmail={session.user.email ?? null}
        userImage={session.user.image ?? null}
      />
      <div className="flex min-h-screen flex-col lg:pl-60">
        <AppShellHeader title="Manager" />
        <ManagerInviteCodeBanner
          inviteCode={membership.inviteCode}
          communityName={membership.communityName}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
