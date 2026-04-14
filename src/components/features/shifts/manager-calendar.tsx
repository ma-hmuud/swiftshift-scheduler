"use client";

import type {
  DateSelectArg,
  EventClickArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { Skeleton } from "~/components/ui/skeleton";
import { managerCapacityColors } from "~/lib/calendar/shift-visuals";
import { api, type RouterOutputs } from "~/trpc/react";

import { CreateShiftModal } from "./create-shift-modal";
import { ManagerShiftDetailModal } from "./manager-shift-detail-modal";

const FullCalendar = dynamic(
  () => import("@fullcalendar/react").then((m) => m.default),
  { ssr: false, loading: () => <Skeleton className="h-[min(70vh,720px)] w-full rounded-xl" /> },
);

type ManagerShiftRow = NonNullable<
  RouterOutputs["manager"]["shifts"]["list"]["data"]
>[number];

export function ManagerCalendar() {
  const utils = api.useUtils();
  const { data, isLoading, isError, error } = api.manager.shifts.list.useQuery();

  const [createOpen, setCreateOpen] = useState(false);
  const [createRange, setCreateRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [detailShift, setDetailShift] = useState<ManagerShiftRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const updateTimes = api.manager.shifts.update.useMutation({
    onMutate: async () => {
      await utils.manager.shifts.list.cancel();
    },
    onSuccess: async () => {
      toast.success("Shift updated");
      await utils.manager.shifts.list.invalidate();
    },
    onError: (e) => {
      toast.error(e.message ?? "Could not move shift");
      void utils.manager.shifts.list.invalidate();
    },
  });

  const shifts = useMemo(() => data?.data ?? [], [data?.data]);

  const shiftById = useMemo(() => {
    const m = new Map<number, ManagerShiftRow>();
    for (const s of shifts) m.set(s.id, s);
    return m;
  }, [shifts]);

  const events: EventInput[] = useMemo(
    () =>
      shifts.map((s) => {
        const booked = s.bookedCount ?? 0;
        const colors = managerCapacityColors(booked, s.maxEmployees);
        const label = `${s.title} · ${booked}/${s.maxEmployees}`;
        return {
          id: String(s.id),
          title: label,
          start: s.startTime,
          end: s.endTime,
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          extendedProps: {
            status: s.status,
            rawTitle: s.title,
          },
        };
      }),
    [shifts],
  );

  const openCreateWithRange = useCallback((start: Date, end: Date) => {
    setCreateRange({ start, end });
    setCreateOpen(true);
  }, []);

  const onSelect = useCallback(
    (arg: DateSelectArg) => {
      openCreateWithRange(arg.start, arg.end);
      arg.view.calendar.unselect();
    },
    [openCreateWithRange],
  );

  const onDateClick = useCallback(
    (info: { date: Date; allDay: boolean }) => {
      if (info.allDay) return;
      const start = info.date;
      const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
      openCreateWithRange(start, end);
    },
    [openCreateWithRange],
  );

  const onEventClick = useCallback((arg: EventClickArg) => {
    const id = Number(arg.event.id);
    const row = shiftById.get(id);
    if (!row) return;
    setDetailShift(row);
    setDetailOpen(true);
  }, [shiftById]);

  const onEventDrop = useCallback(
    (arg: EventDropArg) => {
      const id = Number(arg.event.id);
      const row = shiftById.get(id);
      const start = arg.event.start;
      const end = arg.event.end;
      if (!row || !start || !end) return;
      updateTimes.mutate({
        id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });
    },
    [shiftById, updateTimes],
  );

  const onEventResize = useCallback(
    (arg: { event: { id: string; start?: Date | null; end?: Date | null } }) => {
      const id = Number(arg.event.id);
      const row = shiftById.get(id);
      const start = arg.event.start;
      const end = arg.event.end;
      if (!row || !start || !end) return;
      updateTimes.mutate({
        id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });
    },
    [shiftById, updateTimes],
  );

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
        {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Drag on the grid to create · Drag events to reschedule · Pull handles to adjust duration
        </p>
        <button
          type="button"
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold shadow-sm hover:bg-muted/60"
          onClick={() => {
            const start = new Date();
            start.setMinutes(0, 0, 0);
            const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
            openCreateWithRange(start, end);
          }}
        >
          New shift
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card p-2 shadow-sm">
        {isLoading ? (
          <Skeleton className="h-[min(70vh,720px)] w-full rounded-lg" />
        ) : (
          <FullCalendar
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height="auto"
            contentHeight={640}
            nowIndicator
            selectable
            selectMirror
            editable
            eventStartEditable
            eventDurationEditable
            snapDuration="00:15:00"
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={false}
            events={events}
            select={onSelect}
            dateClick={onDateClick}
            eventClick={onEventClick}
            eventDrop={onEventDrop}
            eventResize={onEventResize}
            eventDidMount={(info) => {
              const booked = shiftById.get(Number(info.event.id))?.bookedCount ?? 0;
              const cap = shiftById.get(Number(info.event.id))?.maxEmployees ?? 0;
              info.el.title = `${info.event.extendedProps.rawTitle ?? info.event.title}\n${booked}/${cap} approved`;
            }}
          />
        )}
      </div>

      <CreateShiftModal
        open={createOpen}
        onOpenChange={(o) => {
          setCreateOpen(o);
          if (!o) setCreateRange(null);
        }}
        initialRange={createRange}
      />

      <ManagerShiftDetailModal
        shift={detailShift}
        open={detailOpen}
        onOpenChange={(o) => {
          setDetailOpen(o);
          if (!o) setDetailShift(null);
        }}
      />
    </div>
  );
}
