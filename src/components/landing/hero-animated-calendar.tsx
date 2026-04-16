"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import {
  buildCalendarGrid,
  DEMO_SHIFTS_BY_DAY,
  type DemoDept,
} from "~/lib/landing/demo-calendar";
import { cn } from "~/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const DEPT_META: Record<DemoDept, { name: string; stripe: string }> = {
  field: { name: "Field", stripe: "var(--dept-field)" },
  floor: { name: "Floor", stripe: "var(--dept-floor)" },
  kitchen: { name: "Kitchen", stripe: "var(--dept-kitchen)" },
  routing: { name: "Routing", stripe: "var(--dept-routing)" },
};

export function HeroAnimatedCalendar() {
  const initial = useMemo(() => {
    const n = new Date();
    return { y: n.getFullYear(), m: n.getMonth() };
  }, []);

  const [cursor, setCursor] = useState(initial);
  const [transition, setTransition] = useState(0);

  const grid = useMemo(
    () => buildCalendarGrid(cursor.y, cursor.m),
    [cursor.y, cursor.m],
  );

  const title = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(new Date(cursor.y, cursor.m, 1)),
    [cursor.y, cursor.m],
  );

  const bump = useCallback((delta: number) => {
    setTransition((t) => t + 1);
    setCursor((c) => {
      const d = new Date(c.y, c.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  }, []);

  const today = useMemo(() => new Date(), []);
  const isToday = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  return (
    <div className="landing-calendar-shell relative overflow-hidden rounded-[1.25rem] border border-(--landing-border) bg-[color-mix(in_srgb,var(--card)_88%,transparent)] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-6">
      <div
        className="pointer-events-none absolute -inset-px rounded-[1.25rem] opacity-90"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -20%, color-mix(in srgb, var(--glow-warm) 35%, transparent), transparent 55%)",
        }}
      />
      <div className="relative z-1 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Live coverage preview — sample shifts for the landing demo
            </p>
          </div>
          <div className="flex gap-1 rounded-xl border border-(--landing-border) bg-muted/40 p-0.5">
            <button
              type="button"
              onClick={() => bump(-1)}
              className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => bump(1)}
              className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Next month"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div
          className="grid grid-cols-7 gap-1.5 sm:gap-2"
          key={`${cursor.y}-${cursor.m}-${transition}`}
        >
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="pb-1 text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs"
            >
              {w}
            </div>
          ))}
          {grid.map((cell, i) => {
            const dayNum = cell.date.getDate();
            const shifts = cell.inMonth ? (DEMO_SHIFTS_BY_DAY[dayNum] ?? []) : [];
            const maxShow = 2;
            const shown = shifts.slice(0, maxShow);
            const overflow = shifts.length - shown.length;
            const todayCell = cell.inMonth && isToday(cell.date);

            return (
              <div
                key={`${cell.date.toISOString()}-${i}`}
                className={cn(
                  "landing-cal-cell flex min-h-18 flex-col gap-1 rounded-xl border p-1.5 transition-[transform,box-shadow,border-color] duration-300 sm:min-h-22 sm:p-2",
                  cell.inMonth
                    ? "border-(--landing-border) bg-[color-mix(in_srgb,var(--muted)_40%,transparent)]"
                    : "border-transparent bg-transparent opacity-40",
                  todayCell &&
                    "border-[color-mix(in_srgb,var(--primary)_55%,var(--landing-border))] shadow-[0_0_0_1px_color-mix(in_srgb,var(--primary)_45%,transparent),0_0_28px_color-mix(in_srgb,var(--glow-warm)_35%,transparent)]",
                )}
                style={{
                  animation: `cellReveal 0.55s ease backwards`,
                  animationDelay: `${Math.min(i, 20) * 28}ms`,
                }}
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={cn(
                      "inline-flex size-7 items-center justify-center rounded-full text-xs font-semibold tabular-nums sm:size-8 sm:text-sm",
                      todayCell
                        ? "bg-primary text-primary-foreground shadow-[0_0_20px_color-mix(in_srgb,var(--primary)_45%,transparent)]"
                        : "text-foreground/90",
                    )}
                  >
                    {dayNum}
                  </span>
                </div>
                <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden">
                  {shown.map((s) => (
                    <div
                      key={s.id}
                      className="flex min-w-0 items-stretch gap-0 overflow-hidden rounded-md border border-(--landing-border) bg-[color-mix(in_srgb,var(--card)_70%,black)] text-[0.6rem] font-medium leading-tight text-[color-mix(in_srgb,var(--foreground)_88%,var(--muted-foreground))] sm:text-[0.65rem]"
                    >
                      <span
                        className="w-0.5 shrink-0"
                        style={{ background: DEPT_META[s.dept].stripe }}
                        aria-hidden
                      />
                      <span className="truncate px-1 py-0.5">{s.label}</span>
                    </div>
                  ))}
                  {overflow > 0 ? (
                    <p className="text-[0.6rem] text-muted-foreground">+{overflow} more</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-(--landing-border) pt-4">
          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Legend
          </span>
          {(Object.keys(DEPT_META) as DemoDept[]).map((k) => (
            <span key={k} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className="size-2.5 rounded-sm shadow-[0_0_12px_color-mix(in_srgb,var(--glow-warm)_25%,transparent)]"
                style={{ background: DEPT_META[k].stripe }}
              />
              {DEPT_META[k].name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
