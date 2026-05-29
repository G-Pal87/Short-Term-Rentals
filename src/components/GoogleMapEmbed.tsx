interface GoogleMapEmbedProps {
  lat: number;
  lng: number;
  title: string;
}

export default function GoogleMapEmbed({
  lat,
  lng,
  title,
}: GoogleMapEmbedProps) {
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <div className="rounded-2xl overflow-hidden border border-cream-dark shadow-sm">
      <iframe
        src={src}
        width="100%"
        height="360"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map for ${title}`}
        className="block"
      />
    </div>
  );
}
