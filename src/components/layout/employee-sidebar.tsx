"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, LayoutDashboard } from "lucide-react";

import { DashboardUserMenu } from "~/app/dashboard/_components/dashboard-user-menu";
import { cn } from "~/lib/utils";

const items = [
  { href: "/employee", label: "Overview", icon: LayoutDashboard, end: true },
  { href: "/employee/calendar", label: "Shifts", icon: CalendarDays },
];

type EmployeeSidebarProps = {
  userName?: string | null;
  userRole?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
};

export function EmployeeSidebar(props: EmployeeSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b border-border bg-card/90 backdrop-blur lg:fixed lg:inset-y-0 lg:w-56 lg:border-r lg:border-b-0">
      <div className="flex h-full flex-col gap-6 px-4 py-6">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight">Swift Shift</p>
          <p className="mt-1 text-xs text-muted-foreground">Team member</p>
        </div>
        <DashboardUserMenu {...props} />
        <nav className="grid gap-1" aria-label="Employee">
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
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
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
