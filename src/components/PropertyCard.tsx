import Link from "next/link";
import type { Property } from "@/data/properties";
import { regionDisplayNames } from "@/data/properties";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const {
    id,
    name,
    subtitle,
    region,
    bedrooms,
    bathrooms,
    maxGuests,
    pricePerNight,
    gradients,
  } = property;

  const href = `/${region}/${id}`;
  const heroGradient = gradients[0];

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-cream-dark">
      {/* Gradient image placeholder */}
      <Link href={href} className="block">
        <div
          className="h-52 w-full relative overflow-hidden"
          style={{ background: heroGradient }}
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <svg
              className="w-24 h-24 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          {/* Region badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-secondary text-xs font-semibold px-2 py-1 rounded-full">
              {regionDisplayNames[region]}
            </span>
          </div>
          {/* Price badge */}
          <div className="absolute bottom-3 right-3">
            <span className="bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
              €{pricePerNight}/night
            </span>
          </div>
        </div>
      </Link>

      {/* Card body */}
      <div className="p-5">
        <Link href={href} className="block group">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors leading-snug">
            {name}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
        </Link>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="inline-flex items-center gap-1 bg-cream-dark text-gray-700 text-xs px-2.5 py-1 rounded-full">
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
            </svg>
            {bedrooms === 0 ? "Studio" : `${bedrooms} bed`}
          </span>
          <span className="inline-flex items-center gap-1 bg-cream-dark text-gray-700 text-xs px-2.5 py-1 rounded-full">
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
              <path d="M8 11h8v2H8z" />
            </svg>
            {bathrooms} bath
          </span>
          <span className="inline-flex items-center gap-1 bg-cream-dark text-gray-700 text-xs px-2.5 py-1 rounded-full">
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            Up to {maxGuests} guests
          </span>
        </div>

        {/* CTA */}
        <Link
          href={href}
          className="mt-4 block w-full text-center bg-secondary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary-dark transition-colors"
        >
          View Property
        </Link>
      </div>
    </div>
  );
}
