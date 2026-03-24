import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "~/server/better-auth";
import { getSession } from "~/server/better-auth/server";
import { FeatureTabs } from "~/app/_components/feature-tabs";
import { ThemeToggle } from "~/app/_components/theme-toggle";
import { HydrateClient } from "~/trpc/server";
import { headers } from "next/headers";

export default async function Home() {
  const session = await getSession();

  return (
    <HydrateClient>
      <main className="swift-shell">
        <div className="swift-mesh" aria-hidden="true" />
        <header className="swift-nav reveal reveal-1">
          <p className="swift-brand">Swift Shift</p>
          <div className="swift-nav-actions">
            <ThemeToggle />
            {session ? (
              <div className="flex items-center gap-3">
                <Link className="swift-link" href="/dashboard">
                  Dashboard
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
            ) : null}
          </div>
        </header>

        <section className="swift-hero reveal reveal-2">
          <p className="swift-kicker">Modern Employee Scheduling</p>
          <h1>Swift Shift</h1>
          <p className="swift-hero-copy">
            Turn weekly scheduling stress into confident planning. Build clear
            rosters faster, reduce coordination noise, and help every shift
            start with clarity.
          </p>
          <div className="swift-hero-actions">
            {!session ? (
              <Link className="swift-button" href="/login">
                Get Started
              </Link>
            ) : (
              <Link className="swift-button" href="/dashboard">
                Get Started
              </Link>
            )}
            <a className="swift-link" href="#features">
              Explore features
            </a>
          </div>
          <div className="swift-hero-strip" aria-hidden="true">
            <span>Manual spreadsheet edits</span>
            <span className="is-divider">{"->"}</span>
            <span>Real-time shift clarity</span>
          </div>
        </section>

        <section className="swift-comparison reveal reveal-3" id="comparison">
          <article className="swift-card before reveal reveal-4">
            <h2>Before Swift Shift</h2>
            <ul>
              <li>Last-minute schedule confusion</li>
              <li>Back-and-forth messages for every swap</li>
              <li>Slow approvals that break momentum</li>
            </ul>
          </article>
          <article className="swift-card after reveal reveal-5">
            <h2>After Swift Shift</h2>
            <ul>
              <li>Clear shift ownership and visibility</li>
              <li>Simple request flow in one workspace</li>
              <li>Faster decisions with fewer mistakes</li>
            </ul>
          </article>
        </section>

        <section
          className="swift-metrics reveal reveal-6"
          aria-label="Outcome highlights"
        >
          <p>
            <strong>60%</strong> less scheduling back-and-forth
          </p>
          <p>
            <strong>2x</strong> faster shift approvals
          </p>
          <p>
            <strong>1 view</strong> for managers and teams
          </p>
        </section>

        <section className="swift-features reveal reveal-7" id="features">
          <p className="swift-kicker">Explore The Features</p>
          <h2>Use tabs to see how every workflow connects</h2>
          <FeatureTabs />
        </section>

        <section className="swift-usecases reveal reveal-8" id="use-cases">
          <p className="swift-kicker">What Swift Shift Is Good For</p>
          <h2>Built for teams that depend on precise timing</h2>
          <div className="swift-usecase-grid">
            <article className="reveal reveal-9">
              <h3>Restaurants and cafes</h3>
              <p>Cover peak hours without overstaffing weekdays.</p>
            </article>
            <article className="reveal reveal-10">
              <h3>Retail operations</h3>
              <p>Coordinate floor coverage and reduce no-show chaos.</p>
            </article>
            <article className="reveal reveal-11">
              <h3>Service teams</h3>
              <p>Balance mobile crews and location-based shifts.</p>
            </article>
            <article className="reveal reveal-12">
              <h3>Clinics and care</h3>
              <p>Keep role-specific staffing consistent across days.</p>
            </article>
          </div>
        </section>

        <footer className="swift-footer reveal reveal-13" id="contact">
          <p>Contact us to roll out Swift Shift to your team.</p>
          <a href="mailto:contact@swiftshift.app">contact@swiftshift.app</a>
        </footer>
      </main>
    </HydrateClient>
  );
}
