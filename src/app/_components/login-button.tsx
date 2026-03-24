"use client";

import { useState } from "react";
import { redirect } from "next/navigation";

import { authClient } from "~/server/better-auth/client";
import { Spinner } from "~/components/ui/spinner";

export function LoginButton() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
      });

      if (!data?.url) {
        console.error(error?.message);
        setLoading(false);
        return;
      }

      redirect(data.url);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="swift-button"
      onClick={handleSignIn}
      disabled={loading}
    >
      {loading ? <Spinner /> : "Continue with Google"}
    </button>
  );
}
