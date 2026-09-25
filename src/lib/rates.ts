import { addDays, format, parseISO } from "date-fns";

// RATES_FEED_BASE lets a local/test build point at another copy of the feeds.
const RAW_BASE =
  process.env.RATES_FEED_BASE ||
  "https://raw.githubusercontent.com/G-Pal87/Business-Tracking/rates-feed/exports/daily-rates";

// A build without the feed must not publish wrong prices, so an unreachable
// feed fails the build (the previous deploy stays live). RATES_ALLOW_MISSING=1
// lets an offline local build through, with every price hidden.
const ALLOW_MISSING = process.env.RATES_ALLOW_MISSING === "1";

// One cache-buster per build process, so repeat fetches of the same feed
// (home, region and property pages) are deduplicated by Next's fetch cache.
const BUILD_STAMP = Date.now();
const FETCH_TIMEOUT_MS = 20_000;
const RETRY_DELAYS_MS = [2_000, 5_000];

export interface PropertyRates {
  /**
   * false when prices are hidden for this property in Business-Tracking
   * (per property, or all properties at once). The feed then carries no
   * amounts at all, and every page must show "Price on request" instead.
   */
  showPrices: boolean;
  ratesByDate: Record<string, number>;      // "YYYY-MM-DD" -> host amount
  airbnbRatesByDate: Record<string, number>; // "YYYY-MM-DD" -> Airbnb checkout price
  openRatesByDate: Record<string, number>;   // "YYYY-MM-DD" -> host amount (open dates only)
  cleaningFee: number;
  currency: string;
}

interface Feed {
  property: { currency: string };
  showPrices?: boolean;
  cleaningFee?: number;
  rates: { date: string; amount?: number; guestAmount?: number; airbnbCheckout?: number; status: string }[];
}

const HIDDEN: PropertyRates = {
  showPrices: false,
  ratesByDate: {},
  airbnbRatesByDate: {},
  openRatesByDate: {},
  cleaningFee: 0,
  currency: "EUR",
};

/** Today's date ("YYYY-MM-DD") in the given IANA time zone. */
export function todayIn(timeZone: string): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(new Date());
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchFeed(btPropertyId: string): Promise<Feed> {
  const url = `${RAW_BASE}/${btPropertyId}.json?t=${BUILD_STAMP}`;
  let lastError: unknown;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    if (attempt > 0) await sleep(RETRY_DELAYS_MS[attempt - 1]);
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as Feed;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

async function loadPropertyRates(btPropertyId: string, timeZone: string): Promise<PropertyRates> {
  let feed: Feed;
  try {
    feed = await fetchFeed(btPropertyId);
  } catch (err) {
    if (ALLOW_MISSING) return HIDDEN;
    throw new Error(
      `Rates feed for ${btPropertyId} could not be read (${String(err)}). ` +
        "Set RATES_ALLOW_MISSING=1 for an offline build with prices hidden."
    );
  }

  const currency = feed.property?.currency ?? "EUR";
  // Older feeds have no showPrices field: treat as shown.
  if (feed.showPrices === false) return { ...HIDDEN, currency };

  if (!Array.isArray(feed.rates) || feed.rates.length === 0) {
    if (ALLOW_MISSING) return { ...HIDDEN, currency };
    throw new Error(`Rates feed for ${btPropertyId} has no rates.`);
  }

  const today = todayIn(timeZone);
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
    currency,
  };
}

const cache = new Map<string, Promise<PropertyRates>>();

/**
 * Rates for one property, or null when it has no Business-Tracking feed
 * (then no price is shown for it anywhere). Throws when the feed can't be
 * read - see ALLOW_MISSING above.
 */
export function fetchPropertyRates(
  btPropertyId: string | undefined,
  timeZone: string
): Promise<PropertyRates | null> {
  if (!btPropertyId) return Promise.resolve(null);
  const key = `${btPropertyId}|${timeZone}`;
  let rates = cache.get(key);
  if (!rates) {
    rates = loadPropertyRates(btPropertyId, timeZone);
    cache.set(key, rates);
  }
  return rates;
}

/**
 * Cheapest open rate within the next `days` days (default 90), counted from
 * `today` in the property's time zone.
 * Scoped to a near-term window so a single thin-data extrapolated rate far in
 * the future (the feed's rates are model-extrapolated from limited history)
 * can't drag down the advertised "from" price shown today.
 */
export function nearTermMinRate(
  openRatesByDate: Record<string, number> | undefined,
  today: string,
  days = 90
): { price: number; date: string } | null {
  if (!openRatesByDate) return null;

  const cutoff = format(addDays(parseISO(today), days), "yyyy-MM-dd");
  const entries = Object.entries(openRatesByDate).filter(
    ([date]) => date >= today && date <= cutoff
  );
  if (entries.length === 0) return null;

  const [minDate, minPrice] = entries.reduce((best, cur) => (cur[1] < best[1] ? cur : best));
  return { price: minPrice, date: minDate };
}

/**
 * The "From €X/night" price advertised for a property: the near-term
 * minimum, widening to a year when the next 90 days are fully booked. null
 * when prices are hidden or nothing is open - show "Price on request".
 */
export function advertisedMinRate(
  rates: PropertyRates | null,
  timeZone: string
): { price: number; date: string } | null {
  if (!rates?.showPrices) return null;
  const today = todayIn(timeZone);
  return (
    nearTermMinRate(rates.openRatesByDate, today, 90) ??
    nearTermMinRate(rates.openRatesByDate, today, 365)
  );
}
