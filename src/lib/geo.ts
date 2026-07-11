// The site tells guests the exact address is "provided after booking
// confirmation" - so the public map/schema should never plot the exact
// door. This offsets coordinates by a deterministic ~150-250m per property
// (same property -> same offset every build, so the map doesn't jump around).
export function approximateCoordinates(
  lat: number,
  lng: number,
  seed: string
): { lat: number; lng: number } {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  hash = Math.abs(hash);

  const angle = (hash % 360) * (Math.PI / 180);
  const distanceMeters = 150 + (hash % 100); // 150-250m

  const earthRadius = 6378137; // meters
  const dLat = (distanceMeters * Math.cos(angle)) / earthRadius;
  const dLng =
    (distanceMeters * Math.sin(angle)) / (earthRadius * Math.cos((lat * Math.PI) / 180));

  return {
    lat: lat + (dLat * 180) / Math.PI,
    lng: lng + (dLng * 180) / Math.PI,
  };
}
