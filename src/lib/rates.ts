// RATES_FEED_BASE lets a local/test build point at another copy of the feeds.
const RAW_BASE =
  process.env.RATES_FEED_BASE ||
  "https://raw.githubusercontent.com/G-Pal87/Business-Tracking/rates-feed/exports/daily-rates";

export interface PropertyRates {
  /**
   * false when prices are hidden for this property in Business-Tracking
   * (per property, or all properties at once). The feed then carries no
   * amounts at all, and every page must show "Price on request" instead of
   * a price - including the static pricePerNight fallback.
   */
  showPrices: boolean;
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
      showPrices?: boolean;
      cleaningFee?: number;
      rates: { date: string; amount?: number; guestAmount?: number; airbnbCheckout?: number; status: string }[];
    };

    // Older feeds have no showPrices field: treat as shown.
    const showPrices = feed.showPrices !== false;
    if (!showPrices) {
      return {
        showPrices: false,
        ratesByDate: {},
        airbnbRatesByDate: {},
        openRatesByDate: {},
        cleaningFee: 0,
        currency: feed.property?.currency ?? "EUR",
      };
    }

    if (!Array.isArray(feed.rates) || feed.rates.length === 0) return null;

    const today = new Date().toISOString().slice(0, 10);
    const ratesByDate: Record<string, number> = {};
    const airbnbRatesByDate: Record<string, number> = {};
    const openRatesByDate: Record<string, number> = {};

    for (const r of feed.rates) {
      // Unavailable (booked/blocked) nights carry no amount.
      if (typeof r.amount !== "number") continue;
      ratesByDate[r.date] = r.amount;
      const airbnbPrice = r.airbnbCheckout ?? r.guestAmount;
      if (airbnbPrice) airbnbRatesByDate[r.date] = airbnbPrice;
      if (r.status === "open" && r.date >= today) {
        openRatesByDate[r.date] = r.amount;
      }
    }

    return {
      showPrices: true,
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

/**
 * Cheapest open rate within the next `days` days (default 90).
 * Scoped to a near-term window so a single thin-data extrapolated rate far in
 * the future (the feed's rates are model-extrapolated from limited history)
 * can't drag down the advertised "from" price shown today.
 */
export function nearTermMinRate(
  openRatesByDate: Record<string, number> | undefined,
  days = 90
): { price: number; date: string } | null {
  if (!openRatesByDate) return null;

  const today = new Date().toISOString().slice(0, 10);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const entries = Object.entries(openRatesByDate).filter(
    ([date]) => date >= today && date <= cutoffStr
  );
  if (entries.length === 0) return null;

  const [minDate, minPrice] = entries.reduce((best, cur) => (cur[1] < best[1] ? cur : best));
  return { price: minPrice, date: minDate };
}
