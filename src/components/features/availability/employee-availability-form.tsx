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
import { Checkbox } from "~/components/ui/checkbox";
import {
  defaultDaysOfWeek,
  normalizeDaysOfWeek,
  WEEKDAY_KEYS,
  WEEKDAY_LABELS,
  type WeekdayKey,
} from "~/lib/schemas/availability";
import { api } from "~/trpc/react";
import { Check, Square } from "lucide-react";

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

  const allSelected = WEEKDAY_KEYS.every((key) => days[key]);
  const toggleAll = () => {
    const newState = { ...days };
    WEEKDAY_KEYS.forEach((key) => {
      newState[key] = !allSelected;
    });
    setDays(newState);
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
        <div className="border-border/80 border-t px-5 py-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => void refetch()}
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div className="space-y-1.5">
            <CardTitle>Weekly availability</CardTitle>
            <CardDescription>
              Choose the days you are generally available for shifts. Your
              manager uses this to match you with open shifts.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={toggleAll}
          >
            {allSelected ? <Check /> : <Square />}
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <fieldset className="space-y-2">
            <legend className="sr-only">Days of the week</legend>
            {WEEKDAY_KEYS.map((key) => (
              <label
                key={key}
                className="border-border bg-card hover:bg-muted/40 flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 text-sm transition-colors"
              >
                <Checkbox
                  checked={days[key]}
                  onCheckedChange={() => toggle(key)}
                />
                <span className="font-medium">{WEEKDAY_LABELS[key]}</span>
              </label>
            ))}
          </fieldset>
        </CardContent>
        <div className="border-border/80 flex flex-wrap gap-2 border-t px-5 py-4">
          <Button type="submit" loading={saving} disabled={saving}>
            {existingId ? "Save changes" : "Save availability"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
