// Client-side calendar fetch - reads pre-parsed JSON from the same domain
// (gh-pages/calendars/{id}.json, written hourly by the sync-calendars workflow).
// No CORS issues, no third-party proxy dependency.

const BASE_PATH = "/Short-Term-Rentals";

export interface BlockedDateRange {
  start: string; // "YYYY-MM-DD"
  end: string;
}

export async function fetchIcalClient(
  propertyId: string
): Promise<BlockedDateRange[]> {
  try {
    const res = await fetch(
      `${BASE_PATH}/calendars/${propertyId}.json?t=${Date.now()}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as {
      blocked: BlockedDateRange[];
      updatedAt?: string;
    };
    return Array.isArray(data.blocked) ? data.blocked : [];
  } catch {
    return [];
  }
}
