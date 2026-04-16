"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { EmptyState } from "~/components/ui/empty-state";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export function EmployeeHomeStats() {
  const { data, isLoading, isError, error, refetch } =
    api.employee.dashboard.useQuery(undefined);

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-xl" />;
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <EmptyState
          title="Could not load dashboard"
          description={error.message ?? "Something went wrong while loading your data."}
        />
        <Button type="button" variant="secondary" onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const dashboard = data?.data;
  if (!dashboard) {
    return (
      <EmptyState
        title="Could not load dashboard"
        description="No dashboard data was returned."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Your requests</CardDescription>
          <CardTitle className="text-3xl tabular-nums">{dashboard.requestsCount}</CardTitle>
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
          <CardTitle className="text-3xl tabular-nums">{dashboard.shiftsCount}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Published shifts that still lie ahead and match your weekly availability (summary).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
