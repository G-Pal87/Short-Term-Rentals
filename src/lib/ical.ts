import ical from "node-ical";
import { format, parseISO, isValid } from "date-fns";
import fs from "fs";
import path from "path";
import type { BlockedDateRange } from "@/lib/ical-client";
export type { BlockedDateRange } from "@/lib/ical-client";

function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    const parsed = parseISO(date);
    if (isValid(parsed)) {
      return format(parsed, "yyyy-MM-dd");
    }
    return date.slice(0, 10);
  }
  if (date instanceof Date && isValid(date)) {
    return format(date, "yyyy-MM-dd");
  }
  return "";
}

function readCache(propertyId: string): BlockedDateRange[] {
  try {
    const filePath = path.join(process.cwd(), "public", "calendars", `${propertyId}.json`);
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data.blocked) ? data.blocked : [];
  } catch {
    return [];
  }
}

function writeCache(propertyId: string, blocked: BlockedDateRange[]): void {
  try {
    const filePath = path.join(process.cwd(), "public", "calendars", `${propertyId}.json`);
    const data = { updatedAt: new Date().toISOString(), blocked };
    fs.writeFileSync(filePath, JSON.stringify(data));
  } catch {
    // non-fatal
  }
}

export async function fetchBlockedDates(
  icalUrl: string,
  propertyId?: string
): Promise<BlockedDateRange[]> {
  try {
    const data = await ical.async.fromURL(icalUrl);
    const blocked: BlockedDateRange[] = [];

    for (const key of Object.keys(data)) {
      const event = data[key];
      if (event.type !== "VEVENT") continue;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ev = event as any;
      const start = ev.start;
      const end = ev.end;

      if (!start) continue;

      const startStr = formatDate(start);
      const endStr = end ? formatDate(end) : startStr;

      if (startStr && endStr) {
        blocked.push({ start: startStr, end: endStr });
      }
    }

    if (blocked.length > 0) {
      // Fresh data — update the cache for next time
      if (propertyId) writeCache(propertyId, blocked);
      return blocked;
    }

    // iCal returned empty (likely 403) — use last known good cache
    if (propertyId) {
      const cached = readCache(propertyId);
      if (cached.length > 0) return cached;
    }

    return [];
  } catch {
    // On error, fall back to cache
    if (propertyId) {
      const cached = readCache(propertyId);
      if (cached.length > 0) return cached;
    }
    return [];
  }
}
