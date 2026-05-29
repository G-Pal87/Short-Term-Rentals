#!/usr/bin/env node
/**
 * Fetches all property iCal feeds from Airbnb and writes pre-parsed JSON
 * to public/calendars/{id}.json so the client can fetch them from the same
 * domain (no CORS issues). Runs as a prebuild step.
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "calendars");

const PROPERTIES = [
  {
    id: "venus-beach-retreat",
    icalUrl:
      "https://www.airbnb.gr/calendar/ical/1341854905555812998.ics?t=1e2c75c8b84645a4ac88669d8ec7bdda",
  },
  {
    id: "luxe-poolside-escape",
    icalUrl:
      "https://www.airbnb.gr/calendar/ical/1389855941514317769.ics?t=a2520714c5a34b1daa3b808b6c1bfd0e",
  },
  {
    id: "poolside-central-studio",
    icalUrl:
      "https://www.airbnb.gr/calendar/ical/1417130109923067210.ics?t=e8ec8f5e94b845b6817598eeaa30df0e",
  },
  {
    id: "colorful-2bedroom-house",
    icalUrl:
      "https://www.airbnb.com/calendar/ical/720194839435246794.ics?t=3da4aac00c9d4eb6bbe7f3496aa22ee8",
  },
  {
    id: "beach-house-studio",
    icalUrl:
      "https://www.airbnb.com/calendar/ical/888793861213418554.ics?t=130346559a814283901a9b2280797a38",
  },
];

function toDateStr(raw) {
  const digits = raw.replace(/^[^:]*:/, "").trim();
  const m = digits.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

function parseIcal(text) {
  const result = [];
  const events = text.split("BEGIN:VEVENT").slice(1);
  for (const ev of events) {
    const startM = ev.match(/DTSTART[;:][^\r\n]+/);
    const endM = ev.match(/DTEND[;:][^\r\n]+/);
    if (!startM) continue;
    const start = toDateStr(startM[0]);
    const end = endM ? toDateStr(endM[0]) : start;
    if (start && end) result.push({ start, end });
  }
  return result;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  let ok = 0;
  let failed = 0;

  for (const prop of PROPERTIES) {
    try {
      const res = await fetch(prop.icalUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; calendar-sync/1.0)" },
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const text = await res.text();
      const blocked = parseIcal(text);
      const out = { updatedAt: new Date().toISOString(), blocked };
      writeFileSync(join(OUT_DIR, `${prop.id}.json`), JSON.stringify(out));
      console.log(`✓ ${prop.id}: ${blocked.length} blocked ranges`);
      ok++;
    } catch (e) {
      // Write an empty file so the client knows the sync ran but failed
      const out = { updatedAt: new Date().toISOString(), blocked: [], error: e.message };
      writeFileSync(join(OUT_DIR, `${prop.id}.json`), JSON.stringify(out));
      console.warn(`✗ ${prop.id}: ${e.message} — writing empty fallback`);
      failed++;
    }
  }

  console.log(`\nDone: ${ok} ok, ${failed} failed`);
}

main();
