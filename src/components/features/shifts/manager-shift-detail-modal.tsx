"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { DateTimeField } from "~/components/ui/datetime-field";
import { Modal } from "~/components/ui/modal";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import {
  datetimeLocalToIso,
  isoToDatetimeLocalValue,
} from "~/lib/datetime/local-input";
import { api, type RouterOutputs } from "~/trpc/react";

type ManagerShiftRow = NonNullable<
  RouterOutputs["manager"]["shifts"]["list"]["data"]
>[number];

type ManagerShiftDetailModalProps = {
  shift: ManagerShiftRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ManagerShiftDetailModal({
  shift,
  open,
  onOpenChange,
}: ManagerShiftDetailModalProps) {
  const utils = api.useUtils();

  const assignmentsQuery =
    api.manager.shiftRequests.listApprovedForShift.useQuery(
      { shiftId: shift?.id ?? 0 },
      { enabled: open && Boolean(shift?.id) },
    );

  const removeAssignment =
    api.manager.shiftRequests.removeAssignment.useMutation({
      onSuccess: async () => {
        toast.success("Employee removed from shift");
        await Promise.all([
          utils.manager.shifts.list.invalidate(),
          utils.manager.shiftRequests.listApprovedForShift.invalidate(),
          utils.manager.shiftRequests.listAll.invalidate(),
        ]);
      },
      onError: (e) => toast.error(e.message ?? "Could not remove employee"),
    });

  const [title, setTitle] = useState("");
  const [startLocal, setStartLocal] = useState("");
  const [endLocal, setEndLocal] = useState("");
  const [maxEmployees, setMaxEmployees] = useState(1);
  const [status, setStatus] = useState<
    "draft" | "published" | "cancelled" | "filled"
  >("draft");

  useEffect(() => {
    if (!shift) return;
    setTitle(shift.title);
    setStartLocal(isoToDatetimeLocalValue(shift.startTime));
    setEndLocal(isoToDatetimeLocalValue(shift.endTime));
    setMaxEmployees(shift.maxEmployees);
    setStatus(shift.status as typeof status);
  }, [shift]);

  const update = api.manager.shifts.update.useMutation({
    onSuccess: async () => {
      toast.success("Shift updated");
      await utils.manager.shifts.list.invalidate();
      onOpenChange(false);
    },
    onError: (e) => toast.error(e.message ?? "Update failed"),
  });

  const remove = api.manager.shifts.delete.useMutation({
    onSuccess: async () => {
      toast.success("Shift deleted");
      await utils.manager.shifts.list.invalidate();
      onOpenChange(false);
    },
    onError: (e) => toast.error(e.message ?? "Could not delete"),
  });

  if (!shift) return null;

  const booked = shift.bookedCount ?? 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const startTime = datetimeLocalToIso(startLocal);
    const endTime = datetimeLocalToIso(endLocal);
    if (new Date(endTime) <= new Date(startTime)) {
      toast.error("End time must be after start");
      return;
    }
    update.mutate({
      id: shift.id,
      title: title.trim(),
      startTime,
      endTime,
      maxEmployees,
      status,
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={shift.title}
      description={`${booked}/${shift.maxEmployees} approved · ${shift.status}`}
      size="lg"
      footer={
        <>
          <Button
            type="button"
            variant="danger"
            loading={remove.isPending}
            onClick={() => remove.mutate({ shiftId: shift.id })}
          >
            Delete
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type="submit"
            form="edit-shift-form"
            loading={update.isPending}
          >
            Save changes
          </Button>
        </>
      }
    >
      <form id="edit-shift-form" className="grid gap-4" onSubmit={handleSave}>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={
              shift.status === "published"
                ? "approved"
                : shift.status === "draft"
                  ? "pending"
                  : "neutral"
            }
          >
            {shift.status}
          </Badge>
          <span className="text-muted-foreground text-sm">
            Manager · {shift.managerName}
          </span>
        </div>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-input bg-background focus-visible:ring-ring h-10 rounded-lg border px-3 text-sm outline-none focus-visible:ring-2"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <DateTimeField
            id="start"
            label="Start"
            value={startLocal}
            onChange={setStartLocal}
          />
          <DateTimeField
            id="end"
            label="End"
            value={endLocal}
            onChange={setEndLocal}
          />
        </div>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Capacity</span>
          <input
            type="number"
            min={1}
            value={maxEmployees}
            onChange={(e) => setMaxEmployees(Number(e.target.value))}
            className="border-input bg-background h-10 rounded-lg border px-3 text-sm"
          />
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Status</span>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as typeof status)}
          >
            <SelectTrigger className="h-10 rounded-lg">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="filled">Filled</SelectItem>
            </SelectContent>
          </Select>
        </label>

        <div className="border-border bg-muted/30 rounded-xl border p-4">
          <h3 className="text-foreground text-sm font-semibold">
            Assigned employees
          </h3>
          <p className="text-muted-foreground mt-1 text-xs">
            Approved coverage for this shift. Removing someone frees a seat and
            removes their booking.
          </p>
          {assignmentsQuery.isLoading ? (
            <p className="text-muted-foreground mt-3 text-sm">Loading…</p>
          ) : assignmentsQuery.isError ? (
            <p className="text-destructive mt-3 text-sm">
              Could not load assignments.
            </p>
          ) : (assignmentsQuery.data?.data?.length ?? 0) === 0 ? (
            <p className="text-muted-foreground mt-3 text-sm">
              No approved employees yet.
            </p>
          ) : (
            <ul className="divide-border border-border bg-background mt-3 divide-y rounded-lg border">
              {(assignmentsQuery.data?.data ?? []).map((row) => (
                <li
                  key={row.requestId}
                  className="flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-foreground truncate text-sm font-medium">
                      {row.employeeName}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {row.employeeEmail}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    loading={removeAssignment.isPending}
                    disabled={removeAssignment.isPending}
                    onClick={() =>
                      removeAssignment.mutate({
                        requestId: row.requestId,
                      })
                    }
                  >
                    Remove from shift
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
    </Modal>
  );
}
