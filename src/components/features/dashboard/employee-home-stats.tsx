"use client";

import Link from "next/link";

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
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const compactDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeStyle: "short",
});

function formatDateTime(value: Date | string) {
  return dateTimeFormatter.format(new Date(value));
}

function formatDateRange(startTime: string, endTime: string) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return `${compactDateFormatter.format(start)} ${timeFormatter.format(start)} – ${timeFormatter.format(end)}`;
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "approved":
    case "published":
      return "bg-[color-mix(in_srgb,var(--olive-600)_28%,transparent)] text-[color-mix(in_srgb,var(--olive-800)_90%,white)]";
    case "pending":
    case "draft":
      return "bg-[color-mix(in_srgb,var(--walnut-700)_22%,transparent)] text-[var(--walnut-900)]";
    case "rejected":
    case "cancelled":
      return "bg-[color-mix(in_srgb,var(--destructive)_22%,transparent)] text-[color-mix(in_srgb,var(--destructive)_85%,white)]";
    case "filled":
      return "bg-[color-mix(in_srgb,var(--toffee-600)_22%,transparent)] text-[var(--toffee-800)]";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
        getStatusBadgeClass(status),
      )}
    >
      {status}
    </span>
  );
}

export function EmployeeHomeStats() {
  const { data, isLoading, isError, error, refetch } =
    api.employee.dashboard.useQuery(undefined);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="min-h-[200px] w-full rounded-xl" />
      </div>
    );
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

  const { recentRequests } = dashboard;

  return (
    <div className="space-y-8">
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

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg">Recent requests</CardTitle>
            <CardDescription>Your latest shift requests and their status.</CardDescription>
          </div>
          <Link
            href="/employee/calendar"
            className="text-sm font-medium text-primary hover:underline"
          >
            View calendar
          </Link>
        </CardHeader>
        <CardContent>
          {recentRequests.length ? (
            <ul className="grid gap-3">
              {recentRequests.map((request) => (
                <li
                  key={request.id}
                  className="rounded-xl border border-border/80 bg-muted/20 px-4 py-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold leading-tight">{request.shiftTitle}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatDateRange(request.shiftStartTime, request.shiftEndTime)}
                      </p>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                    Requested {formatDateTime(request.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              You have not submitted any shift requests yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
