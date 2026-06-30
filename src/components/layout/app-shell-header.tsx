"use client";

import { SidebarTrigger } from "~/components/ui/sidebar";

export function AppShellHeader({ title }: { title: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border/70 bg-background/85 px-4 backdrop-blur-md sm:px-6">
      <SidebarTrigger className="-ml-1" />
      <h1 className="truncate font-display text-base font-semibold tracking-tight text-foreground">
        {title}
      </h1>
    </header>
  );
}
