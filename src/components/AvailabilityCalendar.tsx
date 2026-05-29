"use client";

import { DayPicker, DateRange } from "react-day-picker";
import { isWithinInterval, parseISO, isBefore, startOfToday } from "date-fns";
import "react-day-picker/dist/style.css";
import type { BlockedDateRange } from "@/lib/ical";

interface AvailabilityCalendarProps {
  blockedRanges: BlockedDateRange[];
  onRangeSelect: (range: DateRange | undefined) => void;
  selectedRange: DateRange | undefined;
}

export default function AvailabilityCalendar({
  blockedRanges,
  onRangeSelect,
  selectedRange,
}: AvailabilityCalendarProps) {
  const today = startOfToday();

  // Convert blocked ranges to Date intervals
  const disabledDays = blockedRanges
    .map((r) => {
      try {
        const from = parseISO(r.start);
        const to = parseISO(r.end);
        return { from, to };
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
    return disabledDays.some((interval) => {
      try {
        return isWithinInterval(date, {
          start: interval.from,
          end: interval.to,
        });
      } catch {
        return false;
      }
    });
  }

  return (
    <div className="rounded-2xl border border-cream-dark bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-1">Availability</h3>
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
