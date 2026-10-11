import type { MetadataRoute } from "next";

const baseUrl = "https://www.danielvanallen.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/about",
    "/projects",
    "/projects/cryptcolors",
    "/projects/deepsouth",
  ].map((path) => ({ url: baseUrl + path }));
}
