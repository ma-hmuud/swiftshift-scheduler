"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { SwiftShiftLockup } from "~/components/brand/swift-shift-lockup";

const COLS = [
  {
    title: "Product",
    links: [
      { label: "Workflow", href: "#network" },
      { label: "Pillars", href: "#product" },
      { label: "Stories", href: "#stories" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Careers", href: "#footer" },
      { label: "Security", href: "#footer" },
      { label: "Status", href: "#footer" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Docs", href: "#footer" },
      { label: "Contact", href: "mailto:hello@swiftshift.app" },
      { label: "Privacy", href: "#footer" },
    ],
  },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");

  return (
    <footer id="footer" className="border-t border-(--landing-border) bg-[color-mix(in_srgb,var(--background)_96%,black)]">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
          <div className="space-y-4">
            <SwiftShiftLockup
              href="/"
              className="[&_span]:text-xl [&_span]:font-semibold"
            />
            <p className="max-w-sm text-sm text-muted-foreground">
              Calendar-native scheduling for teams who cannot afford ambiguity. Built with warm
              contrast, sharp approvals, and respect for the floor.
            </p>
          </div>
          <div className="grid gap-10 sm:grid-cols-3">
            {COLS.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {col.title}
                </p>
                <ul className="mt-3 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-sm text-foreground/90 transition hover:text-primary"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-(--landing-border) pt-10 lg:flex-row lg:items-end lg:justify-between">
          <form
            className="w-full max-w-md space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.trim()) {
                toast.error("Add an email to subscribe.");
                return;
              }
              toast.success("Thanks — we will be in touch.");
              setEmail("");
            }}
          >
            <label htmlFor="newsletter" className="text-sm font-medium">
              Newsletter
            </label>
            <div className="flex gap-2">
              <input
                id="newsletter"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="h-11 flex-1 rounded-xl border border-(--landing-border) bg-muted/40 px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="submit"
                className="h-11 shrink-0 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Join
              </button>
            </div>
          </form>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Swift Shift. Crafted with earth tones and intent.
          </p>
        </div>

        <div className="mt-10 h-px w-full bg-linear-to-r from-transparent via-[color-mix(in_srgb,var(--primary)_35%,transparent)] to-transparent opacity-80" />
        <p className="mt-6 text-center text-[0.7rem] text-muted-foreground">
          Already onboard?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </footer>
  );
}
