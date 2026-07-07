"use client";

import { useState, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { parseISO, isBefore, startOfToday, format } from "date-fns";
import "react-day-picker/dist/style.css";
import { fetchIcalClient } from "@/lib/ical-client";
import type { BlockedDateRange } from "@/lib/ical-client";

interface AvailabilityCalendarProps {
  initialBlockedRanges: BlockedDateRange[];
  propertyId: string;
  onRangeSelect: (range: DateRange | undefined) => void;
  selectedRange: DateRange | undefined;
  ratesByDate?: Record<string, number>;
  syncedAt?: string;
  fromCache?: boolean;
}

export default function AvailabilityCalendar({
  initialBlockedRanges,
  propertyId,
  onRangeSelect,
  selectedRange,
  ratesByDate,
  syncedAt,
  fromCache,
}: AvailabilityCalendarProps) {
  const today = startOfToday();
  const [blockedRanges, setBlockedRanges] =
    useState<BlockedDateRange[]>(initialBlockedRanges);
  const [syncing, setSyncing] = useState(true);

  // Fetch fresh iCal data from Airbnb on every page open
  useEffect(() => {
    setSyncing(true);
    fetchIcalClient(propertyId)
      .then((fresh) => {
        if (fresh.length > 0) setBlockedRanges(fresh);
      })
      .finally(() => setSyncing(false));
  }, [propertyId]);

  const disabledIntervals = blockedRanges
    .map((r) => {
      try {
        return { from: parseISO(r.start), to: parseISO(r.end) };
      } catch {
        return null;
      }
    })
    .filter(
      (r): r is { from: Date; to: Date } =>
        r !== null && !isNaN(r.from.getTime()) && !isNaN(r.to.getTime())
    );

  function isDateBlocked(date: Date): boolean {
    if (isBefore(date, today)) return true;
    // iCal DTEND is exclusive (checkout day = available for next check-in),
    // so we use date >= start && date < end instead of isWithinInterval (inclusive).
    return disabledIntervals.some(
      (interval) => !isBefore(date, interval.from) && isBefore(date, interval.to)
    );
  }

  return (
    <div className="rounded-2xl border border-cream-dark bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-gray-900">Availability</h3>
        {syncing ? (
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Syncing with Airbnb…
          </span>
        ) : fromCache ? (
          <span className="text-xs text-amber-500 flex items-center gap-1" title={`Last successful sync: ${syncedAt}`}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Sync issue - cached data
          </span>
        ) : (
          <span className="text-xs text-green-600 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Live availability
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Select your check-in and check-out dates. Greyed out dates are
        unavailable.
      </p>
      <div className="overflow-x-auto">
        <DayPicker
          mode="range"
          selected={selectedRange}
          onSelect={onRangeSelect}
          disabled={isDateBlocked}
          numberOfMonths={2}
          fromDate={today}
          pagedNavigation
          showOutsideDays={false}
          className="rdp-custom"
          modifiersClassNames={{
            selected: "rdp-day_selected",
            range_start: "rdp-day_range_start",
            range_end: "rdp-day_range_end",
            range_middle: "rdp-day_range_middle",
            disabled: "rdp-day_disabled",
          }}
          components={{
            DayContent: ({ date }) => {
              const key = format(date, "yyyy-MM-dd");
              const rate = ratesByDate?.[key];
              const blocked = isDateBlocked(date);
              return (
                <div className="flex flex-col items-center justify-center leading-none gap-0.5">
                  <span>{date.getDate()}</span>
                  {rate && !blocked && (
                    <span className="text-[10px] font-semibold opacity-80">€{rate}</span>
                  )}
                </div>
              );
            },
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-cream-dark">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <div className="w-4 h-4 rounded-sm bg-primary" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <div className="w-4 h-4 rounded-sm bg-gray-200" />
          <span>Unavailable</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <div className="w-4 h-4 rounded-sm border border-gray-300" />
          <span>Available</span>
        </div>
      </div>
    </div>
  );
}
