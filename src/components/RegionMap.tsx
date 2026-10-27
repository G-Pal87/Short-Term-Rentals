"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export interface MapPin {
  name: string;
  lat: number;
  lng: number;
  /** Property pins link to their page; landmarks have no href. */
  href?: string;
}

interface RegionMapProps {
  properties: MapPin[];
  landmarks: MapPin[];
}

const PROPERTY_PIN = `<svg width="30" height="40" viewBox="0 0 24 32" aria-hidden="true"><path fill="#C97759" stroke="#fff" stroke-width="1.5" d="M12 1C6 1 1.5 5.5 1.5 11.3 1.5 19 12 31 12 31s10.5-12 10.5-19.7C22.5 5.5 18 1 12 1z"/><circle cx="12" cy="11.5" r="4" fill="#fff"/></svg>`;
const LANDMARK_DOT = `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#2A4F4B;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></span>`;

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

// One map per region with every apartment's approximate pin (same rounded
// coordinates as the property pages) plus a few public landmarks.
export default function RegionMap({ properties, landmarks }: RegionMapProps) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    // Leaflet touches window on import, so load it in the browser only.
    import("leaflet").then((L) => {
      if (cancelled || !el.current) return;
      map = L.map(el.current, { scrollWheelZoom: false });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const propertyIcon = L.divIcon({ html: PROPERTY_PIN, className: "", iconSize: [30, 40], iconAnchor: [15, 39], popupAnchor: [0, -34] });
      const landmarkIcon = L.divIcon({ html: LANDMARK_DOT, className: "", iconSize: [14, 14], iconAnchor: [7, 7], popupAnchor: [0, -8] });

      for (const p of properties) {
        L.marker([p.lat, p.lng], { icon: propertyIcon, title: p.name, zIndexOffset: 1000 })
          .addTo(map)
          .bindPopup(`<a href="${p.href}" style="font-weight:600;color:#2A4F4B">${escapeHtml(p.name)}</a><br><span style="color:#4b5563">Approximate location</span>`);
      }
      for (const l of landmarks) {
        L.marker([l.lat, l.lng], { icon: landmarkIcon, title: l.name })
          .addTo(map)
          .bindTooltip(escapeHtml(l.name), { direction: "top", offset: [0, -8] });
      }
      const all = [...properties, ...landmarks].map((p) => [p.lat, p.lng] as [number, number]);
      map.fitBounds(L.latLngBounds(all), { padding: [36, 36] });
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [properties, landmarks]);

  return (
    <div>
      <div
        ref={el}
        className="h-[380px] w-full rounded-2xl overflow-hidden border border-cream-dark shadow-sm bg-cream-dark/40 z-0"
        role="region"
        aria-label="Map of the apartments and nearby places"
      />
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" aria-hidden="true" /> Apartments (approximate)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary" aria-hidden="true" /> Beaches, sights and airport
        </span>
      </div>
    </div>
  );
}
