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
import { getSession } from "~/server/better-auth/server";
import { api } from "~/trpc/react";
import { EmptyState } from "~/components/ui/empty-state";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";

export default async function ManagerDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { data, isLoading, isError, error, refetch } = api.manager.dashboard.useQuery(undefined);

  if (!data) return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-2">
        <EmptyState title="Data is not loaded yet" description="Please wait while we load your dashboard data." />
      </div>
    </div>
  );

  const { data: dashboard } = data;

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

      {isError ? (
        <>
          <EmptyState title="Error loading data" description={`There was an error loading your dashboard data: ${error.message}`} />
          <Button variant="secondary" onClick={() => void refetch()}>Retry</Button>
        </>
      ) : isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) :
        !dashboard ? (
          <EmptyState title="No data yet" description="No dashboard data available." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Open requests</CardDescription>
                <CardTitle className="text-3xl tabular-nums">{dashboard.requestsCount}</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href="/manager/requests"
                  className="text-sm font-medium text-(--app-primary) hover:underline"
                >
                  Review queue
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Shifts created</CardDescription>
                <CardTitle className="text-3xl tabular-nums">{dashboard.shiftsCount}</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href="/manager/calendar"
                  className="text-sm font-medium text-(--app-primary) hover:underline"
                >
                  View calendar
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Employees</CardDescription>
                <CardTitle className="text-3xl tabular-nums">{dashboard.employeesCount}</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href="/manager/employees"
                  className="text-sm font-medium text-(--app-primary) hover:underline"
                >
                  Directory
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
    </div>
  );
}
