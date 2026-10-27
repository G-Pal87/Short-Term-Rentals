"use client";

import { useState } from "react";
import { FORMSPREE_FORM_ID } from "@/lib/site";

interface EnquiryFormProps {
  propertyName: string;
  /** e.g. "Nov 3, 2026 to Nov 6, 2026 (3 nights)", or "" before dates are picked. */
  dates: string;
  guests: number;
}

type Status = "idle" | "sending" | "sent" | "error";

// For guests without WhatsApp/Viber or a mail app: a short form posted to
// Formspree, which emails it to the host. Hidden while FORMSPREE_FORM_ID is
// empty.
export default function EnquiryForm({ propertyName, dates, guests }: EnquiryFormProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  if (!FORMSPREE_FORM_ID) return null;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(e.currentTarget),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="mt-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3">
        Thanks, your enquiry was sent. We&apos;ll reply by email.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 w-full text-sm font-semibold text-secondary hover:text-primary underline underline-offset-2"
      >
        No WhatsApp or Viber? Send an enquiry form
      </button>
    );
  }

  const field = "w-full rounded-xl border border-cream-dark px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary/40";

  return (
    <form onSubmit={submit} className="mt-4 space-y-3 border-t border-cream-dark pt-4">
      <p className="text-sm font-semibold text-gray-900">Send an enquiry</p>
      <input type="hidden" name="property" value={propertyName} />
      <input type="hidden" name="dates" value={dates || "Not chosen yet"} />
      <input type="hidden" name="guests" value={guests} />
      <input type="hidden" name="_subject" value={`Booking enquiry - ${propertyName}`} />
      {/* Spam trap: real visitors never fill it in */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div>
        <label htmlFor="enq-name" className="block text-xs font-medium text-gray-600 mb-1">Your name</label>
        <input id="enq-name" name="name" required autoComplete="name" className={field} />
      </div>
      <div>
        <label htmlFor="enq-email" className="block text-xs font-medium text-gray-600 mb-1">Email</label>
        <input id="enq-email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div>
        <label htmlFor="enq-message" className="block text-xs font-medium text-gray-600 mb-1">Message</label>
        <textarea
          id="enq-message"
          name="message"
          rows={3}
          className={field}
          defaultValue={`Hello! I'm interested in ${propertyName}${dates ? ` from ${dates}` : ""} for ${guests} guest${guests > 1 ? "s" : ""}.`}
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-700">The enquiry didn&apos;t go through. Please try again, or message us on WhatsApp or by email.</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-secondary hover:bg-secondary-dark disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
      >
        {status === "sending" ? "Sending..." : "Send enquiry"}
      </button>
    </form>
  );
}
