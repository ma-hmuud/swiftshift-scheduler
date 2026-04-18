import Link from "next/link";

import { JoinCommunityForm } from "../_components/join-community-form";

export default function OnboardingEmployeePage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16">
      <section className="landing-glass rounded-[1.75rem] border border-(--landing-border) p-8 shadow-[0_24px_80px_rgba(0,0,0,0.4)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Employee</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Enter your invite code
        </h1>
        <p className="mt-3 text-muted-foreground">
          Ask your manager for the code that was created for your team workspace.
        </p>

        <div className="mt-8">
          <JoinCommunityForm />
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          <Link href="/onboarding" className="font-medium text-foreground underline-offset-4 hover:underline">
            ← Back to role choice
          </Link>
        </p>
      </section>
    </div>
  );
}
