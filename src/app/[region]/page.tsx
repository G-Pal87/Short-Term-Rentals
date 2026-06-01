import { notFound } from "next/navigation";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import {
  getPropertiesByRegion,
  regionDisplayNames,
  type Region,
} from "@/data/properties";

interface RegionPageProps {
  params: { region: string };
}

const VALID_REGIONS: Region[] = ["paphos", "tenerife"];

const regionMeta: Record<
  Region,
  { emoji: string; tagline: string; gradient: string }
> = {
  paphos: {
    emoji: "🏛️",
    tagline:
      "Discover ancient ruins, turquoise bays, and warm Mediterranean charm in Paphos, Cyprus.",
    gradient:
      "linear-gradient(135deg, #2C7BA3 0%, #1a5a7a 50%, #E8845A 100%)",
  },
  tenerife: {
    emoji: "🌋",
    tagline:
      "Experience the volcanic wonder, lush forests, and year-round sunshine of Tenerife, Spain.",
    gradient:
      "linear-gradient(135deg, #E8845A 0%, #c4623e 50%, #2C5F5A 100%)",
  },
};

export function generateStaticParams() {
  return VALID_REGIONS.map((region) => ({ region }));
}

export default function RegionPage({ params }: RegionPageProps) {
  const { region } = params;

  if (!VALID_REGIONS.includes(region as Region)) {
    notFound();
  }

  const typedRegion = region as Region;
  const properties = getPropertiesByRegion(typedRegion);
  const displayName = regionDisplayNames[typedRegion];
  const meta = regionMeta[typedRegion];

  return (
    <div>
      {/* Hero banner */}
      <section
        className="relative py-20 sm:py-28"
        style={{ background: meta.gradient }}
      >
        <div className="absolute inset-0 bg-black/15" />

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 80L60 66.7C120 53.3 240 26.7 360 20C480 13.3 600 26.7 720 33.3C840 40 960 40 1080 43.3C1200 46.7 1320 53.3 1380 56.7L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
              fill="#FDF8F3"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/70 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">
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
            <span className="text-white">{displayName}</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{meta.emoji}</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              {displayName}
            </h1>
          </div>
          <p className="text-white/85 text-lg max-w-2xl">{meta.tagline}</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            {properties.length}{" "}
            {properties.length === 1 ? "property" : "properties"} available
          </div>
        </div>
      </section>

      {/* Property grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {properties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No properties found for this region.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-primary hover:underline"
            >
              Return to home
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-gray-900">
                All properties in {displayName}
              </h2>
              <span className="text-sm text-gray-500">
                {properties.length} listing{properties.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}

        {/* Direct booking callout */}
        <div className="mt-12 bg-primary/10 border border-primary/20 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">
            💰 Why pay more?
          </h3>
          <p className="text-gray-600 text-sm">
            Booking direct means you deal with us personally — better prices, faster responses, no platform fees.
          </p>
        </div>
      </section>
    </div>
  );
}
