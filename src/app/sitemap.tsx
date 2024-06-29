import { getBaseUrl } from "@/lib/utils";
import { type MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: getBaseUrl(),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
  ];
}
