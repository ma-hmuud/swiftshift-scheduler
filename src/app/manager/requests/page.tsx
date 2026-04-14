"use client";

import { toast } from "sonner";

import { Badge } from "~/components/ui/badge";
import { EmptyState } from "~/components/ui/empty-state";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";

export default function ManagerRequestsPage() {
  const utils = api.useUtils();
  const { data, isLoading, isError, error } =
    api.manager.shiftRequests.listAll.useQuery();

  const reply = api.manager.shiftRequests.reply.useMutation({
    onSuccess: async (_, vars) => {
      toast.success(
        vars.status === "approved" ? "Request approved" : "Request rejected",
      );
      await utils.manager.shiftRequests.listAll.invalidate();
      await utils.manager.shifts.list.invalidate();
    },
    onError: (e) => toast.error(e.message ?? "Could not update request"),
  });

  const rows = data?.data ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Approve or reject shift requests. Capacity is enforced by approved headcount.
        </p>
      </div>

      {isError ? (
        <p className="text-sm text-destructive">{error.message}</p>
      ) : isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No requests yet"
          description="When employees request published shifts, they will appear here with context on timing and capacity."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Window</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="font-medium">{r.employeeName}</div>
                  <div className="text-xs text-muted-foreground">{r.employeeEmail}</div>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <div className="font-medium">{r.shiftTitle}</div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {new Date(r.shiftStartTime).toLocaleString()} →{" "}
                  {new Date(r.shiftEndTime).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      r.status === "approved"
                        ? "approved"
                        : r.status === "pending"
                          ? "pending"
                          : "rejected"
                    }
                  >
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {r.status === "pending" ? (
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="rounded-md border border-border px-2 py-1 text-xs font-semibold hover:bg-muted disabled:opacity-50"
                        disabled={reply.isPending}
                        onClick={() =>
                          reply.mutate({
                            shiftRequestId: r.id,
                            status: "rejected",
                          })
                        }
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        className="rounded-md bg-[var(--app-primary)] px-2 py-1 text-xs font-semibold text-[var(--app-primary-fg)] hover:opacity-90 disabled:opacity-50"
                        disabled={reply.isPending}
                        onClick={() =>
                          reply.mutate({
                            shiftRequestId: r.id,
                            status: "approved",
                          })
                        }
                      >
                        Approve
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
