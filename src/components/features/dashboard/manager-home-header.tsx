import Link from "next/link";

import { buttonVariants } from "~/components/ui/button-variants";
import { cn } from "~/lib/utils";

type ManagerHomeHeaderProps = {
  userName?: string | null;
};

export function ManagerHomeHeader({ userName }: ManagerHomeHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">
        Hello{userName ? `, ${userName}` : ""}
      </h1>
      <p className="max-w-2xl text-sm text-muted-foreground">
        Your calendar is the source of truth for staffing. Start by publishing shifts, then
        triage incoming requests.
      </p>
      <Link
        href="/manager/calendar"
        className={cn(buttonVariants({ variant: "primary" }), "mt-2 inline-flex w-fit")}
      >
        Open calendar
      </Link>
    </div>
  );
}
