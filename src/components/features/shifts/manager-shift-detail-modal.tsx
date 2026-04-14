"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Modal } from "~/components/ui/modal";
import { datetimeLocalToIso, isoToDatetimeLocalValue } from "~/lib/datetime/local-input";
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
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button type="submit" form="edit-shift-form" loading={update.isPending}>
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
          <span className="text-sm text-muted-foreground">
            Manager · {shift.managerName}
          </span>
        </div>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Start</span>
            <input
              type="datetime-local"
              value={startLocal}
              onChange={(e) => setStartLocal(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">End</span>
            <input
              type="datetime-local"
              value={endLocal}
              onChange={(e) => setEndLocal(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
            />
          </label>
        </div>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Capacity</span>
          <input
            type="number"
            min={1}
            value={maxEmployees}
            onChange={(e) => setMaxEmployees(Number(e.target.value))}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
          />
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Status</span>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as typeof status)
            }
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>
            <option value="filled">Filled</option>
          </select>
        </label>
      </form>
    </Modal>
  );
}
