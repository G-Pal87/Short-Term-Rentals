import type { MetadataRoute } from "next";
import { properties } from "@/data/properties";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/paphos/", "/tenerife/"];
  const propertyRoutes = properties.map((p) => `/${p.region}/${p.id}/`);

  return [...staticRoutes, ...propertyRoutes].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
