"use client";

import { useEffect } from "react";
import Script from "next/script";
import { GOATCOUNTER_CODE } from "@/lib/site";

declare global {
  interface Window {
    goatcounter?: { count: (vars: { path: string; title?: string; event?: boolean }) => void };
  }
}

// Which contact channel a link opens, or null for any other link.
function channelOf(a: HTMLAnchorElement): string | null {
  const href = a.getAttribute("href") ?? "";
  if (href.startsWith("https://wa.me/")) return "whatsapp";
  if (href.startsWith("viber:")) return "viber";
  if (href.startsWith("mailto:")) return "email";
  if (href.startsWith("https://mail.google.com/")) return "email-gmail";
  if (href.startsWith("https://outlook.live.com/")) return "email-outlook";
  if (href.includes("instagram.com")) return "instagram";
  if (href.includes("airbnb.com")) return "airbnb-reviews";
  return null;
}

// Cookie-free page views plus one event per contact tap, named
// "<channel> <page>" (e.g. "whatsapp /paphos/venus-beach-retreat/").
// Renders nothing while GOATCOUNTER_CODE is empty.
export default function Analytics() {
  useEffect(() => {
    if (!GOATCOUNTER_CODE) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      const channel = a ? channelOf(a) : null;
      if (!channel || !window.goatcounter) return;
      window.goatcounter.count({ path: `${channel} ${window.location.pathname}`, title: channel, event: true });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!GOATCOUNTER_CODE) return null;
  return (
    <Script
      data-goatcounter={`https://${GOATCOUNTER_CODE}.goatcounter.com/count`}
      src="https://gc.zgo.at/count.js"
      strategy="afterInteractive"
    />
  );
}
