"use client";

import { ThemeToggle } from "~/app/_components/theme-toggle";

export function AppShellHeader({ title }: { title: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
      <h1 className="truncate text-sm font-semibold tracking-tight text-foreground sm:text-base">
        {title}
      </h1>
      <ThemeToggle />
    </header>
  );
}
