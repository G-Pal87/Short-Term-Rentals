// Airbnb calendar-sync URLs embed a secret token, so they're kept out of the
// public source tree (src/data/properties.ts) and read from the build
// environment instead. Set these as GitHub Actions repo secrets.
const ICAL_ENV_VAR: Record<string, string> = {
  "venus-beach-retreat": "AIRBNB_ICAL_VENUS_BEACH_RETREAT",
  "luxe-poolside-escape": "AIRBNB_ICAL_LUXE_POOLSIDE_ESCAPE",
  "poolside-central-studio": "AIRBNB_ICAL_POOLSIDE_CENTRAL_STUDIO",
  "colorful-2bedroom-house": "AIRBNB_ICAL_COLORFUL_2BEDROOM_HOUSE",
  "beach-house-studio": "AIRBNB_ICAL_BEACH_HOUSE_STUDIO",
};

export function getIcalUrl(propertyId: string): string | undefined {
  const envVar = ICAL_ENV_VAR[propertyId];
  return envVar ? process.env[envVar] : undefined;
}
