import Link from "next/link";
import Image from "next/image";
import type { Property } from "@/data/properties";
import { regionDisplayNames } from "@/data/properties";

interface PropertyCardProps {
  property: Property;
  minPrice?: number;
}

function BedIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 10V7a2 2 0 012-2h2m-4 5v7a2 2 0 002 2h14a2 2 0 002-2v-7M7 5V4a1 1 0 011-1h2a1 1 0 011 1v1" />
    </svg>
  );
}

function GuestsIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export default function PropertyCard({ property, minPrice }: PropertyCardProps) {
  const { id, name, subtitle, region, bedrooms, bathrooms, maxGuests, pricePerNight, gradients, images } = property;
  const displayPrice = minPrice ?? pricePerNight;
  const href = `/${region}/${id}`;
  const heroGradient = gradients[0];
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const heroImage = images?.[0]
    ? `${basePath}/images/properties/${id}/${images[0]}`
    : null;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1.5 border border-cream-dark/60">
      {/* Image / gradient area */}
      <Link href={href} className="block relative h-60 overflow-hidden">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <>
            {/* Gradient placeholder with zoom on hover */}
            <div
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
              style={{ background: heroGradient }}
            />
            {/* Subtle wave pattern */}
            <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
              <svg className="absolute -bottom-4 -left-4 w-48 h-48 text-white" fill="currentColor" viewBox="0 0 200 200">
                <path d="M0 100 Q25 80 50 100 Q75 120 100 100 Q125 80 150 100 Q175 120 200 100 L200 200 L0 200 Z" opacity="0.3" />
                <path d="M0 130 Q25 110 50 130 Q75 150 100 130 Q125 110 150 130 Q175 150 200 130 L200 200 L0 200 Z" opacity="0.2" />
              </svg>
              <div className="absolute top-6 right-6 w-20 h-20 rounded-full border-2 border-white/40" />
              <div className="absolute top-10 right-10 w-12 h-12 rounded-full border border-white/30" />
            </div>
          </>
        )}

        {/* Text readability overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

        {/* Region badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-white/90 backdrop-blur-sm text-secondary text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            {regionDisplayNames[region]}
          </span>
        </div>

        {/* Price badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-primary text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-sm">
            From €{displayPrice}
            <span className="text-xs font-normal opacity-90">/night</span>
          </span>
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3 className="font-serif text-xl font-bold text-white leading-snug drop-shadow-sm">
            {name}
          </h3>
          <p className="text-white/75 text-sm mt-0.5">{subtitle}</p>
        </div>
      </Link>

      {/* Card body */}
      <div className="p-4 pt-3.5">
        {/* Stats row */}
        <div className="flex items-center justify-between text-sm text-gray-500 pb-3.5 border-b border-cream-dark">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs">
              <BedIcon />
              <span>{bedrooms === 0 ? "Studio" : `${bedrooms} bed`}</span>
            </span>
            <span className="text-gray-200">|</span>
            <span className="flex items-center gap-1.5 text-xs">
              <BathIcon />
              <span>{bathrooms} bath</span>
            </span>
            <span className="text-gray-200">|</span>
            <span className="flex items-center gap-1.5 text-xs">
              <GuestsIcon />
              <span>Up to {maxGuests}</span>
            </span>
          </div>
          {/* Stars */}
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gold fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-semibold text-gray-700">4.9</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={href}
          className="mt-3.5 flex items-center justify-center gap-2 w-full bg-secondary hover:bg-secondary-dark text-white py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-md group/btn"
        >
          View Property
          <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
