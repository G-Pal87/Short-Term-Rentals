"use client";

import { useEffect, useState } from "react";

// Phones only: once the hero search has scrolled away, keep a "Check
// availability" button pinned to the bottom that brings it back.
// Hidden while most of the search (or any of the footer) is on screen.
export default function MobileSearchButton({ targetId }: { targetId: string }) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const targets = [document.getElementById(targetId), document.querySelector("footer")].filter(
      (el): el is HTMLElement => el !== null
    );
    if (targets.length === 0) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // The search grows when results are open, so "mostly visible" also
          // counts as filling half the screen.
          const shown =
            e.target.tagName === "FOOTER"
              ? e.isIntersecting
              : e.intersectionRatio >= 0.6 || e.intersectionRect.height >= window.innerHeight / 2;
          if (shown) visible.add(e.target);
          else visible.delete(e.target);
        }
        setHidden(visible.size > 0);
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [targetId]);

  return (
    <div
      className={`sm:hidden fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 pointer-events-none transition-transform duration-300 ${
        hidden ? "translate-y-[150%]" : "translate-y-0"
      }`}
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" }}
      aria-hidden={hidden}
    >
      <a
        href={`#${targetId}`}
        tabIndex={hidden ? -1 : undefined}
        className="pointer-events-auto inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3.5 rounded-full font-semibold text-sm shadow-xl transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        Check availability
      </a>
    </div>
  );
}
