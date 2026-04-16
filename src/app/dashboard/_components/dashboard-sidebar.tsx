"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShieldCheck, SquareKanban, Users } from "lucide-react";

import { cn } from "~/lib/utils";
import { DashboardUserMenu } from "./dashboard-user-menu";

const navigationItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/employees",
    label: "Employees",
    icon: Users,
  },
  {
    href: "/dashboard/requests",
    label: "Requests",
    icon: ShieldCheck,
  },
  {
    href: "/dashboard/shifts",
    label: "Shifts",
    icon: SquareKanban,
  },
];

type DashboardSidebarProps = {
  userName?: string | null;
  userRole?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
};

export function DashboardSidebar({
  userName,
  userRole,
  userEmail,
  userImage,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-border/70 bg-card/85 backdrop-blur-md lg:min-h-screen lg:w-72 lg:border-r lg:border-b-0">
      <div className="sticky top-0 flex h-full flex-col px-5 py-6">
        <div className="mb-8">
          <p className="font-display text-xl font-semibold tracking-tight">Swift Shift</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Scheduling workspace for managers and employees.
          </p>
        </div>

        <div className="mb-8">
          <DashboardUserMenu
            userName={userName}
            userRole={userRole}
            userEmail={userEmail}
            userImage={userImage}
          />
        </div>

        <nav className="grid gap-2" aria-label="Dashboard navigation">
          {navigationItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors",
                  isActive
                    ? "border-[color-mix(in_srgb,var(--primary)_40%,var(--landing-border))] bg-[color-mix(in_srgb,var(--primary)_18%,transparent)] text-foreground shadow-[0_0_0_1px_color-mix(in_srgb,var(--primary)_25%,transparent)]"
                    : "border-border/60 bg-transparent text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
