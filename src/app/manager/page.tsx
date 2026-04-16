import { redirect } from "next/navigation";

import { ManagerHomeHeader } from "~/components/features/dashboard/manager-home-header";
import { ManagerHomeStats } from "~/components/features/dashboard/manager-home-stats";
import { getSession } from "~/server/better-auth/server";

export default async function ManagerDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <ManagerHomeHeader userName={session.user.name ?? null} />
      <ManagerHomeStats />
    </div>
  );
}
