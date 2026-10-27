// PLACEHOLDER answers - drafted for the hosts to correct. Payment,
// deposit, cancellation, check-in times and house rules are commitments to
// guests, so confirm every answer before relying on it.
export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ: FaqItem[] = [
  {
    question: "How do I book directly with you?",
    answer:
      "Pick your dates on the apartment's page and send them to us on WhatsApp, Viber or email. We usually reply within an hour with your price and payment details, and your booking is confirmed once the payment is received.",
  },
  {
    question: "How do I pay, and is there a deposit?",
    answer:
      "You can pay by bank transfer or card through a secure payment link. A 30% deposit confirms your booking and the rest is due 14 days before arrival.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Cancellation is free up to 30 days before arrival. After that the deposit is non-refundable. If your plans change, message us and we'll try to help, for example by moving your dates.",
  },
  {
    question: "What are the check-in and check-out times?",
    answer:
      "Check-in is from 15:00 and check-out is by 11:00. Early check-in or late check-out is often possible when the apartment is free, just ask.",
  },
  {
    question: "Can you arrange an airport transfer? Is there parking?",
    answer:
      "Yes, we can arrange a transfer from the airport on request. Luxe Poolside Escape has on-site parking; at the other apartments there is free street parking nearby.",
  },
  {
    question: "Do you have a cot or high chair? Are pets allowed?",
    answer:
      "A cot and high chair are available free of charge on request. Pets are not allowed.",
  },
  {
    question: "Is there a tourist tax?",
    answer: "No, there is no tourist tax at any of our apartments in Cyprus or Tenerife.",
  },
  {
    question: "Do I need a car?",
    answer:
      "In Paphos the beach, shops and restaurants are within walking distance, so a car is only needed for day trips. In Tenerife we recommend a car to explore the island.",
  },
  {
    question: "Is booking directly safe?",
    answer:
      "Yes. We're the same hosts you'll find on Airbnb, Superhosts since 2022, with the same apartments and reviews. You deal with us personally and skip the platform fees.",
  },
];
