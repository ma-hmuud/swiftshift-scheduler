"use client";

import { SwiftShiftLockup } from "~/components/brand/swift-shift-lockup";

export function SiteFooter() {
  return (
    <footer
      id="footer"
      className="border-t border-(--landing-border) bg-[color-mix(in_srgb,var(--background)_96%,black)]"
    >
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
          <div className="space-y-4">
            <SwiftShiftLockup
              href="/"
              className="[&_span]:text-xl [&_span]:font-semibold"
            />
            <p className="text-muted-foreground max-w-sm text-sm">
              Calendar-native scheduling for teams who cannot afford ambiguity.
              Built with warm contrast, sharp approvals, and respect for the
              floor.
            </p>
          </div>
        </div>
        <div className="mt-10 h-px w-full bg-linear-to-r from-transparent via-[color-mix(in_srgb,var(--primary)_35%,transparent)] to-transparent opacity-80" />
        <p className="text-muted-foreground mt-6 text-center text-[0.7rem]">
          © {new Date().getFullYear()} Swift Shift. Crafted with earth tones and
          intent.
        </p>
      </div>
    </footer>
  );
}
