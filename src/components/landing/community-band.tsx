import { MessageCircle, Rss, Share2 } from "lucide-react";

const SOCIAL = [
  { label: "Changelog", icon: MessageCircle, href: "#footer" },
  { label: "Updates", icon: Rss, href: "#footer" },
  { label: "Share", icon: Share2, href: "#footer" },
];

export function CommunityBand() {
  return (
    <section className="relative mx-auto max-w-6xl overflow-hidden px-4 py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 80%, color-mix(in srgb, var(--glow-warm) 16%, transparent), transparent 55%)",
        }}
      />
      <div className="relative rounded-[2rem] border border-(--landing-border) bg-[color-mix(in_srgb,var(--card)_70%,transparent)] px-6 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Community signal
        </p>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Operators sharing sharper schedules
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          We are building in public—follow releases, suggest workflows, and swap tactics with teams
          who live on the floor, not in slides.
        </p>

        <div className="mx-auto mt-10 flex max-w-md flex-wrap items-center justify-center gap-3">
          {SOCIAL.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              className="landing-glass inline-flex items-center gap-2 rounded-2xl border border-(--landing-border) px-4 py-3 text-sm font-medium text-muted-foreground transition hover:border-[color-mix(in_srgb,var(--primary)_40%,var(--landing-border))] hover:text-foreground"
            >
              <Icon className="size-4" />
              {label}
            </a>
          ))}
        </div>

        <div
          className="mx-auto mt-14 flex h-32 max-w-lg items-center justify-center gap-4 opacity-90"
          aria-hidden
        >
          <span className="landing-orb size-24 rounded-full bg-[color-mix(in_srgb,var(--primary)_22%,transparent)] blur-xl" />
          <span className="landing-orb-delayed size-32 rounded-full bg-[color-mix(in_srgb,var(--camel-500)_18%,transparent)] blur-2xl" />
          <span className="landing-orb size-20 rounded-full bg-[color-mix(in_srgb,var(--toffee-500)_20%,transparent)] blur-xl" />
        </div>
      </div>
    </section>
  );
}
