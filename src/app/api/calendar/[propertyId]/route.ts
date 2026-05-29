import { NextRequest, NextResponse } from "next/server";
import { getPropertyById } from "@/data/properties";
import { fetchBlockedDates } from "@/lib/ical";

export const revalidate = 3600;

export async function GET(
  _request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  const property = getPropertyById(params.propertyId);

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  const blocked = await fetchBlockedDates(property.icalUrl);

  return NextResponse.json(blocked, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
