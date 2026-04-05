import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import { DashboardSidebar } from "./_components/dashboard-sidebar";
import { getSession } from "~/server/better-auth/server";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
      <DashboardSidebar
        userName={session.user.name ?? null}
        userRole={session.user.role ?? null}
        userEmail={session.user.email ?? null}
        userImage={session.user.image ?? null}
      />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
