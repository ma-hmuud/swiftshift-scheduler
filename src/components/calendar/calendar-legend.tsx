type LegendItem = { label: string; className: string };

export function CalendarLegend({ items }: { items: LegendItem[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
      {items.map((item) => (
        <div key={item.label} className="inline-flex items-center gap-2">
          <span className={`size-2.5 rounded-sm ${item.className}`} aria-hidden />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
