const QUOTES = [
  {
    name: "Mara Chen",
    role: "Ops lead, regional retail",
    quote:
      "We stopped rebuilding the week every Sunday night. Requests show up with context, and the calendar finally matches the floor.",
  },
  {
    name: "Jordan Ellis",
    role: "Front-of-house manager",
    quote:
      "My team actually updates availability because it is one field—not six DMs and a spreadsheet tab.",
  },
  {
    name: "Sam Okonkwo",
    role: "Dispatch coordinator",
    quote:
      "Approvals feel fair: you see capacity beside every ask, so nobody is guessing who is stretched.",
  },
];

export function TestimonialRow() {
  return (
    <section id="stories" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Proof from the field
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Voices from teams on Swift Shift
        </h2>
      </div>
      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {QUOTES.map((q) => (
          <li
            key={q.name}
            className="landing-glass flex h-full flex-col rounded-3xl border border-(--landing-border) p-6 text-left"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{q.quote}&rdquo;</p>
            <div className="mt-6 border-t border-(--landing-border) pt-4">
              <p className="font-medium text-foreground">{q.name}</p>
              <p className="text-xs text-muted-foreground">{q.role}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
