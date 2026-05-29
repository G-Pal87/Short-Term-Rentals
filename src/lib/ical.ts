import ical from "node-ical";
import { format, parseISO, isValid } from "date-fns";
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

export async function fetchBlockedDates(
  icalUrl: string
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

    return blocked;
  } catch {
    // Gracefully handle network errors, CORS issues, or parse failures
    return [];
  }
}
