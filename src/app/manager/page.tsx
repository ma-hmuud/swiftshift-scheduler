import Link from "next/link";

import { cn } from "~/lib/utils";
import { redirect } from "next/navigation";

import { buttonVariants } from "~/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getManagerDashboardData } from "~/server/api/repositories/dashboard";
import { getSession } from "~/server/better-auth/server";

export default async function ManagerDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const d = await getManagerDashboardData(Number(session.user.id));

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome{session.user.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Your calendar is the source of truth for staffing. Start by publishing shifts, then
          triage incoming requests.
        </p>
        <Link
          href="/manager/calendar"
          className={cn(buttonVariants({ variant: "primary" }), "mt-2 inline-flex w-fit")}
        >
          Open calendar
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Open requests</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{d.requestsCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/manager/requests"
              className="text-sm font-medium text-[var(--app-primary)] hover:underline"
            >
              Review queue
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Shifts created</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{d.shiftsCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/manager/calendar"
              className="text-sm font-medium text-[var(--app-primary)] hover:underline"
            >
              View calendar
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Employees</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{d.employeesCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/manager/employees"
              className="text-sm font-medium text-[var(--app-primary)] hover:underline"
            >
              Directory
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
