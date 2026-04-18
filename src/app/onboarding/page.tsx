import Link from "next/link";

import { buttonVariants } from "~/components/ui/button-variants";
import { cn } from "~/lib/utils";

export default function OnboardingRolePage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-16">
      <section className="landing-glass rounded-[1.75rem] border border-(--landing-border) p-8 shadow-[0_24px_80px_rgba(0,0,0,0.4)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Almost there</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          How will you use Swift Shift?
        </h1>
        <p className="mt-3 text-muted-foreground">
          Managers create a workspace and get an invite code for their team. Employees join with that
          code.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/onboarding/manager"
            className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8")}
          >
            I&apos;m a manager
          </Link>
          <Link
            href="/onboarding/employee"
            className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "rounded-full px-8")}
          >
            I&apos;m an employee
          </Link>
        </div>
      </section>
    </div>
  );
}
