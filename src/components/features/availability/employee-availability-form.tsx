"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import {
  defaultDaysOfWeek,
  normalizeDaysOfWeek,
  WEEKDAY_KEYS,
  WEEKDAY_LABELS,
  type WeekdayKey,
} from "~/lib/schemas/availability";
import { api } from "~/trpc/react";

export function EmployeeAvailabilityForm() {
  const utils = api.useUtils();
  const { data, isLoading, isError, error, refetch } =
    api.employee.availabilities.list.useQuery();

  const [days, setDays] = useState(defaultDaysOfWeek);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (isLoading || hydrated) return;
    const row = data?.data;
    if (row?.daysOfWeek) {
      setDays(normalizeDaysOfWeek(row.daysOfWeek));
    } else {
      setDays(defaultDaysOfWeek());
    }
    setHydrated(true);
  }, [isLoading, data, hydrated]);

  const create = api.employee.availabilities.create.useMutation({
    onSuccess: async () => {
      toast.success("Availability saved");
      await utils.employee.availabilities.list.invalidate();
      await utils.employee.shifts.calendar.invalidate();
    },
    onError: (e) => {
      toast.error(e.message ?? "Could not save availability");
    },
  });

  const update = api.employee.availabilities.update.useMutation({
    onSuccess: async () => {
      toast.success("Availability updated");
      await utils.employee.availabilities.list.invalidate();
      await utils.employee.shifts.calendar.invalidate();
    },
    onError: (e) => {
      toast.error(e.message ?? "Could not update availability");
    },
  });

  const saving = create.isPending || update.isPending;
  const existingId = data?.data?.id;

  const toggle = (key: WeekdayKey) => {
    setDays((d) => ({ ...d, [key]: !d[key] }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingId) {
      update.mutate({ id: existingId, daysOfWeek: days });
    } else {
      create.mutate({ daysOfWeek: days });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-full max-w-md" />
        </CardHeader>
        <CardContent className="space-y-3">
          {WEEKDAY_KEYS.map((k) => (
            <Skeleton key={k} className="h-12 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Could not load availability</CardTitle>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
        <div className="border-t border-border/80 px-5 py-4">
          <Button type="button" variant="secondary" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Weekly availability</CardTitle>
          <CardDescription>
            Choose the days you are generally available for shifts. Your manager uses this to
            match you with open shifts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <fieldset className="space-y-2">
            <legend className="sr-only">Days of the week</legend>
            {WEEKDAY_KEYS.map((key) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-3 py-3 text-sm transition-colors hover:bg-muted/40"
              >
                <input
                  type="checkbox"
                  className="size-4 rounded border-border text-(--app-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  checked={days[key]}
                  onChange={() => toggle(key)}
                />
                <span className="font-medium">{WEEKDAY_LABELS[key]}</span>
              </label>
            ))}
          </fieldset>
        </CardContent>
        <div className="flex flex-wrap gap-2 border-t border-border/80 px-5 py-4">
          <Button type="submit" loading={saving} disabled={saving}>
            {existingId ? "Save changes" : "Save availability"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
