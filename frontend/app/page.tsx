import fs from "fs";
import path from "path";
import Link from "next/link";
import { getNoteBySlug, getNoteSlugs } from "../lib/notes";

export default function Home() {
  const formatUpdated = (value?: string) => {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      const cleaned = value.replace("T", " ").replace(/:\d{2}(?:\.\d+)?$/, "");
      const datePart = cleaned.split(" ")[0] || "";
      const [y, m, d] = datePart.split("-");
      if (y && m && d) {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const idx = Number.parseInt(m, 10) - 1;
        const mon = months[idx] || m;
        return `${y}-${mon}-${d}`;
      }
      return cleaned;
    }
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const year = parsed.getUTCFullYear();
    const month = months[parsed.getUTCMonth()];
    const day = String(parsed.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const notes = getNoteSlugs()
    .map((slug) => getNoteBySlug(slug))
    .sort((a, b) => (b.data.date ?? "").localeCompare(a.data.date ?? ""))
    .slice(0, 10);

  const projectsDir = path.join(process.cwd(), "content", "projects");
  const projects = fs
    .readdirSync(projectsDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(projectsDir, file);
      const markdown = fs.readFileSync(filePath, "utf8");
      const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
      const frontmatter = frontmatterMatch?.[1] ?? "";

      let title = "";
      let date = "";

      frontmatter.split("\n").forEach((line) => {
        const separatorIndex = line.indexOf(":");
        if (separatorIndex === -1) return;
        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim();
        const cleaned =
          (value.startsWith("\"") && value.endsWith("\"")) ||
          (value.startsWith("'") && value.endsWith("'"))
            ? value.slice(1, -1)
            : value;
        if (key === "title") title = cleaned;
        if (key === "date") date = cleaned;
      });

      return {
        id: file.replace(".md", ""),
        title: title || file.replace(".md", ""),
        date,
      };
    })
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
    .slice(0, 5);

  const formatProjectDate = (value?: string) => {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      const parts = value.split("-");
      if (parts.length === 3) {
        const [y, m, d] = parts;
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const idx = Number.parseInt(m, 10) - 1;
        const mon = months[idx] || m;
        return `${y}-${mon}-${d}`;
      }
      return value;
    }
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const year = parsed.getUTCFullYear();
    const month = months[parsed.getUTCMonth()];
    const day = String(parsed.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <main style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
      {/* Intro */}
      <section>
        <h1>Toby Purbojo</h1>
        <p className="home-intro">
          Hi, I’m Toby. I’m currently studying for a Master’s degree in Data
          Science in Debrecen, Hungary. I’ve done some research on isolated sign
          language recognition, but I’m still exploring different areas of the
          field to figure out what I want to focus on. In my spare time, I enjoy
          reading, photography, music, and sports. I created this website to
          share my notes and some of the cool things I’ve built.
        </p>
        <p className="social-line">
          Find me on{" "}
          <a href="https://github.com/tobp03" aria-label="GitHub">
            <span className="theme-icon" aria-hidden="true">
              <img className="icon-light" src="/github_light.svg" alt="" />
              <img className="icon-dark" src="/github_dark.svg" alt="" />
            </span>
          </a>
          ,{" "}
          <a
            href="https://www.linkedin.com/in/tobypurbojo"
            aria-label="LinkedIn"
          >
            <span className="theme-icon" aria-hidden="true">
              <img className="icon-light" src="/linkedin_light.svg" alt="" />
              <img className="icon-dark" src="/linkedin_dark.svg" alt="" />
            </span>
          </a>
          , and{" "}
          <a href="mailto:tobypurbojo1@gmail.com" aria-label="Email">
            <span className="theme-icon" aria-hidden="true">
              <img className="icon-light" src="/mail_light.svg" alt="" />
              <img className="icon-dark" src="/mail_dark.svg" alt="" />
            </span>
          </a>
        </p>
      </section>

      <hr style={{ margin: "40px 0" }} />

      {/* Featured Projects */}
      <section>
        <h2>Featured Projects</h2>
        {projects.length ? (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <span className="note-updated">
                  {formatProjectDate(project.date)}
                </span>{" "}
                <span aria-hidden="true">•</span>{" "}
                <Link href={`/projects?project=${project.id}`}>
                  {project.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Coming soon...</p>
        )}
      </section>

      <hr style={{ margin: "40px 0" }} />

      {/* Latest Notes */}
      <section>
        <h2>Last updated notes</h2>
        {notes.length ? (
          <ul>
            {notes.map((note) => (
              <li key={note.slug}>
                <span className="note-updated">
                  {note.data.updated ? formatUpdated(note.data.updated) : ""}
                </span>{" "}
                <span aria-hidden="true">•</span>{" "}
                <Link href={`/notes/${note.slug}`}>
                  {note.data.title ?? note.slug}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Coming soon…</p>
        )}
      </section>
    </main>
  );
}
