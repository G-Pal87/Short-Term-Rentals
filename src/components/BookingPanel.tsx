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
  airbnbRatesByDate?: Record<string, number>;
  cleaningFee?: number;
  calendarSyncedAt?: string;
  calendarFromCache?: boolean;
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
  airbnbRatesByDate,
  cleaningFee,
  calendarSyncedAt,
  calendarFromCache,
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

  const cleaning = cleaningFee ?? 0;
  const estimatedTotal = nightlyTotal + cleaning;

  const airbnbTotal =
    range?.from && range?.to
      ? nightlySubtotal(range.from, range.to, airbnbRatesByDate, pricePerNight)
      : 0;
  const saving = airbnbTotal > 0 ? airbnbTotal - nightlyTotal : 0;
  const savingPct = airbnbTotal > 0 ? Math.round((saving / airbnbTotal) * 100) : 0;

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
    <div className="space-y-4">
      {/* Calendar */}
      <AvailabilityCalendar
        initialBlockedRanges={blockedRanges}
        propertyId={propertyId}
        selectedRange={range}
        onRangeSelect={setRange}
        ratesByDate={ratesByDate}
        syncedAt={calendarSyncedAt}
        fromCache={calendarFromCache}
      />

      {/* Price summary */}
      {nights > 0 && range?.from && range?.to && (
        <div className="bg-white rounded-2xl border border-cream-dark p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Price Summary
          </h3>

          {/* Check-in/out dates */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-cream rounded-xl p-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Check-in</p>
              <p className="font-semibold text-gray-900 text-sm">{formatDateDisplay(range.from)}</p>
            </div>
            <div className="bg-cream rounded-xl p-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Check-out</p>
              <p className="font-semibold text-gray-900 text-sm">{formatDateDisplay(range.to)}</p>
            </div>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>
                {nights} nights
                {ratesByDate ? " (dynamic rates)" : ` × €${pricePerNight}`}
              </span>
              <span className="font-medium text-gray-900">€{nightlyTotal.toFixed(0)}</span>
            </div>

            {cleaning > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Cleaning fee</span>
                <span className="font-medium text-gray-900">€{cleaning.toFixed(0)}</span>
              </div>
            )}

            <div className="border-t border-cream-dark pt-2.5">
              <div className="flex justify-between font-bold text-gray-900">
                <span>Estimated Total</span>
                <span className="text-primary text-lg">€{estimatedTotal.toFixed(0)}</span>
              </div>
            </div>

            {saving > 0 && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 mt-2">
                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-green-700 font-medium">
                  You save €{saving.toFixed(0)} ({savingPct}%) vs Airbnb booking
                </p>
              </div>
            )}

            <p className="text-xs text-gray-400">
              Final price subject to host confirmation
            </p>
          </div>
        </div>
      )}

      {/* Booking buttons */}
      <div className="bg-white rounded-2xl border border-cream-dark p-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900">Book This Property</h3>
          <div className="flex items-center gap-1 text-gold">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-semibold text-gray-700">4.9</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-5">
          {nights > 0
            ? `${nights} night${nights > 1 ? "s" : ""} selected. Send your booking request below.`
            : "Select dates above, then contact the host to confirm your booking."}
        </p>

        <div className="flex flex-col gap-3">
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-600 text-white py-3.5 px-5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Request via WhatsApp
          </a>

          <a
            href={buildEmailUrl()}
            className="flex items-center justify-center gap-2.5 bg-secondary hover:bg-secondary-dark text-white py-3.5 px-5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Request via Email
          </a>
        </div>

        <div className="mt-4 pt-4 border-t border-cream-dark flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          No platform fees · Direct with host · Best rate guaranteed
        </div>
      </div>
    </div>
  );
}
