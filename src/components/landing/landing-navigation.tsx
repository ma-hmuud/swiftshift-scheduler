"use client";

import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";

import { SwiftShiftLockup } from "~/components/brand/swift-shift-lockup";
import { LandingUserMenu } from "~/components/landing/landing-user-menu";
import { buttonVariants } from "~/components/ui/button-variants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

const LINKS = [
  { href: "#product", label: "Product" },
  { href: "#network", label: "Workflow" },
  { href: "#stories", label: "Stories" },
  { href: "#footer", label: "Contact" },
];

type LandingNavigationProps = {
  signedIn: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
};

export function LandingNavigation({ signedIn, user }: LandingNavigationProps) {
  return (
    <header
      className={cn(
        "landing-nav",
        "fixed z-50 mx-auto max-w-6xl max-sm:px-2! max-sm:py-2!",
        "left-3 right-3 top-[max(0.75rem,env(safe-area-inset-top))] w-auto sm:left-4 sm:right-4 sm:top-[max(1rem,env(safe-area-inset-top))]",
        "flex items-center justify-between gap-2 sm:gap-3 md:gap-4",
      )}
    >
      <SwiftShiftLockup
        href="/"
        priority
        className={cn(
          "min-w-0 shrink",
          "max-sm:[&_img]:size-8 max-sm:[&_span]:text-base max-sm:gap-2",
        )}
      />

      <nav
        className="hidden flex-1 justify-center sm:flex"
        aria-label="Primary"
      >
        <ul className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-(--landing-border) bg-[color-mix(in_srgb,var(--card)_75%,transparent)] px-1.5 py-1 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="inline-block rounded-full px-3 py-1.5 text-muted-foreground transition hover:bg-muted/80 hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            type="button"
            className={cn(
              "flex sm:hidden items-center gap-1.5 rounded-full border border-(--landing-border)",
              "bg-[color-mix(in_srgb,var(--card)_75%,transparent)] px-2.5 py-2 text-sm font-medium text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md",
              "outline-none transition hover:bg-muted/80 hover:text-foreground",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
            aria-label="Page sections"
          >
            <Menu className="size-4 shrink-0 opacity-90" aria-hidden />
            <span className="max-[380px]:sr-only">Sections</span>
            <ChevronDown className="size-3.5 shrink-0 opacity-70" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="z-100 min-w-48 border-(--landing-border) bg-popover/95 p-1.5 shadow-lg backdrop-blur-md"
          >
            {LINKS.map((l) => (
              <DropdownMenuItem key={l.href} asChild className="cursor-pointer rounded-md px-3 py-2.5">
                <a href={l.href}>{l.label}</a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {signedIn ? (
          <LandingUserMenu
            userName={user?.name}
            userEmail={user?.email}
            userImage={user?.image}
          />
        ) : null}
        {!signedIn ? (
          <>
            <Link
              href="/login"
              className="hidden rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground sm:inline-flex sm:px-4"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ size: "sm" }),
                "rounded-full px-3.5 text-xs sm:px-5 sm:text-sm",
              )}
            >
              Get started
            </Link>
          </>
        ) : null}
      </div>
    </header>
  );
}
