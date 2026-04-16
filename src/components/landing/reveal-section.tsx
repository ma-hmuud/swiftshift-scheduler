"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import { cn } from "~/lib/utils";

type RevealSectionProps = {
  children: ReactNode;
  className?: string;
  /** Hero / above-the-fold: skip scroll observer and show immediately. */
  immediate?: boolean;
};

export function RevealSection({ children, className, immediate = false }: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    if (immediate) return;

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          obs.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -6% 0px",
        threshold: [0, 0.08, 0.15],
      },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [immediate]);

  return (
    <div
      ref={ref}
      className={cn(
        !immediate && "landing-reveal",
        !immediate && visible && "landing-reveal-visible",
        className,
      )}
    >
      {children}
    </div>
  );
}
