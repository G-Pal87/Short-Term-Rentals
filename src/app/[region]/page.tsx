import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PropertyCard from "@/components/PropertyCard";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import {
  getPropertiesByRegion,
  regionDisplayNames,
  type Region,
} from "@/data/properties";
import { fetchPropertyRates } from "@/lib/rates";

interface RegionPageProps {
  params: { region: string };
}

const VALID_REGIONS: Region[] = ["paphos", "tenerife"];
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const regionMeta: Record<
  Region,
  { tagline: string; description: string; photo?: string; highlights: string[] }
> = {
  paphos: {
    tagline: "Cyprus - Paphos",
    description:
      "Discover ancient ruins, turquoise bays, and warm Mediterranean charm in Paphos, Cyprus.",
    photo: `${basePath}/images/properties/poolside-central-studio/outside_02.jpg`,
    highlights: ["World Heritage site", "Year-round sunshine", "Crystal-clear beaches"],
  },
  tenerife: {
    tagline: "Spain - Tenerife",
    description:
      "Experience the volcanic wonder, lush forests, and year-round sunshine of Tenerife, Spain.",
    highlights: ["Mount Teide volcano", "Eternal spring climate", "Atlantic coastline"],
  },
};

export function generateStaticParams() {
  return VALID_REGIONS.map((region) => ({ region }));
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { region } = params;

  if (!VALID_REGIONS.includes(region as Region)) {
    notFound();
  }

  const typedRegion = region as Region;
  const properties = getPropertiesByRegion(typedRegion);
  const displayName = regionDisplayNames[typedRegion];
  const meta = regionMeta[typedRegion];

  // Fetch live rates for all properties in parallel (same logic as detail page)
  const allRates = await Promise.all(
    properties.map((p) => fetchPropertyRates(p.btPropertyId))
  );
  const minPrices = properties.map((p, i) => {
    const rates = allRates[i];
    const openRates = rates?.openRatesByDate
      ? Object.values(rates.openRatesByDate)
      : [];
    return openRates.length > 0 ? Math.min(...openRates) : p.pricePerNight;
  });

  return (
    <div>
      {/* ── Hero banner ──────────────────────────────────── */}
      <section
        className={`relative py-24 sm:py-32 overflow-hidden ${meta.photo ? "" : "bg-tenerife-gradient"}`}
      >
        {meta.photo && (
          <>
            <Image
              src={meta.photo}
              alt={displayName}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(160deg, rgba(28,55,53,0.9) 0%, rgba(28,55,53,0.72) 50%, rgba(176,96,63,0.5) 100%)",
              }}
            />
          </>
        )}

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path
              d="M0 80L80 66C160 52 320 24 480 18C640 12 800 24 960 30C1120 36 1280 36 1360 36L1440 36V80H1360C1280 80 1120 80 960 80C800 80 640 80 480 80C320 80 160 80 80 80H0Z"
              fill="#FDF8F3"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">{displayName}</span>
          </nav>

          <div className="max-w-2xl">
            {/* Available badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-xs px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" />
              <span className="font-medium">{properties.length} {properties.length === 1 ? "property" : "properties"} available</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              {displayName}
            </h1>
            <p className="text-white/75 text-lg leading-relaxed mb-8">{meta.description}</p>

            {/* Highlights */}
            <div className="flex flex-wrap gap-2">
              {meta.highlights.map((h) => (
                <span key={h} className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                  <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Property grid ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {properties.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-cream-dark flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg mb-4">No properties found for this region.</p>
            <Link href="/" className="text-primary hover:underline font-medium">
              Return to home
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-serif text-2xl font-bold text-gray-900">
                  All properties in {displayName}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {properties.length} listing{properties.length !== 1 ? "s" : ""} · Direct booking available
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property, i) => (
                <AnimateOnScroll key={property.id} delay={i * 80}>
                  <PropertyCard property={property} minPrice={minPrices[i]} />
                </AnimateOnScroll>
              ))}
            </div>
          </>
        )}

        {/* Direct booking callout */}
        <AnimateOnScroll className="mt-16">
          <div className="relative overflow-hidden bg-secondary rounded-3xl p-8 sm:p-10">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3 blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-primary font-semibold text-sm mb-1">Direct booking advantage</p>
                <h3 className="font-serif text-2xl font-bold text-white mb-2">
                  Save up to 20% vs Airbnb
                </h3>
                <p className="text-white/65 text-sm max-w-md leading-relaxed">
                  No platform fees. Deal with us personally - better prices,
                  faster responses, and flexible booking terms.
                </p>
              </div>
              <a
                href="https://wa.me/420731139854"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-lg whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Get best rate
              </a>
            </div>
          </div>
        </AnimateOnScroll>
      </section>
    </div>
  );
}
