"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut } from "lucide-react";

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

type LandingUserMenuProps = {
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
};

function getInitials(name?: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export function LandingUserMenu({
  userName,
  userEmail,
  userImage,
}: LandingUserMenuProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const initials = useMemo(() => getInitials(userName), [userName]);
  const displayName = useMemo(() => {
    const n = userName?.trim();
    return n !== undefined && n !== "" ? n : "Signed in";
  }, [userName]);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      router.replace("/");
      router.refresh();
    } catch (e) {
      console.error(e);
      setIsSigningOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "relative inline-flex size-10 items-center justify-center rounded-full border border-(--landing-border) bg-card/90 shadow-sm ring-offset-background transition",
            "hover:border-[color-mix(in_srgb,var(--primary)_40%,var(--landing-border))] hover:ring-2 hover:ring-[color-mix(in_srgb,var(--primary)_35%,transparent)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
          aria-label="Account menu"
        >
          <Avatar className="size-9">
            <AvatarImage src={userImage ?? undefined} alt={displayName} />
            <AvatarFallback className="bg-muted text-xs font-semibold">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-0.5">
            <span className="truncate text-sm font-medium">{displayName}</span>
            {userEmail ? (
              <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
            ) : null}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <LayoutDashboard className="mr-2 size-4" />
            Open app
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            void handleSignOut();
          }}
          disabled={isSigningOut}
          className={cn(
            "cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive",
            isSigningOut && "pointer-events-none opacity-60",
          )}
        >
          <LogOut className="mr-2 size-4" />
          {isSigningOut ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
