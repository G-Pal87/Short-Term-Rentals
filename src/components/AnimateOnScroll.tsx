"use client";

import { useEffect, useRef, ReactNode } from "react";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "fade-up" | "fade-in";
}

export default function AnimateOnScroll({
  children,
  className = "",
  delay = 0,
  variant = "fade-up",
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip the hide/reveal animation entirely for reduced-motion users -
    // content stays visible from the start instead of fading in on scroll.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const baseClass = variant === "fade-in" ? "scroll-fade" : "scroll-reveal";
    el.classList.add(baseClass);
    if (delay > 0) {
      el.style.transitionDelay = `${delay}ms`;
    }

    const reveal = () => el.classList.add("revealed");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px 150px 0px" }
    );

    observer.observe(el);

    // Safety net: force-reveal shortly after mount regardless of scroll
    // position, so a full-page capture taken before the user has scrolled
    // (screenshot tools, some crawlers) never sees permanently-blank sections.
    const fallback = window.setTimeout(reveal, 900);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [delay, variant]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
