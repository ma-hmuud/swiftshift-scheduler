import Link from "next/link";

import { buttonVariants } from "~/components/ui/button-variants";
import { cn } from "~/lib/utils";

import { HeroAnimatedCalendar } from "./hero-animated-calendar";

type LandingHeroProps = {
  signedIn: boolean;
};

export function LandingHero({ signedIn }: LandingHeroProps) {
  return (
    <section className="relative mx-auto max-w-6xl px-4 pt-8 sm:pt-12">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[min(52vh,480px)] w-[min(96vw,1100px)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--glow-warm)_28%,transparent),transparent_65%)] blur-3xl" />

      <div className="relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
        <div className="space-y-6 text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Calendar-native operations
          </p>
          <h1 className="font-display text-[clamp(2.25rem,6vw,3.75rem)] font-semibold leading-[1.05] tracking-tight text-balance">
            Run shifts with warmth, signal, and zero spreadsheet debt
          </h1>
          <p className="mx-auto max-w-xl text-pretty text-base text-muted-foreground lg:mx-0 lg:text-lg">
            Swift Shift unifies availability, published blocks, and approvals in one earthy,
            legible surface—so managers lead with context and teams stop chasing ghosts.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            {signedIn ? (
              <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8")}>
                Enter workspace
              </Link>
            ) : (
              <>
                <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8")}>
                  Start scheduling
                </Link>
                <a
                  href="#product"
                  className="rounded-full px-6 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                >
                  See how it works
                </a>
              </>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-4 rounded-[1.75rem] bg-linear-to-br from-[color-mix(in_srgb,var(--primary)_12%,transparent)] via-transparent to-[color-mix(in_srgb,var(--toffee-500)_14%,transparent)] opacity-90 blur-2xl" />
          <HeroAnimatedCalendar />
        </div>
      </div>
    </section>
  );
}
