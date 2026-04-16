import { redirect } from "next/navigation";

import { EmployeeHomeHeader } from "~/components/features/dashboard/employee-home-header";
import { EmployeeHomeStats } from "~/components/features/dashboard/employee-home-stats";
import { getSession } from "~/server/better-auth/server";

export default async function EmployeeHomePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <EmployeeHomeHeader userName={session.user.name ?? null} />
      <EmployeeHomeStats />
    </div>
  );
}
