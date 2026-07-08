export type Region = "paphos" | "tenerife";

export interface Property {
  id: string;
  name: string;
  subtitle: string;
  region: Region;
  icalUrl: string;
  btPropertyId?: string; // override for Business-Tracking feed matching
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  pricePerNight: number;
  cleaningFee: number;        // Cleaning fee (flat, per booking)
  lat: number;
  lng: number;
  amenities: string[];
  description: string;
  gradients: string[];
  /**
   * Photo filenames inside public/images/properties/{id}/.
   * e.g. ["01.jpg", "02.jpg", "03.jpg"]
   * Omit (or leave empty) until photos are added - UI falls back to gradients.
   */
  images?: string[];
}

export const properties: Property[] = [
  {
    id: "venus-beach-retreat",
    name: "Colourful Venus Beach Retreat",
    subtitle: "Pool & 2 Terraces",
    region: "paphos",
    btPropertyId: "prop_mox7p43s8o",
    icalUrl:
      "https://www.airbnb.gr/calendar/ical/1341854905555812998.ics?t=1e2c75c8b84645a4ac88669d8ec7bdda",
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    pricePerNight: 120,
    cleaningFee: 60,
    lat: 34.77792893594747,
    lng: 32.408875392706626,
    amenities: ["Pool", "2 Terraces", "WiFi", "AC", "Kitchen", "Beach Nearby"],
    description:
      "Welcome to the Colourful Venus Beach Retreat, a vibrant and beautifully designed two-bedroom apartment nestled in the heart of Paphos, Cyprus. This stunning retreat boasts a sparkling private pool and two spacious terraces where you can soak up the Mediterranean sunshine and enjoy breathtaking views. The interior is decorated with a palette of warm, cheerful colours that create an inviting and relaxing atmosphere. Fully equipped with modern amenities including a fully-fitted kitchen, air conditioning throughout, and high-speed WiFi, this property offers everything you need for an unforgettable holiday. The beach is just a short stroll away, making it the perfect base for exploring the beautiful coastline and the rich history of Paphos.",
    gradients: [
      "linear-gradient(135deg, #E8845A 0%, #c4623e 100%)",
      "linear-gradient(135deg, #2C5F5A 0%, #1e4540 100%)",
      "linear-gradient(135deg, #2C7BA3 0%, #1a5a7a 100%)",
      "linear-gradient(135deg, #f0a070 0%, #E8845A 100%)",
    ],
    images: [
      "hero.jpeg",
      "Living_room_02.jpg",
      "Living_room_03.jpg",
      "Living_room_04.jpg",
      "Living_room_05.jpg",
      "bedroom_02.jpg",
      "bedroom_03.jpg",
      "bedroom_04.jpg",
      "bathroom_01.jpg",
      "kitchen_01.jpg",
      "kitchen_02.jpg",
      "kitchen_03.jpg",
      "terrace_01.jpg",
      "terrace_03.jpg",
      "terrrace_2_01.jpg",
      "terrrace_2_03.jpg",
    ],
  },
  {
    id: "luxe-poolside-escape",
    name: "Luxe Poolside Escape",
    subtitle: "Beach walk & 2 Terraces",
    region: "paphos",
    btPropertyId: "prop_mox7mr8day",
    icalUrl:
      "https://www.airbnb.gr/calendar/ical/1389855941514317769.ics?t=a2520714c5a34b1daa3b808b6c1bfd0e",
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    pricePerNight: 140,
    cleaningFee: 60,
    lat: 34.77792893594747,
    lng: 32.408875392706626,
    amenities: [
      "Pool",
      "2 Terraces",
      "Beach Walk",
      "WiFi",
      "AC",
      "Kitchen",
      "Parking",
    ],
    description:
      "Experience luxury living at the Luxe Poolside Escape, an exquisite two-bedroom apartment offering the perfect blend of comfort and style in Paphos. Steps from the shimmering Mediterranean Sea, this property features a stunning pool and two elegant terraces perfect for al fresco dining and sunset cocktails. The interior has been thoughtfully designed with high-end furnishings and a sophisticated colour palette. A short beach walk leads you to the golden sands and crystal-clear waters of Paphos. Whether you're looking for a romantic getaway or a family holiday, this luxurious retreat promises memories that will last a lifetime. On-site parking and all modern conveniences are included.",
    gradients: [
      "linear-gradient(135deg, #1e4540 0%, #2C5F5A 100%)",
      "linear-gradient(135deg, #E8845A 0%, #f0a070 100%)",
      "linear-gradient(135deg, #4a90a4 0%, #2C7BA3 100%)",
      "linear-gradient(135deg, #c4623e 0%, #a04830 100%)",
    ],
    images: [
      "hero.jpg",
      "living_room_01.jpg",
      "living_room_02.jpg",
      "living_room_03.jpg",
      "living_room_05.jpg",
      "living_room_06.jpg",
      "bedroom_04.jpg",
      "bedroom_05.jpg",
      "bedroom_06.jpg",
      "bedroom_07.jpg",
      "bathroom_02.jpg",
      "balcony_01.jpg",
      "balcony_03.jpg",
      "balcony_04.jpg",
    ],
  },
  {
    id: "poolside-central-studio",
    name: "Poolside Central Studio",
    subtitle: "Balcony & Beach Walk",
    region: "paphos",
    btPropertyId: "prop_mox7ipfiam",
    icalUrl:
      "https://www.airbnb.gr/calendar/ical/1417130109923067210.ics?t=e8ec8f5e94b845b6817598eeaa30df0e",
    bedrooms: 0,
    bathrooms: 1,
    maxGuests: 2,
    pricePerNight: 80,
    cleaningFee: 60,
    lat: 34.765957426166075,
    lng: 32.411798972819234,
    amenities: ["Pool", "Balcony", "Beach Walk", "WiFi", "AC", "Kitchenette"],
    description:
      "The Poolside Central Studio is a charming and cosy studio apartment perfectly situated in the centre of Paphos, just a short walk from the beach. Ideal for couples or solo travellers, this bright and airy studio features a beautiful private balcony overlooking the pool, where you can enjoy your morning coffee with a refreshing view. The studio is cleverly designed to maximise space and comfort, with a well-equipped kitchenette, air conditioning, and fast WiFi. Its central location means you're never far from Paphos's best restaurants, shops, and attractions. The pool is shared with a small number of guests, ensuring a peaceful and relaxing atmosphere throughout your stay.",
    gradients: [
      "linear-gradient(135deg, #2C7BA3 0%, #4a90a4 100%)",
      "linear-gradient(135deg, #E8845A 0%, #c4623e 100%)",
      "linear-gradient(135deg, #2C5F5A 0%, #3a7a74 100%)",
    ],
    images: [
      "hero.jpg",
      "outside_02.jpg",
      "outside_06.jpg",
      "outside_11.jpg",
      "balcony_08.jpg",
      "interior_04.jpg",
      "interior_07.jpg",
      "interior_08.jpg",
      "interior_10.jpg",
      "interior_15.jpg",
      "interior_16.jpg",
      "interior_17.jpg",
      "interior_19.jpg",
      "bathroom_01.jpg",
      "bathroom_02.jpg",
    ],
  },
  {
    id: "colorful-2bedroom-house",
    name: "Colorful 2-Bedroom House",
    subtitle: "Walk to Beach & View Terrace",
    region: "tenerife",
    btPropertyId: "prop_mohfv8np89",
    icalUrl:
      "https://www.airbnb.com/calendar/ical/720194839435246794.ics?t=3da4aac00c9d4eb6bbe7f3496aa22ee8",
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 5,
    pricePerNight: 110,
    cleaningFee: 50,
    lat: 28.4636,
    lng: -16.2518,
    amenities: [
      "View Terrace",
      "Beach Walk",
      "WiFi",
      "AC",
      "Full Kitchen",
      "Garden",
    ],
    description:
      "Discover the magic of Tenerife from this stunning Colorful 2-Bedroom House, a vibrant and welcoming home with spectacular ocean and mountain views. Located within walking distance of a beautiful beach, this charming house accommodates up to five guests in style and comfort. The highlight of the property is its breathtaking view terrace - the perfect spot to watch the sunrise over the Atlantic Ocean with your morning coffee. Inside, the house is filled with colour and character, featuring a fully equipped kitchen, comfortable living spaces, and two well-appointed bedrooms. Tenerife's legendary sunshine, diverse landscapes, and rich culture are right on your doorstep, making this the ideal base for exploring this remarkable island.",
    gradients: [
      "linear-gradient(135deg, #E8845A 0%, #e8a87c 100%)",
      "linear-gradient(135deg, #2C5F5A 0%, #2C7BA3 100%)",
      "linear-gradient(135deg, #c4623e 0%, #E8845A 100%)",
      "linear-gradient(135deg, #1e4540 0%, #2C5F5A 100%)",
    ],
    images: [
      "hero.jpg",
      "DSC04400.jpg",
      "DSC04404.jpg",
      "DSC04413.jpg",
      "DSC04423.jpg",
      "DSC04439.jpg",
      "DSC04441.jpg",
      "DSC04486.jpg",
      "DSC04496.jpg",
      "DSC04519.jpg",
      "DSC04537.jpg",
      "DSC04545.jpg",
      "DSC04707.jpg",
      "DSC04719.jpg",
      "DSC04720.jpg",
      "DSC04735.jpg",
      "DSC04747.jpg",
      "DSC04840.jpg",
    ],
  },
  {
    id: "beach-house-studio",
    name: "Beach House Style Studio",
    subtitle: "Quiet Nature & Near Beach",
    region: "tenerife",
    btPropertyId: "prop_mohfwhqrgj",
    icalUrl:
      "https://www.airbnb.com/calendar/ical/888793861213418554.ics?t=130346559a814283901a9b2280797a38",
    bedrooms: 0,
    bathrooms: 1,
    maxGuests: 2,
    pricePerNight: 75,
    cleaningFee: 50,
    lat: 28.46,
    lng: -16.26,
    amenities: [
      "Terrace",
      "Near Beach",
      "WiFi",
      "AC",
      "Kitchenette",
      "Nature Views",
    ],
    description:
      "Escape to the serene Beach House Style Studio, a peaceful and beautifully designed retreat nestled in the natural beauty of Tenerife. This intimate studio for two is the perfect sanctuary for those seeking tranquillity away from the crowds, while still being just minutes from a gorgeous beach. Surrounded by lush natural landscapes and the soothing sounds of nature, the studio features a charming terrace where you can unwind and take in the spectacular scenery. The interior is inspired by coastal living, with natural materials and a calming colour palette creating a sense of absolute relaxation. All essential amenities are provided, including air conditioning, WiFi, and a well-equipped kitchenette. Your own slice of paradise awaits.",
    gradients: [
      "linear-gradient(135deg, #4a90a4 0%, #2C7BA3 100%)",
      "linear-gradient(135deg, #E8845A 0%, #f0a070 100%)",
      "linear-gradient(135deg, #3a7a74 0%, #2C5F5A 100%)",
    ],
    images: [
      "hero.jpg",
      "DSC04565.jpg",
      "DSC04585.jpg",
      "DSC04601.jpg",
      "DSC04608.jpg",
      "DSC04613.jpg",
      "DSC04632.jpg",
      "DSC04642.jpg",
      "DSC04650.jpg",
      "DSC04669.jpg",
      "DSC04675.jpg",
      "DSC04680.jpg",
    ],
  },
];

export const regionDisplayNames: Record<Region, string> = {
  paphos: "Cyprus - Paphos",
  tenerife: "Spain - Tenerife",
};

// WhatsApp numbers in wa.me format (country code + number, no "+" or spaces)
export const regionWhatsAppNumbers: Record<Region, string> = {
  paphos: "420731139854",
  tenerife: "4915111470730",
};

// Used wherever a WhatsApp link isn't tied to one specific region (header, footer, homepage)
export const defaultWhatsAppNumber = regionWhatsAppNumbers.paphos;

export function getPropertiesByRegion(region: Region): Property[] {
  return properties.filter((p) => p.region === region);
}

export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}

export function getPropertyByRegionAndId(
  region: string,
  id: string
): Property | undefined {
  return properties.find((p) => p.region === region && p.id === id);
}
