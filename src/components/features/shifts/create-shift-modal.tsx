"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Modal } from "~/components/ui/modal";
import { datetimeLocalToIso, isoToDatetimeLocalValue } from "~/lib/datetime/local-input";
import { api } from "~/trpc/react";

type CreateShiftModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set (e.g. from calendar select), seeds the form. */
  initialRange?: { start: Date; end: Date } | null;
};

export function CreateShiftModal({
  open,
  onOpenChange,
  initialRange,
}: CreateShiftModalProps) {
  const utils = api.useUtils();

  const [title, setTitle] = useState("");
  const [maxEmployees, setMaxEmployees] = useState(5);
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [startLocal, setStartLocal] = useState("");
  const [endLocal, setEndLocal] = useState("");

  useEffect(() => {
    if (!open) return;
    if (initialRange) {
      setStartLocal(isoToDatetimeLocalValue(initialRange.start.toISOString()));
      setEndLocal(isoToDatetimeLocalValue(initialRange.end.toISOString()));
      return;
    }
    const start = new Date();
    start.setMinutes(0, 0, 0);
    const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
    setStartLocal(isoToDatetimeLocalValue(start.toISOString()));
    setEndLocal(isoToDatetimeLocalValue(end.toISOString()));
  }, [open, initialRange]);

  const create = api.manager.shifts.create.useMutation({
    onSuccess: async () => {
      toast.success("Shift created");
      onOpenChange(false);
      setTitle("");
      await utils.manager.shifts.list.invalidate();
    },
    onError: (err) => {
      toast.error(err.message ?? "Could not create shift");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Add a title for this shift");
      return;
    }
    const startTime = datetimeLocalToIso(startLocal);
    const endTime = datetimeLocalToIso(endLocal);
    if (new Date(endTime) <= new Date(startTime)) {
      toast.error("End time must be after start time");
      return;
    }
    create.mutate({
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
      onOpenChange={(next) => {
        if (!next) {
          setTitle("");
        }
        onOpenChange(next);
      }}
      title="Create shift"
      description="Add a titled block to the calendar. Employees only see published shifts that match their availability."
      size="lg"
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="create-shift-form" loading={create.isPending}>
            Create shift
          </Button>
        </>
      }
    >
      <form id="create-shift-form" className="grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-foreground">Title</span>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Opening shift, Floor coverage…"
            autoComplete="off"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium text-foreground">Start</span>
            <input
              type="datetime-local"
              required
              value={startLocal}
              onChange={(e) => setStartLocal(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium text-foreground">End</span>
            <input
              type="datetime-local"
              required
              value={endLocal}
              onChange={(e) => setEndLocal(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
        </div>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-foreground">Capacity</span>
          <input
            type="number"
            min={1}
            required
            value={maxEmployees}
            onChange={(e) => setMaxEmployees(Number(e.target.value))}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-foreground">Visibility</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="published">Published (visible to matching employees)</option>
            <option value="draft">Draft (only you)</option>
          </select>
        </label>
      </form>
    </Modal>
  );
}
