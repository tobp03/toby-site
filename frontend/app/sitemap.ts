import fs from "fs";
import path from "path";
import type { MetadataRoute } from "next";
import { getNoteSlugs } from "../lib/notes";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tobypurbojo.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/projects", "/notes", "/resume"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));

  const noteRoutes = getNoteSlugs().map((slug) => ({
    url: `${SITE_URL}/notes/${slug}`,
    lastModified: new Date(),
  }));

  const projectsDir = path.join(process.cwd(), "content", "projects");
  const projectRoutes = fs
    .readdirSync(projectsDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(".md", ""))
    .map((slug) => ({
      url: `${SITE_URL}/projects?project=${slug}`,
      lastModified: new Date(),
    }));

  return [...staticRoutes, ...noteRoutes, ...projectRoutes];
}
