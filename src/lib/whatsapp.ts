// Tags every WhatsApp enquiry with a plain-text signature so the host can
// tell at a glance it came from the website rather than Airbnb.
const ATTRIBUTION = "\n\n_Sent from the Mediterranean Rentals website_";

export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(`${message}${ATTRIBUTION}`)}`;
}
