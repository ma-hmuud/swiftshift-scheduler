"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, CalendarClock, LayoutDashboard } from "lucide-react";

import { DashboardUserMenu } from "~/app/dashboard/_components/dashboard-user-menu";
import { SwiftShiftLockup } from "~/components/brand/swift-shift-lockup";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

const items = [
  { href: "/employee", label: "Overview", icon: LayoutDashboard, end: true },
  { href: "/employee/availability", label: "Availability", icon: CalendarClock },
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
    <Sidebar>
      <SidebarHeader className="gap-4 border-b border-border/70 px-4 py-6">
        <div>
          <SwiftShiftLockup href="/employee" />
          <p className="mt-2 text-xs text-muted-foreground">Team member</p>
        </div>
        <DashboardUserMenu {...props} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = item.end
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
