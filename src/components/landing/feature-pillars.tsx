import { Sparkles, Timer, Users } from "lucide-react";

const PILLARS = [
  {
    title: "Clarity at open",
    body: "See who is on, what is understaffed, and what is still draft—before the rush hits.",
    icon: Timer,
    featured: false,
  },
  {
    title: "Approvals that scale",
    body: "Queue requests with shift context, capacity math, and a single place to say yes or not yet.",
    icon: Sparkles,
    featured: true,
  },
  {
    title: "Teams that stay aligned",
    body: "Employees update availability once; managers publish against reality instead of memory.",
    icon: Users,
    featured: false,
  },
];

export function FeaturePillars() {
  return (
    <section id="product" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Why teams switch
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Built for operators who cannot miss a beat
        </h2>
        <p className="mt-3 text-muted-foreground">
          Three anchors—coverage truth, humane approvals, and shared rhythm—keep the floor calm when
          everything else is loud.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3 md:items-stretch">
        {PILLARS.map(({ title, body, icon: Icon, featured }) => (
          <article
            key={title}
            className={
              featured
                ? "landing-glass relative overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--primary)_45%,var(--landing-border))] bg-[color-mix(in_srgb,var(--card)_92%,transparent)] p-8 shadow-[0_0_80px_color-mix(in_srgb,var(--glow-warm)_18%,transparent)] md:-translate-y-2 md:scale-[1.02]"
                : "landing-glass rounded-3xl border border-(--landing-border) p-7"
            }
          >
            {featured ? (
              <div
                className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in srgb, var(--primary) 35%, transparent), transparent 70%)",
                }}
              />
            ) : null}
            <div className="relative">
              <Icon className="size-8 text-primary" strokeWidth={1.15} />
              <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
