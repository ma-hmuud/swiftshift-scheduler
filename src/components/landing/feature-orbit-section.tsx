import { CalendarClock, GitBranch, Layers, Radio } from "lucide-react";

const NODES = [
  {
    title: "Publish with intent",
    body: "Draft shifts, set capacity, and push live when the floor is ready—no surprise gaps.",
    icon: Layers,
  },
  {
    title: "Requests that arrive clean",
    body: "Employees ask inside the calendar context you already trust—no thread archaeology.",
    icon: GitBranch,
  },
  {
    title: "Approvals in one lane",
    body: "Managers see coverage risk beside each ask, so decisions stay fast and fair.",
    icon: Radio,
  },
  {
    title: "Rhythm you can feel",
    body: "Availability and published blocks stay aligned so teams stop negotiating in chat.",
    icon: CalendarClock,
  },
];

export function FeatureOrbitSection() {
  return (
    <section
      id="network"
      className="relative mx-auto max-w-6xl scroll-mt-28 px-4 py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-linear-to-r from-transparent via-(--landing-border) to-transparent" />
      <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Connected workflow
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            One nervous system for coverage, asks, and approvals
          </h2>
          <p className="max-w-md text-pretty text-muted-foreground">
            Swift Shift keeps the messy middle visible: who is asking, what it impacts, and what
            still needs a human yes—without opening five tools.
          </p>
        </div>

        <div className="relative min-h-[320px]">
          <svg
            className="pointer-events-none absolute inset-0 size-full text-(--landing-border)"
            aria-hidden
          >
            <line x1="50%" y1="50%" x2="12%" y2="18%" stroke="currentColor" strokeWidth="1" />
            <line x1="50%" y1="50%" x2="88%" y2="22%" stroke="currentColor" strokeWidth="1" />
            <line x1="50%" y1="50%" x2="10%" y2="78%" stroke="currentColor" strokeWidth="1" />
            <line x1="50%" y1="50%" x2="90%" y2="82%" stroke="currentColor" strokeWidth="1" />
          </svg>
          <div className="relative flex h-full items-center justify-center">
            <div className="landing-glow-orb flex size-28 items-center justify-center rounded-3xl border border-(--landing-border) bg-[color-mix(in_srgb,var(--card)_80%,transparent)] shadow-[0_0_60px_color-mix(in_srgb,var(--glow-warm)_22%,transparent)] backdrop-blur-md sm:size-32">
              <Radio className="size-10 text-primary" strokeWidth={1.25} />
            </div>
          </div>
          <ul className="relative mt-6 grid gap-3 sm:grid-cols-2">
            {NODES.map(({ title, body, icon: Icon }) => (
              <li
                key={title}
                className="landing-glass rounded-2xl border border-(--landing-border) p-4 transition duration-300 hover:border-[color-mix(in_srgb,var(--primary)_35%,var(--landing-border))]"
              >
                <Icon className="mb-2 size-5 text-primary" strokeWidth={1.25} />
                <h3 className="font-display text-lg font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
