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

const RETRY_DELAYS_MS = [2000, 5000, 10000]; // 3 attempts after first try = 4 total

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function tryFetchIcal(icalUrl: string): Promise<BlockedDateRange[] | null> {
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

  // Empty result likely means a 403 — treat as failure so we can retry
  return blocked.length > 0 ? blocked : null;
}

export async function fetchBlockedDates(
  icalUrl: string,
  propertyId?: string
): Promise<CalendarData> {
  const now = new Date().toISOString();

  let lastError: unknown;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    if (attempt > 0) {
      await sleep(RETRY_DELAYS_MS[attempt - 1]);
    }
    try {
      const blocked = await tryFetchIcal(icalUrl);
      if (blocked) {
        if (propertyId) writeCache(propertyId, blocked);
        return { blocked, syncedAt: now, fromCache: false };
      }
    } catch (err) {
      lastError = err;
    }
  }

  // All attempts exhausted — fall back to cache
  void lastError;
  if (propertyId) {
    const cache = readCacheRaw(propertyId);
    if (cache && cache.blocked.length > 0) {
      return { blocked: cache.blocked, syncedAt: cache.updatedAt ?? now, fromCache: true };
    }
  }
  return { blocked: [], syncedAt: now, fromCache: false };
}
