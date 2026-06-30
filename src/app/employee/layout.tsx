import { type ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppShellHeader } from "~/components/layout/app-shell-header";
import { EmployeeSidebar } from "~/components/layout/employee-sidebar";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";
import { getCommunityMembership } from "~/server/community/membership";
import { getSession } from "~/server/better-auth/server";

export default async function EmployeeLayout({
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

  if (session.user.role !== "employee") {
    redirect("/manager");
  }

  return (
    <SidebarProvider>
      <EmployeeSidebar
        userName={session.user.name ?? null}
        userRole={session.user.role ?? null}
        userEmail={session.user.email ?? null}
        userImage={session.user.image ?? null}
      />
      <SidebarInset>
        <div className="flex min-h-screen flex-col">
          <AppShellHeader title="Team" />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
