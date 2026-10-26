// Tags every WhatsApp/Viber enquiry with a plain-text signature so the host
// can tell at a glance it came from the website rather than Airbnb.
const ATTRIBUTION = "\n\n_Sent from the Mediterranean Rentals website_";

export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(`${message}${ATTRIBUTION}`)}`;
}

// Same numbers as WhatsApp. viber:// only opens where the Viber app is
// installed; `draft` pre-fills the message (both apps share *bold*/_italic_).
export function buildViberUrl(number: string, message: string): string {
  return `viber://chat?number=%2B${number}&draft=${encodeURIComponent(`${message}${ATTRIBUTION}`)}`;
}
