"use client";

import { RefreshCw } from "lucide-react";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export function EmployeeCalendarRefreshButton() {
  const { refetch, fetchStatus } = api.employee.shifts.calendar.useQuery(undefined, {
    retry: false,
  });

  const busy = fetchStatus === "fetching";

  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold shadow-sm hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-60"
      onClick={() => void refetch()}
      disabled={busy}
      aria-busy={busy}
    >
      <RefreshCw className={cn("size-4 shrink-0", busy && "animate-spin")} aria-hidden />
      Refresh
    </button>
  );
}
