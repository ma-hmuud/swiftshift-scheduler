import { type ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppShellHeader } from "~/components/layout/app-shell-header";
import { EmployeeSidebar } from "~/components/layout/employee-sidebar";
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
  if (session.user.role !== "employee") {
    redirect("/manager");
  }

  return (
    <div className="min-h-screen bg-background">
      <EmployeeSidebar
        userName={session.user.name ?? null}
        userRole={session.user.role ?? null}
        userEmail={session.user.email ?? null}
        userImage={session.user.image ?? null}
      />
      <div className="flex min-h-screen flex-col lg:pl-56">
        <AppShellHeader title="Team" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
