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

export interface CalendarData {
  blocked: BlockedDateRange[];
  syncedAt: string;   // ISO timestamp of when data was fetched
  fromCache: boolean; // true if Airbnb was unreachable and cache was used
}

function readCacheRaw(propertyId: string): { blocked: BlockedDateRange[]; updatedAt?: string } | null {
  try {
    const filePath = path.join(process.cwd(), "public", "calendars", `${propertyId}.json`);
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data.blocked) ? data : null;
  } catch {
    return null;
  }
}

export async function fetchBlockedDates(
  icalUrl: string,
  propertyId?: string
): Promise<CalendarData> {
  const now = new Date().toISOString();
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
      if (propertyId) writeCache(propertyId, blocked);
      return { blocked, syncedAt: now, fromCache: false };
    }

    // iCal returned empty (likely 403) — fall back to cache
    if (propertyId) {
      const cache = readCacheRaw(propertyId);
      if (cache && cache.blocked.length > 0) {
        return { blocked: cache.blocked, syncedAt: cache.updatedAt ?? now, fromCache: true };
      }
    }

    return { blocked: [], syncedAt: now, fromCache: false };
  } catch {
    if (propertyId) {
      const cache = readCacheRaw(propertyId);
      if (cache && cache.blocked.length > 0) {
        return { blocked: cache.blocked, syncedAt: cache.updatedAt ?? now, fromCache: true };
      }
    }
    return { blocked: [], syncedAt: now, fromCache: false };
  }
}
