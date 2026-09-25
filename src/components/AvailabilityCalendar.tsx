"use client";

import { useMemo } from "react";
import { DayPicker, DateRange, DayContentProps } from "react-day-picker";
import { addDays, isBefore, isSameDay, startOfToday, format } from "date-fns";
import "react-day-picker/dist/style.css";
import {
  blockedNightSet,
  dateKey,
  stayIsFree,
  type BlockedDateRange,
} from "@/lib/availability";
import type { CalendarStatus } from "@/lib/calendar";

interface AvailabilityCalendarProps {
  blockedRanges: BlockedDateRange[];
  onRangeSelect: (range: DateRange | undefined) => void;
  selectedRange: DateRange | undefined;
  ratesByDate?: Record<string, number>;
  syncedAt?: string | null;
  status: CalendarStatus;
}

// How far ahead to look for the end of a free stretch after a check-in.
const MAX_STAY_SEARCH_DAYS = 400;

function makeDayContent(ratesByDate: Record<string, number> | undefined, blockedNights: Set<string>) {
  return function DayContent({ date }: DayContentProps) {
    const key = dateKey(date);
    const rate = ratesByDate?.[key];
    return (
      <div className="flex flex-col items-center justify-center leading-none gap-0.5">
        <span>{date.getDate()}</span>
        {rate != null && rate > 0 && !blockedNights.has(key) && (
          <span className="text-[10px] font-semibold opacity-80">€{rate}</span>
        )}
      </div>
    );
  };
}

export default function AvailabilityCalendar({
  blockedRanges,
  onRangeSelect,
  selectedRange,
  ratesByDate,
  syncedAt,
  status,
}: AvailabilityCalendarProps) {
  const today = startOfToday();
  const blockedNights = useMemo(() => blockedNightSet(blockedRanges), [blockedRanges]);

  // Check-in picked, checkout not yet: checkout may be any later day up to
  // and including the first blocked night (the next guest's check-in day).
  const pendingCheckIn = selectedRange?.from && !selectedRange.to ? selectedRange.from : null;
  const lastCheckout = useMemo(() => {
    if (!pendingCheckIn) return null;
    let d = addDays(pendingCheckIn, 1);
    for (let i = 0; i < MAX_STAY_SEARCH_DAYS; i++, d = addDays(d, 1)) {
      if (blockedNights.has(dateKey(d))) return d;
    }
    return d;
  }, [pendingCheckIn, blockedNights]);

  function isDisabled(date: Date): boolean {
    if (isBefore(date, today)) return true;
    if (pendingCheckIn && lastCheckout && !isBefore(date, pendingCheckIn)) {
      return isBefore(lastCheckout, date);
    }
    // Otherwise the date is a possible check-in: its night must be free.
    return blockedNights.has(dateKey(date));
  }

  // First click = check-in, second click = checkout. Handled here rather
  // than by DayPicker's range logic, which lets a range jump over booked days.
  function handleDayClick(day: Date) {
    if (pendingCheckIn) {
      if (isSameDay(day, pendingCheckIn)) return onRangeSelect(undefined);
      if (isBefore(pendingCheckIn, day) && stayIsFree(pendingCheckIn, day, blockedNights)) {
        return onRangeSelect({ from: pendingCheckIn, to: day });
      }
    }
    onRangeSelect(blockedNights.has(dateKey(day)) ? undefined : { from: day, to: undefined });
  }

  const components = useMemo(
    () => ({ DayContent: makeDayContent(ratesByDate, blockedNights) }),
    [ratesByDate, blockedNights]
  );

  const syncedLabel = syncedAt ? format(new Date(syncedAt), "d MMM, HH:mm") : null;

  return (
    <div className="rounded-2xl border border-cream-dark bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-gray-900">Availability</h3>
        {status === "live" ? (
          <span className="text-xs text-green-600 flex items-center gap-1" title={syncedLabel ? `Synced with Airbnb ${syncedLabel}` : undefined}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Synced with Airbnb
          </span>
        ) : (
          <span className="text-xs text-amber-500 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {status === "stale" ? `Last synced ${syncedLabel ?? "a while ago"}` : "Availability not loaded"}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-4">
        {status === "missing"
          ? "We couldn't load the live calendar - please ask the host to confirm your dates."
          : pendingCheckIn
            ? "Now select your check-out date."
            : "Select your check-in and check-out dates. Greyed out dates are unavailable."}
      </p>
      <div className="overflow-x-auto">
        <DayPicker
          mode="range"
          selected={selectedRange}
          onSelect={(_range, day) => handleDayClick(day)}
          disabled={isDisabled}
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
          components={components}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-cream-dark">
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
        {selectedRange?.from && (
          <button
            type="button"
            onClick={() => onRangeSelect(undefined)}
            className="ml-auto text-xs text-gray-500 hover:text-primary underline underline-offset-2"
          >
            Clear dates
          </button>
        )}
      </div>
    </div>
  );
}
