import type { Property, Region } from "@/data/properties";
import { SITE_URL, SITE_NAME } from "@/lib/site";

// Town-level address only - matches the site's "exact address after booking
// confirmation" policy. Tenerife locality is the address the property owner
// provided when the map coordinates were set up (not derived/guessed here).
const REGION_ADDRESS: Record<Region, { addressLocality: string; postalCode?: string; addressRegion: string; addressCountry: string }> = {
  paphos: {
    addressLocality: "Paphos",
    addressRegion: "Paphos District",
    addressCountry: "CY",
  },
  tenerife: {
    addressLocality: "Santa Cruz de Tenerife",
    postalCode: "38150",
    addressRegion: "Santa Cruz de Tenerife",
    addressCountry: "ES",
  },
};

export function vacationRentalSchema(
  property: Property,
  approxLocation: { lat: number; lng: number },
  minPrice: number
) {
  const url = `${SITE_URL}/${property.region}/${property.id}/`;
  const images = (property.images ?? []).map(
    (f) => `${SITE_URL}/images/properties/${property.id}/${f}`
  );

  return {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: property.name,
    description: property.metaDescription,
    url,
    image: images.length > 0 ? images : undefined,
    address: {
      "@type": "PostalAddress",
      ...REGION_ADDRESS[property.region],
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: approxLocation.lat,
      longitude: approxLocation.lng,
    },
    numberOfRooms: property.bedrooms > 0 ? property.bedrooms : undefined,
    numberOfBathroomsTotal: property.bathrooms,
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: property.maxGuests,
    },
    amenityFeature: property.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
    priceRange: `From €${minPrice}/night`,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function organizationSchema(whatsappNumber: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/apple-icon.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${whatsappNumber}`,
      contactType: "customer service",
    },
  };
}
