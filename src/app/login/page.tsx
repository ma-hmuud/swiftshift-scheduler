import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginButton } from "~/app/_components/login-button";
import { SwiftShiftLockup } from "~/components/brand/swift-shift-lockup";
import { getCommunityMembership } from "~/server/community/membership";
import { getSession } from "~/server/better-auth/server";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    const membership = await getCommunityMembership(Number(session.user.id));
    redirect(membership ? "/dashboard" : "/onboarding");
  }

  return (
    <main className="landing-page flex min-h-screen flex-col">
      <div className="landing-mesh" aria-hidden />
      <div className="relative z-1 flex flex-1 flex-col items-center justify-center px-4 py-16">
        <section className="landing-glass w-full max-w-lg rounded-[1.75rem] border border-(--landing-border) p-8 shadow-[0_24px_80px_rgba(0,0,0,0.4)] sm:p-10">
          <SwiftShiftLockup href="/" priority className="justify-center sm:justify-start" />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Welcome back
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Sign in to Swift Shift
          </h1>
          <p className="mt-3 text-muted-foreground">
            Manage schedules, approve requests, and keep your team aligned from one calm surface.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <LoginButton />
            <Link
              href="/"
              className="text-center text-sm font-medium text-muted-foreground transition hover:text-foreground sm:text-left"
            >
              ← Back to home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
