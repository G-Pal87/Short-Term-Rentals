import { addDays, format, parseISO, isValid } from "date-fns";

// Shared by the server (build) and the booking calendar in the browser.

export interface BlockedDateRange {
  start: string; // "YYYY-MM-DD", first blocked night
  end: string;   // "YYYY-MM-DD", checkout day (iCal DTEND is exclusive)
}

export function dateKey(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

/**
 * Every blocked *night* as a "YYYY-MM-DD" key. A night is identified by the
 * date it starts on, so a booking from the 3rd to the 5th blocks the nights
 * of the 3rd and 4th - the 5th stays free for the next check-in.
 */
export function blockedNightSet(ranges: BlockedDateRange[]): Set<string> {
  const nights = new Set<string>();
  for (const r of ranges) {
    const start = parseISO(r.start);
    const end = parseISO(r.end);
    if (!isValid(start)) continue;
    // A range without a usable end blocks its start night only.
    if (!isValid(end) || end <= start) {
      nights.add(dateKey(start));
      continue;
    }
    for (let d = start; d < end; d = addDays(d, 1)) nights.add(dateKey(d));
  }
  return nights;
}

/** true if every night from check-in up to (not including) checkout is free. */
export function stayIsFree(checkIn: Date, checkOut: Date, blockedNights: Set<string>): boolean {
  for (let d = checkIn; d < checkOut; d = addDays(d, 1)) {
    if (blockedNights.has(dateKey(d))) return false;
  }
  return true;
}

/**
 * The first stay of at least `minNights` free nights starting on or after
 * `today`, stretched to at most `maxNights`. Returns check-in and checkout
 * keys, or null if nothing is free within `horizonDays`.
 */
export function nextFreeStay(
  blockedNights: Set<string>,
  today: string,
  minNights = 2,
  maxNights = 7,
  horizonDays = 180
): { checkIn: string; checkOut: string } | null {
  const first = parseISO(today);
  for (let i = 0; i < horizonDays; i++) {
    const checkIn = addDays(first, i);
    if (!stayIsFree(checkIn, addDays(checkIn, minNights), blockedNights)) continue;
    let nights = minNights;
    while (nights < maxNights && !blockedNights.has(dateKey(addDays(checkIn, nights)))) nights++;
    return { checkIn: dateKey(checkIn), checkOut: dateKey(addDays(checkIn, nights)) };
  }
  return null;
}

/** "14–18 Nov", or "28 Nov – 3 Dec" across months. */
export function formatStayRange(checkIn: string, checkOut: string): string {
  const a = parseISO(checkIn);
  const b = parseISO(checkOut);
  return a.getMonth() === b.getMonth()
    ? `${format(a, "d")}–${format(b, "d MMM")}`
    : `${format(a, "d MMM")} – ${format(b, "d MMM")}`;
}
