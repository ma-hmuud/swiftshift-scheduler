import Link from "next/link";

import { buttonVariants } from "~/components/ui/button-variants";
import { cn } from "~/lib/utils";

type EmployeeHomeHeaderProps = {
  userName?: string | null;
};

export function EmployeeHomeHeader({ userName }: EmployeeHomeHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">
        Hello{userName ? `, ${userName}` : ""}
      </h1>
      <p className="max-w-2xl text-sm text-muted-foreground">
        Review published shifts on your calendar and request the ones that fit your availability.
      </p>
      <Link
        href="/employee/calendar"
        className={cn(buttonVariants({ variant: "primary" }), "mt-2 inline-flex w-fit")}
      >
        View shift calendar
      </Link>
    </div>
  );
}
