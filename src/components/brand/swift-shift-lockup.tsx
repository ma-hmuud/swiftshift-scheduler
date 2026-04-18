import Image from "next/image";
import Link from "next/link";

import { cn } from "~/lib/utils";

/** Primary mark — orange SS on light field (`public/logos/dark-logo.jpg`). */
export const PRIMARY_LOGO_SRC = "/logos/dark-logo.jpg";

type SwiftShiftLockupProps = {
  href?: string | null;
  className?: string;
  /** Smaller mark + wordmark for dense headers. */
  compact?: boolean;
  priority?: boolean;
};

/**
 * Brand mark + “Swift Shift” wordmark. Uses the primary logo asset beside the name.
 */
export function SwiftShiftLockup({
  href = "/",
  className,
  compact,
  priority,
}: SwiftShiftLockupProps) {
  const mark = (
    <Image
      src={PRIMARY_LOGO_SRC}
      alt=""
      width={64}
      height={64}
      className={cn(
        "shrink-0 rounded-md object-contain",
        compact ? "size-7" : "size-9 sm:size-10",
      )}
      priority={priority}
      aria-hidden
    />
  );

  const wordmark = (
    <span
      className={cn(
        "font-display font-semibold tracking-tight text-foreground",
        compact ? "text-sm" : "text-lg sm:text-xl",
      )}
    >
      Swift Shift
    </span>
  );

  const row = (
    <>
      {mark}
      {wordmark}
    </>
  );

  if (href === null) {
    return <span className={cn("inline-flex items-center gap-2.5", className)}>{row}</span>;
  }

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-md outline-none transition-opacity hover:opacity-90",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      aria-label="Swift Shift home"
    >
      {row}
    </Link>
  );
}
