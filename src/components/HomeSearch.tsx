"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DayPicker, DateRange } from "react-day-picker";
import { differenceInCalendarDays, format, startOfToday } from "date-fns";
import "react-day-picker/dist/style.css";
import { blockedNightSet, dateKey, stayIsFree, type BlockedDateRange } from "@/lib/availability";

export interface SearchListing {
  id: string;
  region: string;
  name: string;
  regionLabel: string;
  image: string | null;
  maxGuests: number;
  /** null = calendar couldn't be read: shown as "Ask the host". */
  blocked: BlockedDateRange[] | null;
}

// "When are you travelling?" on the home page: pick dates and guests, see
// which apartments are free (from the same Airbnb calendars as the property
// pages), and open one with the dates already selected.
export default function HomeSearch({ listings }: { listings: SearchListing[] }) {
  const maxGuests = Math.max(...listings.map((l) => l.maxGuests));
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [searched, setSearched] = useState(false);
  const [months, setMonths] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setMonths(mq.matches ? 2 : 1);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const ready = Boolean(range?.from && range?.to && differenceInCalendarDays(range.to, range.from) > 0);
  const nights = ready ? differenceInCalendarDays(range!.to!, range!.from!) : 0;
  const dateLabel = range?.from
    ? `${format(range.from, "d MMM")} – ${range.to ? format(range.to, "d MMM") : "check-out"}`
    : "Add dates";

  const results = ready
    ? listings
        .filter((l) => l.maxGuests >= guests)
        .map((l) => ({
          ...l,
          status: l.blocked === null ? "ask" : stayIsFree(range!.from!, range!.to!, blockedNightSet(l.blocked)) ? "free" : "booked",
        }))
    : [];
  const available = results.filter((r) => r.status !== "booked");
  const bookedCount = results.length - available.length;
  const tooSmall = ready ? listings.filter((l) => l.maxGuests < guests).length : 0;

  function search() {
    if (!ready) {
      setPickerOpen(true);
      return;
    }
    setPickerOpen(false);
    setSearched(true);
  }

  const query = ready
    ? `?checkin=${dateKey(range!.from!)}&checkout=${dateKey(range!.to!)}&guests=${guests}`
    : "";

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-cream-dark p-5 sm:p-6">
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">When are you travelling?</h2>
      <p className="text-sm text-gray-600 mt-1">See which apartments are free for your dates.</p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3">
        <button
          type="button"
          onClick={() => setPickerOpen((v) => !v)}
          aria-expanded={pickerOpen}
          className="flex items-center gap-3 text-left border border-cream-dark hover:border-secondary/40 rounded-2xl px-4 py-3 transition-colors"
        >
          <svg className="w-5 h-5 text-secondary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span>
            <span className="block text-xs text-gray-500">Dates</span>
            <span className="block font-semibold text-gray-900">
              {dateLabel}
              {nights > 0 && <span className="font-normal text-gray-500"> · {nights} night{nights > 1 ? "s" : ""}</span>}
            </span>
          </span>
        </button>

        <div className="flex items-center justify-between gap-4 border border-cream-dark rounded-2xl px-4 py-3">
          <span>
            <span className="block text-xs text-gray-500">Guests</span>
            <span className="block font-semibold text-gray-900">{guests}</span>
          </span>
          <span className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              disabled={guests <= 1}
              aria-label="Fewer guests"
              className="w-8 h-8 rounded-full border border-gray-300 text-gray-700 disabled:opacity-40 hover:border-secondary"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
              disabled={guests >= maxGuests}
              aria-label="More guests"
              className="w-8 h-8 rounded-full border border-gray-300 text-gray-700 disabled:opacity-40 hover:border-secondary"
            >
              +
            </button>
          </span>
        </div>

        <button
          type="button"
          onClick={search}
          className="bg-primary hover:bg-primary-dark text-white font-semibold rounded-2xl px-7 py-3 transition-colors shadow-md"
        >
          Search
        </button>
      </div>

      {pickerOpen && (
        <div className="mt-4 border-t border-cream-dark pt-4 overflow-x-auto">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={months}
            fromDate={startOfToday()}
            pagedNavigation
            showOutsideDays={false}
            className="rdp-custom mx-auto"
            modifiersClassNames={{
              selected: "rdp-day_selected",
              range_start: "rdp-day_range_start",
              range_end: "rdp-day_range_end",
              range_middle: "rdp-day_range_middle",
              disabled: "rdp-day_disabled",
            }}
          />
          <div className="flex justify-end gap-3 mt-2">
            {range?.from && (
              <button type="button" onClick={() => setRange(undefined)} className="text-sm text-gray-600 hover:text-primary underline underline-offset-2">
                Clear dates
              </button>
            )}
            <button type="button" onClick={search} disabled={!ready} className="text-sm font-semibold text-white bg-secondary hover:bg-secondary-dark disabled:opacity-40 rounded-full px-5 py-2">
              Show apartments
            </button>
          </div>
        </div>
      )}

      {searched && ready && (
        <div className="mt-5 border-t border-cream-dark pt-5" aria-live="polite">
          <p className="font-semibold text-gray-900">
            {available.length === 0
              ? "Nothing free for all of those nights."
              : `${available.length} apartment${available.length > 1 ? "s" : ""} for ${dateLabel}`}
          </p>
          {(bookedCount > 0 || tooSmall > 0) && (
            <p className="text-sm text-gray-600 mt-0.5">
              {[bookedCount > 0 && `${bookedCount} booked on some of those nights`, tooSmall > 0 && `${tooSmall} too small for ${guests} guests`]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
          {available.length === 0 ? (
            <p className="text-sm text-gray-600 mt-2">Try moving your dates by a day or two, or message us and we&apos;ll see what we can do.</p>
          ) : (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {available.map((r) => (
                <Link
                  key={r.id}
                  href={`/${r.region}/${r.id}/${query}`}
                  className="group flex gap-3 items-center rounded-2xl border border-cream-dark hover:border-secondary/40 hover:shadow-md p-2.5 transition-all"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-cream-dark">
                    {r.image && <Image src={r.image} alt="" fill sizes="80px" className="object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 leading-snug group-hover:text-primary transition-colors">{r.name}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{r.regionLabel} · up to {r.maxGuests}</p>
                    {r.status === "free" ? (
                      <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold text-green-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden="true" /> Free for your dates
                      </span>
                    ) : (
                      <span className="inline-block mt-1.5 text-xs font-semibold text-amber-700">Ask the host to confirm</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
