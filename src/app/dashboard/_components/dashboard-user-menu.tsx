"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { authClient } from "~/server/better-auth/client";

type DashboardUserMenuProps = {
  userName?: string | null;
  userRole?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
};

function getInitials(name?: string | null) {
  if (!name) {
    return "SS";
  }

  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "SS";
}

export function DashboardUserMenu({
  userName,
  userRole,
  userEmail,
  userImage,
}: DashboardUserMenuProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const initials = useMemo(() => getInitials(userName), [userName]);

  const handleLogout = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    try {
      await authClient.signOut();
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Failed to sign out", error);
      setIsSigningOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl border border-(--line) bg-background/50 px-4 py-3 text-left transition-colors hover:bg-background/80"
        >
          <Avatar className="size-10 border border-(--line)">
            <AvatarImage src={userImage ?? undefined} alt={userName ?? "User avatar"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {userName ?? "Team member"}
            </p>
            <p className="truncate text-xs capitalize text-(--ink-soft)">
              {userRole ?? "employee"}
            </p>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-(--ink-soft)" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start" side="bottom">
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <Avatar className="size-10 border border-border">
              <AvatarImage
                src={userImage ?? undefined}
                alt={userName ?? "User avatar"}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {userName ?? "Team member"}
              </p>
              {userEmail ? (
                <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
              ) : null}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            void handleLogout();
          }}
          disabled={isSigningOut}
          className={cn(
            "cursor-pointer",
            isSigningOut && "pointer-events-none opacity-60",
          )}
        >
          <LogOut className="h-4 w-4" />
          {isSigningOut ? "Signing out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
