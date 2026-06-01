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

const amenityIcons: Record<string, string> = {
  Pool: "🏊",
  "2 Terraces": "🌅",
  Terrace: "🌅",
  "Beach Walk": "🏖️",
  "Beach Nearby": "🏖️",
  "Near Beach": "🏖️",
  WiFi: "📶",
  AC: "❄️",
  Kitchen: "🍳",
  "Full Kitchen": "🍳",
  Kitchenette: "🍳",
  Parking: "🚗",
  Balcony: "🌿",
  Garden: "🌿",
  "View Terrace": "🌅",
  "Nature Views": "🌲",
};

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { region, propertyId } = params;

  const property = properties.find(
    (p) => p.region === region && p.id === propertyId
  );

  if (!property) {
    notFound();
  }

  // Both fetches run in parallel at build time
  const [calendarData, propertyRates] = await Promise.all([
    fetchBlockedDates(property.icalUrl, property.id),
    fetchPropertyRates(property.btPropertyId),
  ]);
  const { blocked: blockedRanges, syncedAt, fromCache } = calendarData;

  const openRates = propertyRates?.openRatesByDate
    ? Object.values(propertyRates.openRatesByDate)
    : [];
  const minPrice = openRates.length > 0
    ? Math.min(...openRates)
    : property.pricePerNight;

  const displayRegion = regionDisplayNames[property.region as Region];

  return (
    <div className="bg-cream min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <Link
            href={`/${region}`}
            className="hover:text-primary transition-colors"
          >
            {displayRegion}
          </Link>
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="text-gray-900 font-medium truncate max-w-xs">
            {property.name}
          </span>
        </nav>
      </div>

      {/* Photo Gallery */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 h-72 sm:h-96">
          {/* Main large photo */}
          <div
            className="col-span-2 row-span-1 sm:col-span-2 sm:row-span-1 rounded-2xl overflow-hidden"
            style={{ background: property.gradients[0] }}
          >
            <div className="w-full h-full flex items-center justify-center opacity-25">
              <svg
                className="w-20 h-20 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
            </div>
          </div>
          {/* Smaller photos */}
          {property.gradients.slice(1, 4).map((gradient, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{ background: gradient }}
            >
              <div className="w-full h-full flex items-center justify-center opacity-20">
                <svg
                  className="w-12 h-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left column: details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title block */}
            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {property.name}
                  </h1>
                  <p className="text-primary font-medium mt-0.5">
                    {property.subtitle}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{displayRegion}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">From</p>
                  <p className="text-2xl font-bold text-primary">
                    €{minPrice}
                  </p>
                  <p className="text-sm text-gray-500">per night</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="bg-cream-dark text-gray-700 text-sm px-3 py-1 rounded-full">
                  🛏️{" "}
                  {property.bedrooms === 0
                    ? "Studio"
                    : `${property.bedrooms} Bedroom${property.bedrooms > 1 ? "s" : ""}`}
                </span>
                <span className="bg-cream-dark text-gray-700 text-sm px-3 py-1 rounded-full">
                  🚿 {property.bathrooms} Bathroom
                </span>
                <span className="bg-cream-dark text-gray-700 text-sm px-3 py-1 rounded-full">
                  👥 Up to {property.maxGuests} guests
                </span>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-cream-dark" />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                About this property
              </h2>
              <p className="text-gray-600 leading-relaxed text-base">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2.5 bg-white border border-cream-dark rounded-xl px-3 py-2.5 text-sm text-gray-700"
                  >
                    <span className="text-xl">
                      {amenityIcons[amenity] || "✓"}
                    </span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Location
              </h2>
              <GoogleMapEmbed
                lat={property.lat}
                lng={property.lng}
                title={property.name}
              />
              <p className="text-xs text-gray-400 mt-2 text-center">
                Exact address provided after booking confirmation
              </p>
            </div>
          </div>

          {/* Right column: booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <BookingPanel
                propertyName={property.name}
                pricePerNight={property.pricePerNight}
                blockedRanges={blockedRanges}
                propertyId={property.id}
                ratesByDate={propertyRates?.ratesByDate}
                airbnbRatesByDate={propertyRates?.airbnbRatesByDate}
                cleaningFee={propertyRates?.cleaningFee}
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
