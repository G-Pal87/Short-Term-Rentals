"use client";

import { useEffect, useState } from "react";

interface StickyBookingBarProps {
  /** null = prices hidden or nothing open -> "Price on request". */
  minPrice: number | null;
  /** id of the booking column the button scrolls to. */
  targetId: string;
}

// Phone/tablet only: on narrow screens the booking panel sits below the
// description, amenities and map, so keep the next step one tap away.
// Hidden while the booking panel or the footer is on screen.
export default function StickyBookingBar({ minPrice, targetId }: StickyBookingBarProps) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const targets = [document.getElementById(targetId), document.querySelector("footer")].filter(
      (el): el is HTMLElement => el !== null
    );
    if (targets.length === 0) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setHidden(visible.size > 0);
    });
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [targetId]);

  return (
    <div
      className={`lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-cream-dark shadow-[0_-4px_16px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-hidden={hidden}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          {minPrice != null ? (
            <p className="text-gray-900">
              <span className="text-xs text-gray-500">From </span>
              <span className="font-serif text-xl font-bold text-primary">€{minPrice}</span>
              <span className="text-xs text-gray-500"> / night</span>
            </p>
          ) : (
            <p className="font-serif text-lg font-bold text-primary leading-tight">Price on request</p>
          )}
          <p className="text-xs text-gray-500">No platform fees · Direct with host</p>
        </div>
        <a
          href={`#${targetId}`}
          tabIndex={hidden ? -1 : undefined}
          className="flex-shrink-0 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-full font-semibold text-sm transition-colors shadow-md"
        >
          Check dates
        </a>
      </div>
    </div>
  );
}
