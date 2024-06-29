import { getBaseUrl } from "@/lib/utils";
import { type MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/*", "/auth/*"],
    },
    host: getBaseUrl(),
    sitemap: `${getBaseUrl()}/sitemap.xml`,
  };
}
