import { redirect } from "next/navigation";

import { getCommunityMembership } from "~/server/community/membership";
import { getSession } from "~/server/better-auth/server";

export default async function DashboardRedirectPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const membership = await getCommunityMembership(Number(session.user.id));
  if (!membership) {
    redirect("/onboarding");
  }

  if (session.user.role === "manager") {
    redirect("/manager");
  }
  if (session.user.role === "employee") {
    redirect("/employee");
  }

  redirect("/onboarding");
}
