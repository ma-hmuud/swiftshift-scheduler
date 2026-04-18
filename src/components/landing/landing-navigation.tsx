import Link from "next/link";

import { LandingUserMenu } from "~/components/landing/landing-user-menu";
import { buttonVariants } from "~/components/ui/button-variants";
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
    <header className="landing-nav fixed inset-x-0 top-4 z-50 mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-3 sm:px-4">
      <Link
        href="/"
        className="font-display text-lg font-semibold tracking-tight text-foreground"
      >
        Swift Shift
      </Link>

      <nav
        className="order-last flex w-full justify-center sm:order-0 sm:flex-1 sm:w-auto"
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

      <div className="flex items-center gap-2">
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
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground sm:inline"
            >
              Sign in
            </Link>
            <Link href="/login" className={cn(buttonVariants({ size: "sm" }), "rounded-full px-5")}>
              Get started
            </Link>
          </>
        ) : null}
      </div>
    </header>
  );
}
