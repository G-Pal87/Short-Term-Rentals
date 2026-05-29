import sys
import re
import json
from datetime import datetime, timezone

prop_id = sys.argv[1]
tmpfile = sys.argv[2]

with open(tmpfile, encoding="utf-8", errors="replace") as f:
    text = f.read()


def to_date(raw):
    raw = re.sub(r"^[^:]*:", "", raw).strip()
    m = re.match(r"^(\d{4})(\d{2})(\d{2})", raw)
    return f"{m.group(1)}-{m.group(2)}-{m.group(3)}" if m else None


blocked = []
for ev in text.split("BEGIN:VEVENT")[1:]:
    sm = re.search(r"DTSTART[;:][^\r\n]+", ev)
    em = re.search(r"DTEND[;:][^\r\n]+", ev)
    if not sm:
        continue
    start = to_date(sm.group(0))
    end = to_date(em.group(0)) if em else start
    if start and end:
        blocked.append({"start": start, "end": end})

out = {
    "updatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "blocked": blocked,
}
with open(f"calendars/{prop_id}.json", "w") as f:
    json.dump(out, f)

print(f"  {prop_id}: {len(blocked)} blocked ranges")
