import fs from "fs";
import path from "path";
import type { MetadataRoute } from "next";
import { getNoteSlugs } from "../lib/notes";

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tobypurbojo.com").replace(
    /\/$/,
    "",
  );

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/projects", "/notes", "/resume"].map(
    (route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
    }),
  );

  const noteRoutes = getNoteSlugs().map((slug) => ({
    url: `${SITE_URL}/notes/${encodeURIComponent(slug)}`,
    lastModified: new Date(),
  }));

  const projectsDir = path.join(process.cwd(), "content", "projects");
  const projectRoutes = fs
    .readdirSync(projectsDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(".md", ""))
    .map((slug) => ({
      url: `${SITE_URL}/projects?project=${encodeURIComponent(slug)}`,
      lastModified: new Date(),
    }));

  return [...staticRoutes, ...noteRoutes, ...projectRoutes];
}
