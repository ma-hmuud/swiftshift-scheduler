import Link from "next/link";
import { redirect } from "next/navigation";

import { LandingGifGrid } from "~/app/_components/landing-gif-grid";
import { FeatureTabs } from "~/app/_components/feature-tabs";
import { auth } from "~/server/better-auth";
import { getSession } from "~/server/better-auth/server";
import { HydrateClient } from "~/trpc/server";
import { headers } from "next/headers";

export default async function Home() {
  const session = await getSession();

  return (
    <HydrateClient>
      <main className="swift-shell">
        <div className="swift-mesh" aria-hidden="true" />
        <span className="landing-orbit swift-hero-orbit" aria-hidden />
        <span className="landing-orbit landing-orbit--delayed swift-hero-orbit-2" aria-hidden />

        <header className="swift-nav reveal reveal-1">
          <p className="swift-brand">Swift Shift</p>
          <div className="swift-nav-actions">
            {session ? (
              <div className="flex items-center gap-3">
                <Link className="swift-link" href="/dashboard">
                  Open app
                </Link>
                <form>
                  <button
                    className="swift-quiet-button"
                    formAction={async () => {
                      "use server";
                      await auth.api.signOut({
                        headers: await headers(),
                      });
                      redirect("/");
                    }}
                  >
                    Sign out
                  </button>
                </form>
              </div>
            ) : (
              <Link className="swift-link" href="/login">
                Sign in
              </Link>
            )}
          </div>
        </header>

        <section className="landing-hero-bento swift-hero-wrap reveal reveal-2">
          <div className="swift-hero swift-hero--flush">
            <p className="swift-kicker">Modern Employee Scheduling</p>
            <h1>Swift Shift</h1>
            <p className="swift-hero-copy">
              A calm, calendar-first workspace for managers and teams. Plan coverage, approve
              requests, and keep every shift legible — without living in spreadsheets.
            </p>
            <div className="swift-hero-actions">
              {!session ? (
                <Link className="swift-button" href="/login">
                  Get started
                </Link>
              ) : (
                <Link className="swift-button" href="/dashboard">
                  Go to app
                </Link>
              )}
              <a className="swift-link" href="#features">
                Explore features
              </a>
            </div>
            <div className="swift-hero-strip" aria-hidden="true">
              <span>Scattered updates</span>
              <span className="is-divider">→</span>
              <span>One living schedule</span>
            </div>
          </div>

          <div className="swift-hero-media reveal reveal-3">
            <p className="swift-kicker landing-media-kicker">In motion</p>
            <p className="landing-media-lead">
              Lightweight WebP loops from Giphy — replace the ids in{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.75rem]">
                landing-gif-grid.tsx
              </code>{" "}
              or host your own GIFs / WebPs under{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.75rem]">
                /public/landing
              </code>
              .
            </p>
            <LandingGifGrid />
          </div>
        </section>

        <section className="swift-comparison reveal reveal-4" id="comparison">
          <article className="swift-card before reveal reveal-5">
            <h2>Before</h2>
            <ul>
              <li>Last-minute confusion about who is on</li>
              <li>Threads and DMs for every swap</li>
              <li>Approvals that stall the floor</li>
            </ul>
          </article>
          <article className="swift-card after reveal reveal-6">
            <h2>After</h2>
            <ul>
              <li>Published shifts with clear capacity</li>
              <li>Requests with full context in one queue</li>
              <li>Faster decisions with fewer mistakes</li>
            </ul>
          </article>
        </section>

        <section
          className="swift-metrics reveal reveal-7"
          aria-label="Outcome highlights"
        >
          <p>
            <strong>60%</strong> less scheduling noise
          </p>
          <p>
            <strong>2×</strong> faster approvals
          </p>
          <p>
            <strong>1</strong> calendar for everyone
          </p>
        </section>

        <section className="swift-features reveal reveal-8" id="features">
          <p className="swift-kicker">Product</p>
          <h2>Workflows that stay in sync</h2>
          <FeatureTabs />
        </section>

        <section className="swift-usecases reveal reveal-9" id="use-cases">
          <p className="swift-kicker">Where it shines</p>
          <h2>Teams that run on precise timing</h2>
          <div className="swift-usecase-grid">
            <article className="reveal reveal-10">
              <h3>Hospitality</h3>
              <p>Cover peaks without overstaffing quiet days.</p>
            </article>
            <article className="reveal reveal-11">
              <h3>Retail</h3>
              <p>Floor coverage with fewer no-show scrambles.</p>
            </article>
            <article className="reveal reveal-12">
              <h3>Field & mobile</h3>
              <p>Route crews with shift clarity in one place.</p>
            </article>
            <article className="reveal reveal-13">
              <h3>Care & clinics</h3>
              <p>Keep role-specific staffing consistent week to week.</p>
            </article>
          </div>
        </section>

        <footer className="swift-footer reveal reveal-14" id="contact">
          <p>Swift Shift — olive, sage, and cream. Dark by design.</p>
          <a href="mailto:contact@swiftshift.app">contact@swiftshift.app</a>
        </footer>
      </main>
    </HydrateClient>
  );
}
