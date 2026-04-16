"use client";

import type { EventClickArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { buttonVariants } from "~/components/ui/button-variants";
import { Modal } from "~/components/ui/modal";
import { Skeleton } from "~/components/ui/skeleton";
import { employeeShiftColors } from "~/lib/calendar/shift-visuals";
import { cn } from "~/lib/utils";
import { api, type RouterOutputs } from "~/trpc/react";

type EmployeeCalendarData = RouterOutputs["employee"]["shifts"]["calendar"];

const FullCalendar = dynamic(
  () => import("@fullcalendar/react").then((m) => m.default),
  { ssr: false, loading: () => <Skeleton className="h-[min(70vh,720px)] w-full rounded-xl" /> },
);

type EmployeeShiftRow = NonNullable<
  RouterOutputs["employee"]["shifts"]["calendar"]["data"]
>[number];

export function EmployeeCalendar() {
  const utils = api.useUtils();
  const { data, isLoading, isError, error, refetch } =
    api.employee.shifts.calendar.useQuery(undefined, {
      retry: false,
    });

  const [detail, setDetail] = useState<EmployeeShiftRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const requestShift = api.employee.shiftRequests.send.useMutation({
    onMutate: async (vars) => {
      await utils.employee.shifts.calendar.cancel();
      const prev = utils.employee.shifts.calendar.getData(undefined);
      utils.employee.shifts.calendar.setData(undefined, (old: EmployeeCalendarData | undefined) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((s) =>
            s.id === vars.shiftId ? { ...s, myRequestStatus: "pending" } : s,
          ),
        };
      });
      return { prev };
    },
    onSuccess: async () => {
      toast.success("Request sent");
      setDetailOpen(false);
      setDetail(null);
      await utils.employee.shifts.calendar.invalidate();
    },
    onError: (e, _vars, ctx: { prev?: EmployeeCalendarData } | undefined) => {
      if (ctx?.prev) {
        utils.employee.shifts.calendar.setData(undefined, ctx.prev);
      }
      toast.error(e.message ?? "Could not request shift");
      void utils.employee.shifts.calendar.invalidate();
    },
  });

  const rows = useMemo(() => data?.data ?? [], [data?.data]);
  const shiftById = useMemo(() => {
    const m = new Map<number, EmployeeShiftRow>();
    for (const r of rows) m.set(r.id, r);
    return m;
  }, [rows]);

  const events: EventInput[] = useMemo(
    () =>
      rows.map((s) => {
        const colors = employeeShiftColors({
          booked: s.bookedCount,
          capacity: s.maxEmployees,
          myRequestStatus: s.myRequestStatus,
        });
        return {
          id: String(s.id),
          title: `${s.title} · ${s.bookedCount}/${s.maxEmployees}`,
          start: s.startTime,
          end: s.endTime,
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          extendedProps: { rawTitle: s.title },
        };
      }),
    [rows],
  );

  const onEventClick = useCallback(
    (arg: EventClickArg) => {
      const id = Number(arg.event.id);
      const row = shiftById.get(id);
      if (!row) return;
      setDetail(row);
      setDetailOpen(true);
    },
    [shiftById],
  );

  if (isError) {
    const msg = error.message ?? "";
    const needsAvailability = msg.includes("availability");
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-8 text-center">
        <p className="font-semibold text-foreground">
          {needsAvailability
            ? "Set your availability to see shifts"
            : "Could not load calendar"}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {needsAvailability
            ? "Your manager uses weekly availability to match you with open shifts. Choose the days you can work on the availability page, then come back here."
            : msg}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {needsAvailability ? (
            <Link
              href="/employee/availability"
              className={cn(buttonVariants({ variant: "primary", size: "md" }))}
            >
              Set availability
            </Link>
          ) : null}
          <Button type="button" variant="secondary" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const canRequest = (row: EmployeeShiftRow) =>
    row.bookedCount < row.maxEmployees &&
    (row.myRequestStatus === null || row.myRequestStatus === "rejected");

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card p-2 shadow-sm">
        {isLoading ? (
          <Skeleton className="h-[min(70vh,720px)] w-full rounded-lg" />
        ) : (
          <FullCalendar
            plugins={[timeGridPlugin, dayGridPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height="auto"
            contentHeight={640}
            nowIndicator
            selectable={false}
            editable={false}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={false}
            events={events}
            eventClick={onEventClick}
            eventDidMount={(info) => {
              const row = shiftById.get(Number(info.event.id));
              info.el.title = `${row?.title ?? ""}\n${row?.bookedCount ?? 0}/${row?.maxEmployees ?? 0} filled`;
            }}
          />
        )}
      </div>

      <Modal
        open={detailOpen}
        onOpenChange={(o) => {
          setDetailOpen(o);
          if (!o) setDetail(null);
        }}
        title={detail?.title ?? "Shift"}
        description={
          detail
            ? `${detail.managerName} · ${detail.bookedCount}/${detail.maxEmployees} filled`
            : undefined
        }
        footer={
          detail ? (
            <>
              <Button type="button" variant="secondary" onClick={() => setDetailOpen(false)}>
                Close
              </Button>
              {canRequest(detail) ? (
                <Button
                  type="button"
                  loading={requestShift.isPending}
                  disabled={requestShift.isPending}
                  onClick={() => requestShift.mutate({ shiftId: detail.id })}
                >
                  Request this shift
                </Button>
              ) : detail.myRequestStatus === "pending" ? (
                <Button type="button" variant="secondary" disabled>
                  Request pending
                </Button>
              ) : detail.myRequestStatus === "approved" ? (
                <Button type="button" variant="secondary" disabled>
                  Approved
                </Button>
              ) : (
                <Button type="button" variant="secondary" disabled>
                  Shift full
                </Button>
              )}
            </>
          ) : null
        }
      >
        {detail ? (
          <dl className="grid gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Starts</dt>
              <dd className="font-medium">{new Date(detail.startTime).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Ends</dt>
              <dd className="font-medium">{new Date(detail.endTime).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Your request</dt>
              <dd className="font-medium capitalize">
                {detail.myRequestStatus ?? "None"}
              </dd>
            </div>
          </dl>
        ) : null}
      </Modal>
    </div>
  );
}
