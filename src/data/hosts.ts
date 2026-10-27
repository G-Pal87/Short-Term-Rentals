import type { Region } from "@/data/properties";

// Shown in "Meet your hosts" on the home page and the host card on property
// pages. Photos live in public/images/hosts/.
export const HOSTS_INTRO = {
  names: "Giorgos & Rita",
  photo: "/images/hosts/giorgos-rita.jpg",
  photoAlt: "Giorgos and Rita at sunset above the sea",
  story:
    "We're Giorgos & Rita, two entrepreneurs who love travelling, discovering new places and making spaces feel like home. That's actually how our Airbnb journey started! We love sharing our favourite local spots, hidden gems and little tips to help you enjoy Cyprus and Tenerife as much as we do. Whether you're here to explore or just relax in the sun, we hope you'll feel right at home! ❤️",
  hostingSince: 2022,
  replyTime: "within an hour",
  languages: ["English", "German", "Spanish", "Greek", "Hungarian"],
};

// Who looks after each region (property-page host card).
export const regionHosts: Record<Region, { name: string; photo: string }> = {
  paphos: { name: "Giorgos", photo: "/images/hosts/giorgos.jpg" },
  tenerife: { name: "Rita", photo: "/images/hosts/rita.jpg" },
};
