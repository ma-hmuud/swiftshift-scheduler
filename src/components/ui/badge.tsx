import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";

import { cn } from "~/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
  {
    variants: {
      variant: {
        approved:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        pending:
          "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200",
        rejected:
          "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-200",
        neutral: "border-border bg-muted text-muted-foreground",
        info: "border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-200",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
