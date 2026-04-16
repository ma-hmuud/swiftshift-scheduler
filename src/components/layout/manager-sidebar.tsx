"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from "lucide-react";

import { DashboardUserMenu } from "~/app/dashboard/_components/dashboard-user-menu";
import { cn } from "~/lib/utils";

const items = [
  { href: "/manager", label: "Dashboard", icon: LayoutDashboard, end: true },
  { href: "/manager/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/manager/requests", label: "Requests", icon: ShieldCheck },
  { href: "/manager/employees", label: "Employees", icon: Users },
];

type ManagerSidebarProps = {
  userName?: string | null;
  userRole?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
};

export function ManagerSidebar(props: ManagerSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b border-border/70 bg-card/85 backdrop-blur-md lg:fixed lg:inset-y-0 lg:w-60 lg:border-r lg:border-b-0">
      <div className="flex h-full flex-col gap-6 px-4 py-6">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight text-foreground">Swift Shift</p>
          <p className="mt-1 text-xs text-muted-foreground">Manager workspace</p>
        </div>
        <DashboardUserMenu {...props} />
        <nav className="grid gap-1" aria-label="Manager">
          {items.map((item) => {
            const active = item.end
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[color-mix(in_srgb,var(--primary)_20%,transparent)] text-foreground shadow-[0_0_0_1px_color-mix(in_srgb,var(--primary)_35%,transparent)]"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0 opacity-90" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
