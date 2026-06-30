"use client";

import * as React from "react";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

// value/onChange use the same "YYYY-MM-DDTHH:mm" shape as <input type="datetime-local">
export function DateTimeField({
  id,
  label,
  value,
  onChange,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  const date = value ? new Date(value) : undefined;
  const time = value ? format(date!, "HH:mm:ss") : "00:00:00";

  const combine = (nextDate: Date | undefined, nextTime: string) => {
    if (!nextDate) {
      onChange("");
      return;
    }
    const [h, m, s] = nextTime.split(":").map(Number);
    const combined = new Date(nextDate);
    combined.setHours(h ?? 0, m ?? 0, s ?? 0);
    onChange(format(combined, "yyyy-MM-dd'T'HH:mm"));
  };

  return (
    <div className="grid gap-1.5 text-sm">
      <span className="text-foreground font-medium">{label}</span>
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              id={id}
              className="h-10 flex-1 justify-between rounded-lg font-normal"
            >
              {date ? format(date, "PPP") : "Select date"}
              <ChevronDownIcon className="size-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              defaultMonth={date}
              onSelect={(nextDate: Date | undefined) => {
                combine(nextDate, time);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>

        <Input
          type="time"
          step="1"
          required={required}
          value={time}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            combine(date, e.target.value)
          }
          className="bg-background h-10 w-28 appearance-none rounded-lg [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
