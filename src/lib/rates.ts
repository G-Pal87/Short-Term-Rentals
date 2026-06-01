const RAW_BASE =
  "https://raw.githubusercontent.com/G-Pal87/Business-Tracking/main/exports/daily-rates";

export interface PropertyRates {
  ratesByDate: Record<string, number>;      // "YYYY-MM-DD" -> host amount
  airbnbRatesByDate: Record<string, number>; // "YYYY-MM-DD" -> Airbnb checkout price
  openRatesByDate: Record<string, number>;   // "YYYY-MM-DD" -> host amount (open dates only)
  cleaningFee: number;
  currency: string;
}

export async function fetchPropertyRates(
  btPropertyId?: string
): Promise<PropertyRates | null> {
  if (!btPropertyId) return null;

  try {
    const res = await fetch(
      `${RAW_BASE}/${btPropertyId}.json?t=${Date.now()}`
    );
    if (!res.ok) return null;

    const feed = (await res.json()) as {
      property: { currency: string };
      cleaningFee: number;
      rates: { date: string; amount: number; guestAmount?: number; airbnbCheckout?: number; status: string }[];
    };

    if (!Array.isArray(feed.rates) || feed.rates.length === 0) return null;

    const today = new Date().toISOString().slice(0, 10);
    const ratesByDate: Record<string, number> = {};
    const airbnbRatesByDate: Record<string, number> = {};
    const openRatesByDate: Record<string, number> = {};

    for (const r of feed.rates) {
      ratesByDate[r.date] = r.amount;
      const airbnbPrice = r.airbnbCheckout ?? r.guestAmount;
      if (airbnbPrice) airbnbRatesByDate[r.date] = airbnbPrice;
      if (r.status === "open" && r.date >= today) {
        openRatesByDate[r.date] = r.amount;
      }
    }

    return {
      ratesByDate,
      airbnbRatesByDate,
      openRatesByDate,
      cleaningFee: feed.cleaningFee ?? 0,
      currency: feed.property?.currency ?? "EUR",
    };
  } catch {
    return null;
  }
}
