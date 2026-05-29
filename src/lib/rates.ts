const RAW_BASE =
  "https://raw.githubusercontent.com/G-Pal87/Business-Tracking/main/exports/daily-rates";

export interface PropertyRates {
  ratesByDate: Record<string, number>; // "YYYY-MM-DD" -> guestAmount
  cleaningFee: number;
  currency: string;
}

export async function fetchPropertyRates(
  btPropertyId?: string
): Promise<PropertyRates | null> {
  if (!btPropertyId) return null;

  try {
    const res = await fetch(
      `${RAW_BASE}/${btPropertyId}.json?t=${Date.now()}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;

    const feed = (await res.json()) as {
      property: { currency: string };
      cleaningGuestTotal: number;
      rates: { date: string; guestAmount: number }[];
    };

    // Empty rates array means feed exists but has no pricing yet — fall back
    if (!Array.isArray(feed.rates) || feed.rates.length === 0) return null;

    const ratesByDate: Record<string, number> = {};
    for (const r of feed.rates) {
      ratesByDate[r.date] = r.guestAmount;
    }

    return {
      ratesByDate,
      cleaningFee: feed.cleaningGuestTotal ?? 0,
      currency: feed.property?.currency ?? "EUR",
    };
  } catch {
    return null;
  }
}
