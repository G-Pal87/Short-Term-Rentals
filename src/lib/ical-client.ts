// Browser-side iCal fetcher — routes through a CORS proxy since Airbnb
// blocks direct browser requests. Falls back silently on any error.

const CORS_PROXY = "https://corsproxy.io/?url=";

export interface BlockedDateRange {
  start: string; // "YYYY-MM-DD"
  end: string;
}

function toDateStr(raw: string): string | null {
  // Strips optional params (e.g. "VALUE=DATE:20260601" → "20260601")
  const digits = raw.replace(/^[^:]*:/, "").trim();
  const m = digits.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!m) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

function parseIcalText(text: string): BlockedDateRange[] {
  const result: BlockedDateRange[] = [];
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

export async function fetchIcalClient(
  icalUrl: string
): Promise<BlockedDateRange[]> {
  try {
    const res = await fetch(`${CORS_PROXY}${encodeURIComponent(icalUrl)}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const text = await res.text();
    return parseIcalText(text);
  } catch {
    return [];
  }
}
