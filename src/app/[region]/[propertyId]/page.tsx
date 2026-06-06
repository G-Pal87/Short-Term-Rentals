import { notFound } from "next/navigation";
import Link from "next/link";
import GoogleMapEmbed from "@/components/GoogleMapEmbed";
import BookingPanel from "@/components/BookingPanel";
import {
  properties,
  regionDisplayNames,
  type Region,
} from "@/data/properties";
import { fetchBlockedDates } from "@/lib/ical";
import { fetchPropertyRates } from "@/lib/rates";

interface PropertyPageProps {
  params: { region: string; propertyId: string };
}

export function generateStaticParams() {
  return properties.map((p) => ({ region: p.region, propertyId: p.id }));
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const property = properties.find(
    (p) => p.region === params.region && p.id === params.propertyId
  );
  if (!property) return {};
  return {
    title: `${property.name} — ${regionDisplayNames[property.region as Region]}`,
    description: property.description.slice(0, 160),
  };
}

// SVG amenity icons
const amenityIcons: Record<string, React.ReactNode> = {
  Pool: (
    <svg className="w-4.5 h-4.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 17c1.667-1.333 3.333-1.333 5 0s3.333 1.333 5 0 3.333-1.333 5 0M3 12c1.667-1.333 3.333-1.333 5 0s3.333 1.333 5 0 3.333-1.333 5 0M12 3v6m-3-3l3-3 3 3" />
    </svg>
  ),
  WiFi: (
    <svg className="w-4.5 h-4.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
    </svg>
  ),
  AC: (
    <svg className="w-4.5 h-4.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M18.364 5.636L5.636 18.364" />
    </svg>
  ),
  Kitchen: (
    <svg className="w-4.5 h-4.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h1M9 11h1M9 15h1M9 19h1m4-12h1m-1 4h1m-1 4h1m-1 4h1M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
    </svg>
  ),
  "Full Kitchen": (
    <svg className="w-4.5 h-4.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h1M9 11h1M9 15h1M9 19h1m4-12h1m-1 4h1m-1 4h1m-1 4h1M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
    </svg>
  ),
  Kitchenette: (
    <svg className="w-4.5 h-4.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  ),
  Parking: (
    <svg className="w-4.5 h-4.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h3.5a2.5 2.5 0 010 5H8m0-5v10m0-10V5m0 12v2" />
      <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Balcony: (
    <svg className="w-4.5 h-4.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 19h18M5 19V9l7-6 7 6v10M9 19v-6h6v6" />
    </svg>
  ),
  Terrace: (
    <svg className="w-4.5 h-4.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 19h18M5 19V9l7-6 7 6v10M9 19v-6h6v6" />
    </svg>
  ),
  "2 Terraces": (
    <svg className="w-4.5 h-4.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 19h18M5 19V9l7-6 7 6v10M9 19v-6h6v6" />
    </svg>
  ),
  "View Terrace": (
    <svg className="w-4.5 h-4.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  "Beach Walk": (
    <svg className="w-4.5 h-4.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  "Beach Nearby": (
    <svg className="w-4.5 h-4.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 17c1.667-1.333 3.333-1.333 5 0s3.333 1.333 5 0 3.333-1.333 5 0M7.5 10l1-5 3.5 3L16 3l.5 5" />
    </svg>
  ),
  "Near Beach": (
    <svg className="w-4.5 h-4.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 17c1.667-1.333 3.333-1.333 5 0s3.333 1.333 5 0 3.333-1.333 5 0M7.5 10l1-5 3.5 3L16 3l.5 5" />
    </svg>
  ),
  Garden: (
    <svg className="w-4.5 h-4.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V11M12 11C12 8 9 5 6 5s-6 3-3 6c.5.86 1.29 1.5 2 2 2 1 3 2 3 4M12 11c0-3 3-6 6-6s6 3 3 6c-.5.86-1.29 1.5-2 2-2 1-3 2-3 4" />
    </svg>
  ),
  "Nature Views": (
    <svg className="w-4.5 h-4.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 21l10-18 10 18H2zm4.5 0l5.5-9.9L17.5 21" />
    </svg>
  ),
};

const defaultAmenityIcon = (
  <svg className="w-4.5 h-4.5" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { region, propertyId } = params;

  const property = properties.find(
    (p) => p.region === region && p.id === propertyId
  );

  if (!property) {
    notFound();
  }

  const [calendarData, propertyRates] = await Promise.all([
    fetchBlockedDates(property.icalUrl, property.id),
    fetchPropertyRates(property.btPropertyId),
  ]);
  const { blocked: blockedRanges, syncedAt, fromCache } = calendarData;

  let minPrice = property.pricePerNight;
  let minPriceMonth: string | null = null;

  if (propertyRates?.openRatesByDate) {
    const entries = Object.entries(propertyRates.openRatesByDate);
    if (entries.length > 0) {
      const [minDate, minRate] = entries.reduce((best, cur) =>
        cur[1] < best[1] ? cur : best
      );
      minPrice = minRate;
      const [y, m] = minDate.split("-").map(Number);
      minPriceMonth = new Date(y, m - 1, 1).toLocaleString("default", { month: "long" });
    }
  }

  const displayRegion = regionDisplayNames[property.region as Region];

  return (
    <div className="bg-cream min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href={`/${region}`} className="hover:text-primary transition-colors">
            {displayRegion}
          </Link>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-700 font-medium truncate max-w-xs">{property.name}</span>
        </nav>
      </div>

      {/* ── Photo Gallery ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-4 gap-2.5 h-72 sm:h-[420px] rounded-2xl overflow-hidden">
          {/* Main large photo */}
          <div
            className="col-span-4 sm:col-span-2 relative overflow-hidden"
            style={{ background: property.gradients[0] }}
          >
            <div className="absolute inset-0 opacity-10">
              <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 600 300" fill="none">
                <ellipse cx="300" cy="280" rx="350" ry="100" fill="rgba(255,255,255,0.2)" />
              </svg>
              <div className="absolute top-8 right-8 w-32 h-32 rounded-full border-2 border-white/50" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <span className="text-xs font-semibold bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg">Main view</span>
            </div>
          </div>

          {/* Smaller thumbnails */}
          <div className="hidden sm:grid sm:col-span-2 grid-cols-2 gap-2.5">
            {property.gradients.slice(1, 5).map((gradient, i) => (
              <div
                key={i}
                className="relative overflow-hidden"
                style={{ background: gradient }}
              >
                <div className="absolute inset-0 opacity-8">
                  <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full border border-white/30" />
                </div>
                {i === 2 && property.gradients.length > 5 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">+{property.gradients.length - 4} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Left column: details ────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Title block */}
            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    {property.name}
                  </h1>
                  <p className="text-primary font-medium mt-1 text-base">{property.subtitle}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-400">{displayRegion}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-widest">From</p>
                  <p className="font-serif text-3xl font-bold text-primary">€{minPrice}</p>
                  <p className="text-xs text-gray-400">
                    per night{minPriceMonth ? ` in ${minPriceMonth}` : ""}
                  </p>
                </div>
              </div>

              {/* Quick stats badges */}
              <div className="flex flex-wrap gap-2 mt-5">
                {[
                  {
                    label: property.bedrooms === 0 ? "Studio" : `${property.bedrooms} Bedroom${property.bedrooms > 1 ? "s" : ""}`,
                    icon: (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    ),
                  },
                  {
                    label: `${property.bathrooms} Bathroom`,
                    icon: (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 10V7a2 2 0 012-2h2m-4 5v7a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      </svg>
                    ),
                  },
                  {
                    label: `Up to ${property.maxGuests} guests`,
                    icon: (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ),
                  },
                ].map((badge) => (
                  <span
                    key={badge.label}
                    className="inline-flex items-center gap-2 bg-white border border-cream-dark text-gray-700 text-sm px-4 py-2 rounded-full shadow-sm"
                  >
                    <span className="text-secondary">{badge.icon}</span>
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>

            <hr className="border-cream-dark" />

            {/* Description */}
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">
                About this property
              </h2>
              <p className="text-gray-600 leading-relaxed text-base">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-5">
                What&apos;s included
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 bg-white border border-cream-dark rounded-xl px-4 py-3 text-sm text-gray-700 hover:border-secondary/20 hover:bg-secondary/3 transition-colors"
                  >
                    <span className="text-secondary flex-shrink-0">
                      {amenityIcons[amenity] ?? defaultAmenityIcon}
                    </span>
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust banner */}
            <div className="bg-primary/8 border border-primary/15 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Verified direct booking</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Book directly with the host for the best rate. No platform fees, no middlemen.
                    Flexible check-in times available on request.
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">
                Location
              </h2>
              <div className="rounded-2xl overflow-hidden shadow-sm border border-cream-dark">
                <GoogleMapEmbed
                  lat={property.lat}
                  lng={property.lng}
                  title={property.name}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Exact address provided after booking confirmation
              </p>
            </div>
          </div>

          {/* ── Right column: booking ──────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <BookingPanel
                propertyName={property.name}
                pricePerNight={property.pricePerNight}
                blockedRanges={blockedRanges}
                propertyId={property.id}
                ratesByDate={propertyRates?.ratesByDate}
                airbnbRatesByDate={propertyRates?.airbnbRatesByDate}
                cleaningFee={propertyRates?.cleaningFee ?? property.cleaningFee}
                calendarSyncedAt={syncedAt}
                calendarFromCache={fromCache}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
