"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { differenceInCalendarDays, format, addDays } from "date-fns";
import AvailabilityCalendar from "./AvailabilityCalendar";
import type { BlockedDateRange } from "@/lib/ical-client";

interface BookingPanelProps {
  propertyName: string;
  pricePerNight: number;
  blockedRanges: BlockedDateRange[];
  propertyId: string;
  ratesByDate?: Record<string, number>;
  cleaningFee?: number;
}

function toDateKey(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

function formatDateDisplay(date: Date): string {
  return format(date, "MMM d, yyyy");
}

function nightlySubtotal(
  from: Date,
  to: Date,
  ratesByDate: Record<string, number> | undefined,
  fallback: number
): number {
  const nights = differenceInCalendarDays(to, from);
  let total = 0;
  for (let i = 0; i < nights; i++) {
    const d = addDays(from, i);
    const key = toDateKey(d);
    total += ratesByDate?.[key] ?? fallback;
  }
  return total;
}

export default function BookingPanel({
  propertyName,
  pricePerNight,
  blockedRanges,
  propertyId,
  ratesByDate,
  cleaningFee,
}: BookingPanelProps) {
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const nights =
    range?.from && range?.to
      ? differenceInCalendarDays(range.to, range.from)
      : 0;

  const nightlyTotal =
    range?.from && range?.to
      ? nightlySubtotal(range.from, range.to, ratesByDate, pricePerNight)
      : 0;

  function getDiscount(): number {
    if (nights >= 28) return 0.2;
    if (nights >= 7) return 0.1;
    return 0;
  }

  const discount = getDiscount();
  const discountAmount = nightlyTotal * discount;
  const discountedNightly = nightlyTotal - discountAmount;
  const cleaning = cleaningFee ?? 0;
  const estimatedTotal = discountedNightly + cleaning;
  const avgPerNight = nights > 0 ? discountedNightly / nights : 0;

  function buildWhatsAppUrl(): string {
    if (!range?.from || !range?.to) {
      const text = `Hello! I'm interested in booking *${propertyName}*. Could you please confirm availability and pricing?`;
      return `https://wa.me/420731139854?text=${encodeURIComponent(text)}`;
    }
    const checkIn = formatDateDisplay(range.from);
    const checkOut = formatDateDisplay(range.to);
    const text = `Hello! I'm interested in booking *${propertyName}* from ${checkIn} to ${checkOut} (${nights} nights). Could you please confirm availability and pricing?`;
    return `https://wa.me/420731139854?text=${encodeURIComponent(text)}`;
  }

  function buildEmailUrl(): string {
    const subject = `Booking Request — ${propertyName}`;
    let body: string;
    if (!range?.from || !range?.to) {
      body = `Hello!\n\nI'm interested in booking ${propertyName}. Could you please confirm availability and pricing?\n\nThank you.`;
    } else {
      const checkIn = formatDateDisplay(range.from);
      const checkOut = formatDateDisplay(range.to);
      body = `Hello!\n\nI'm interested in booking ${propertyName} from ${checkIn} to ${checkOut} (${nights} nights). Could you please confirm availability and pricing?\n\nThank you.`;
    }
    return `mailto:giorgos.koutoulo@gmail.com?cc=katonarita90@gmail.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <AvailabilityCalendar
        initialBlockedRanges={blockedRanges}
        propertyId={propertyId}
        selectedRange={range}
        onRangeSelect={setRange}
      />

      {/* Price summary */}
      {nights > 0 && range?.from && range?.to && (
        <div className="bg-white rounded-2xl border border-cream-dark p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Price Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Check-in</span>
              <span className="font-medium text-gray-900">
                {formatDateDisplay(range.from)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Check-out</span>
              <span className="font-medium text-gray-900">
                {formatDateDisplay(range.to)}
              </span>
            </div>

            <div className="border-t border-cream-dark my-2" />

            {/* Nightly subtotal */}
            <div className="flex justify-between text-gray-600">
              <span>
                {nights} nights
                {ratesByDate
                  ? " (dynamic rates)"
                  : ` × €${pricePerNight}`}
              </span>
              <span>€{nightlyTotal.toFixed(2)}</span>
            </div>

            {/* Long-stay discount */}
            {discount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>
                  {discount === 0.2
                    ? "28+ nights discount (20%)"
                    : "7+ nights discount (10%)"}
                </span>
                <span>−€{discountAmount.toFixed(2)}</span>
              </div>
            )}

            {/* Cleaning fee */}
            {cleaning > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Cleaning fee</span>
                <span>€{cleaning.toFixed(2)}</span>
              </div>
            )}

            <div className="border-t border-cream-dark my-2" />

            {/* Avg per night (informational) */}
            {discount > 0 && (
              <div className="flex justify-between text-gray-500 text-xs">
                <span>Avg per night after discount</span>
                <span>€{avgPerNight.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-gray-900 text-base">
              <span>Estimated Total</span>
              <span className="text-primary">€{estimatedTotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              * Final price subject to confirmation by host
            </p>
          </div>
        </div>
      )}

      {/* Booking buttons */}
      <div className="bg-white rounded-2xl border border-cream-dark p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-2">Book This Property</h3>
        <p className="text-sm text-gray-500 mb-4">
          {nights > 0
            ? `You've selected ${nights} nights. Send a booking request to the host.`
            : "Select your dates above, then contact the host to book."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-5 rounded-xl font-semibold text-sm transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Request via WhatsApp
          </a>

          <a
            href={buildEmailUrl()}
            className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark text-white py-3 px-5 rounded-xl font-semibold text-sm transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Request via Email
          </a>
        </div>
      </div>
    </div>
  );
}
