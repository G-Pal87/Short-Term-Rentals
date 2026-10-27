import type { NearbyKind } from "@/data/properties";

const PATHS: Record<NearbyKind, string> = {
  beach: "M12 3v2m6.36.64l-1.42 1.42M21 12h-2M5 12H3m3.06-4.94L4.64 5.64M8 12a4 4 0 118 0M2 17c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0M2 21c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0",
  supermarket: "M2.25 3h1.39c.51 0 .96.34 1.09.84l.38 1.44m0 0L6.75 12h10.5l2.25-6.72H5.11zM6.75 12l-.75 3h12M9 19.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm9 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z",
  restaurants: "M8 3v7a2 2 0 01-2 2v9M4 3v5a2 2 0 002 2M8 3v5M16 21V3c-1.66 0-3 2.24-3 5v5h3",
  town: "M3 21h18M5 21V10l7-5 7 5v11M9 21v-5h6v5",
  airport: "M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z",
};

export default function NearbyIcon({ kind, className = "w-4 h-4" }: { kind: NearbyKind; className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={PATHS[kind]} />
    </svg>
  );
}
