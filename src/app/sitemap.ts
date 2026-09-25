import type { MetadataRoute } from "next";
import { properties } from "@/data/properties";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/paphos/", "/tenerife/"];
  const propertyRoutes = properties.map((p) => `/${p.region}/${p.id}/`);

  // No lastModified: the site is rebuilt several times a day, and stamping
  // every page "modified" on each build would only be noise for crawlers.
  return [...staticRoutes, ...propertyRoutes].map((route) => ({
    url: `${SITE_URL}${route}`,
  }));
}
