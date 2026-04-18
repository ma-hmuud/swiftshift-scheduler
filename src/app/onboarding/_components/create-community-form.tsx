"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { buttonVariants } from "~/components/ui/button-variants";
import { Spinner } from "~/components/ui/spinner";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export function CreateCommunityForm() {
  const router = useRouter();
  const [name, setName] = useState("");

  const create = api.community.createManagerCommunity.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Community name must be at least 2 characters");
      return;
    }
    create.mutate({ name: name.trim() });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="community-name" className="text-sm font-medium text-foreground">
          Community name
        </label>
        <input
          id="community-name"
          name="communityName"
          autoComplete="organization"
          className="mt-2 w-full rounded-xl border border-(--landing-border) bg-card/80 px-4 py-3 text-base text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="e.g. River Café Front of House"
          value={name}
          onChange={(e) => setName(e.target.value)}
          minLength={2}
          maxLength={80}
          required
        />
      </div>
      {create.error && (
        <p className="text-sm text-destructive" role="alert">
          {create.error.message}
        </p>
      )}
      <button
        type="submit"
        disabled={create.isPending || name.trim().length < 2}
        className={cn(buttonVariants({ size: "lg" }), "w-full rounded-full sm:w-auto")}
      >
        {create.isPending ? <Spinner /> : "Create community"}
      </button>
    </form>
  );
}
