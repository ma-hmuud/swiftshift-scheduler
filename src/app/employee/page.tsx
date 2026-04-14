import Link from "next/link";
import { redirect } from "next/navigation";

import { buttonVariants } from "~/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getEmployeeDashboardData } from "~/server/api/repositories/dashboard";
import { getSession } from "~/server/better-auth/server";
import { cn } from "~/lib/utils";

export default async function EmployeeHomePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const d = await getEmployeeDashboardData(Number(session.user.id));

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Hello{session.user.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Review published shifts on your calendar and request the ones that fit your availability.
        </p>
        <Link
          href="/employee/calendar"
          className={cn(buttonVariants({ variant: "primary" }), "mt-2 inline-flex w-fit")}
        >
          View shift calendar
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Your requests</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{d.requestsCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Total shift requests you have submitted.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Matching published shifts</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{d.shiftsCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Shifts that match your weekly availability (summary).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
