import fs from "fs";
import path from "path";
import type { BlockedDateRange } from "@/lib/availability";

// Reads the calendar deploy.yml fetched from Airbnb and parsed into
// public/calendars/<id>.json before the build. The build itself never talks
// to Airbnb and never sees the calendar links.

// Calendars older than this were kept from the live site because Airbnb
// couldn't be reached (see keep_live in deploy.yml).
const STALE_AFTER_MS = 12 * 60 * 60 * 1000;

export type CalendarStatus = "live" | "stale" | "missing";

export interface CalendarData {
  blocked: BlockedDateRange[];
  syncedAt: string | null; // when Airbnb was last read successfully
  status: CalendarStatus;
}

export function readCalendar(propertyId: string): CalendarData {
  try {
    const filePath = path.join(process.cwd(), "public", "calendars", `${propertyId}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (!Array.isArray(data.blocked)) return { blocked: [], syncedAt: null, status: "missing" };
    const syncedAt = typeof data.updatedAt === "string" ? data.updatedAt : null;
    const age = syncedAt ? Date.now() - Date.parse(syncedAt) : Infinity;
    return {
      blocked: data.blocked,
      syncedAt,
      status: age <= STALE_AFTER_MS ? "live" : "stale",
    };
  } catch {
    return { blocked: [], syncedAt: null, status: "missing" };
  }
}
