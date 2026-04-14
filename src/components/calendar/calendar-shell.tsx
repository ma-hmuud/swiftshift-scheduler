import { type ReactNode } from "react";

import { cn } from "~/lib/utils";

import { CalendarLegend } from "./calendar-legend";

type CalendarShellProps = {
  title?: string;
  description?: string;
  legend?: { label: string; className: string }[];
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function CalendarShell({
  title,
  description,
  legend,
  toolbar,
  children,
  className,
}: CalendarShellProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title ?? description ?? toolbar) ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            {title ? (
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {title}
              </h1>
            ) : null}
            {description ? (
              <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
            ) : null}
            {legend?.length ? <CalendarLegend items={legend} /> : null}
          </div>
          {toolbar ? <div className="flex shrink-0 flex-wrap gap-2">{toolbar}</div> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}
