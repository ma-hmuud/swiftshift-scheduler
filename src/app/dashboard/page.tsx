import { redirect } from "next/navigation";
import { getSession } from "~/server/better-auth/server";
import {
  EmployeeDashboardPage,
  ManagerDashboardPage,
} from "./_components/dashboard-ui";
import {
  getEmployeeDashboardData,
  getManagerDashboardData,
} from "~/server/api/repositories/dashboard";


async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    return redirect("/login");
  }

  switch (session.user.role) {
    case "manager": {
      const dashboardData = await getManagerDashboardData(Number(session.user.id));

      return (
        <ManagerDashboardPage
          {...dashboardData}
          userName={session.user.name ?? null}
        />
      );
    }
    case "employee": {
      const dashboardData = await getEmployeeDashboardData(Number(session.user.id));

      return (
        <EmployeeDashboardPage
          {...dashboardData}
          userName={session.user.name ?? null}
        />
      );
    }
    default:
      return redirect("/login");
  }
}

export default DashboardPage;