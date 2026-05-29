const RAW_BASE =
  "https://raw.githubusercontent.com/G-Pal87/Business-Tracking/main/exports/daily-rates";

export interface PropertyRates {
  ratesByDate: Record<string, number>; // "YYYY-MM-DD" -> guestAmount
  cleaningFee: number;
  currency: string;
}

function extractListingId(icalUrl: string): string | null {
  const m = icalUrl.match(/ical\/(\d+)\.ics/);
  return m ? m[1] : null;
}

export async function fetchPropertyRates(
  icalUrl: string,
  btPropertyId?: string
): Promise<PropertyRates | null> {
  try {
    // Fetch index — bust cache so each build gets fresh data
    const indexRes = await fetch(`${RAW_BASE}/index.json?t=${Date.now()}`, {
      next: { revalidate: 0 },
    });
    if (!indexRes.ok) return null;

    const index = (await indexRes.json()) as {
      properties: { id: string; file: string }[];
    };

    let feedFile: string | undefined;

    if (btPropertyId) {
      // Direct override — skip matching
      feedFile = `${btPropertyId}.json`;
    } else {
      const listingId = extractListingId(icalUrl);
      if (!listingId) return null;

      // Find the feed whose airbnbCalUrl contains the same listing id
      for (const entry of index.properties) {
        const feedRes = await fetch(`${RAW_BASE}/${entry.file}?t=${Date.now()}`, {
          next: { revalidate: 0 },
        });
        if (!feedRes.ok) continue;

        const feed = (await feedRes.json()) as {
          property: { airbnbCalUrl: string };
          cleaningGuestTotal: number;
          currency: string;
          rates: { date: string; guestAmount: number }[];
        };

        const feedListingId = extractListingId(
          feed.property?.airbnbCalUrl ?? ""
        );
        if (feedListingId && feedListingId === listingId) {
          const ratesByDate: Record<string, number> = {};
          for (const r of feed.rates) {
            ratesByDate[r.date] = r.guestAmount;
          }
          return {
            ratesByDate,
            cleaningFee: feed.cleaningGuestTotal ?? 0,
            currency: feed.currency ?? "EUR",
          };
        }
      }
      return null; // no match found
    }

    // btPropertyId path — fetch file directly
    const feedRes = await fetch(`${RAW_BASE}/${feedFile}?t=${Date.now()}`, {
      next: { revalidate: 0 },
    });
    if (!feedRes.ok) return null;

    const feed = (await feedRes.json()) as {
      cleaningGuestTotal: number;
      currency: string;
      rates: { date: string; guestAmount: number }[];
    };

    const ratesByDate: Record<string, number> = {};
    for (const r of feed.rates) {
      ratesByDate[r.date] = r.guestAmount;
    }
    return {
      ratesByDate,
      cleaningFee: feed.cleaningGuestTotal ?? 0,
      currency: feed.currency ?? "EUR",
    };
  } catch {
    return null;
  }
}
