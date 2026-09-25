"""Parse an Airbnb iCal export into calendars/<id>.json.

Usage: parse-ical.py <property-id> <ics-file> [<live-calendar-json>]

Exits non-zero - so deploy.yml keeps the calendar the live site already
serves - when the download isn't a calendar at all (e.g. an HTML error or
bot-check page served with HTTP 200), or when it has no events although the
live calendar has some. Publishing either would show every date as free.
"""
import json
import re
import sys
from datetime import datetime, timezone

prop_id = sys.argv[1]
tmpfile = sys.argv[2]
live_file = sys.argv[3] if len(sys.argv) > 3 else ""

with open(tmpfile, encoding="utf-8", errors="replace") as f:
    text = f.read()

if "BEGIN:VCALENDAR" not in text or "END:VCALENDAR" not in text:
    print(f"  {prop_id}: response is not an iCal calendar - ignoring it", file=sys.stderr)
    sys.exit(1)


def to_date(raw):
    raw = re.sub(r"^[^:]*:", "", raw).strip()
    m = re.match(r"^(\d{4})(\d{2})(\d{2})", raw)
    return f"{m.group(1)}-{m.group(2)}-{m.group(3)}" if m else None


blocked = []
for ev in text.split("BEGIN:VEVENT")[1:]:
    sm = re.search(r"^DTSTART[;:][^\r\n]+", ev, re.M)
    em = re.search(r"^DTEND[;:][^\r\n]+", ev, re.M)
    if not sm:
        continue
    start = to_date(sm.group(0))
    end = to_date(em.group(0)) if em else start
    if start and end:
        blocked.append({"start": start, "end": end})

if not blocked and live_file:
    try:
        with open(live_file, encoding="utf-8") as f:
            live_blocked = json.load(f).get("blocked") or []
    except (OSError, ValueError):
        live_blocked = []
    if live_blocked:
        print(
            f"  {prop_id}: calendar has no events but the live one has {len(live_blocked)}"
            " - treating as a bad response",
            file=sys.stderr,
        )
        sys.exit(1)

out = {
    "updatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "blocked": blocked,
}
with open(f"calendars/{prop_id}.json", "w") as f:
    json.dump(out, f)

print(f"  {prop_id}: {len(blocked)} blocked ranges")
