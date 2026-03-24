import Link from "next/link";
import { redirect } from "next/navigation";

import { authClient } from "~/server/better-auth/client";
import { getSession } from "~/server/better-auth/server";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="swift-shell">
      <div className="swift-mesh" aria-hidden="true" />

      <section className="swift-hero reveal reveal-2 mx-auto max-w-2xl">
        <p className="swift-kicker">Welcome Back</p>
        <h1>Login to Swift Shift</h1>
        <p className="swift-hero-copy">
          Sign in to manage schedules, approve requests, and keep your team in
          sync.
        </p>

        <div className="swift-hero-actions">
          <form>
            <button
              className="swift-button"
              formAction={async () => {
                "use server";
                const { data, error } = await authClient.signIn.social({
                  provider: "google",
                });

                if (!data) {
                  console.error(error?.message);
                  throw new Error(error?.message);
                }

                redirect(data.url!);
              }}
            >
              Continue with Google
            </button>
          </form>

          <Link href="/" className="swift-link">
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
