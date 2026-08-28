import Link from "next/link";
import { getNoteBySlug, getNoteSlugs } from "../lib/notes";
import { getProjects } from "../lib/projects";
import { withBasePath } from "../lib/site";

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

  const projects = getProjects().slice(0, 3);

  return (
    <main style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
      {/* Intro */}
      <section>
        <h1>Toby Purbojo</h1>
        <p className="home-intro">
          Hi, I’m Toby. I’m a Data Science master’s student in Debrecen, Hungary, interested in machine learning, computer vision, and the systems behind them.
          
          I use this site to share things I’ve built, notes from what I’m learning, and topics I find interesting.
        </p>
        <p className="home-intro">
          Currently → AWS SAA-C03 · Document AI · MSc Thesis
        </p>
        <p className="social-line">
          Find me on{" "}
          <a href="https://github.com/tobp03" aria-label="GitHub">
            <span className="theme-icon" aria-hidden="true">
              <img
                className="icon-light"
                src={withBasePath("/github_light.svg")}
                alt=""
              />
              <img
                className="icon-dark"
                src={withBasePath("/github_dark.svg")}
                alt=""
              />
            </span>
          </a>
          ,{" "}
          <a
            href="https://www.linkedin.com/in/tobypurbojo"
            aria-label="LinkedIn"
          >
            <span className="theme-icon" aria-hidden="true">
              <img
                className="icon-light"
                src={withBasePath("/linkedin_light.svg")}
                alt=""
              />
              <img
                className="icon-dark"
                src={withBasePath("/linkedin_dark.svg")}
                alt=""
              />
            </span>
          </a>
          , and{" "}
          <a href="mailto:tobypurbojo1@gmail.com" aria-label="Email">
            <span className="theme-icon" aria-hidden="true">
              <img
                className="icon-light"
                src={withBasePath("/mail_light.svg")}
                alt=""
              />
              <img
                className="icon-dark"
                src={withBasePath("/mail_dark.svg")}
                alt=""
              />
            </span>
          </a>
        </p>
      </section>

      <hr style={{ margin: "40px 0" }} />

      {/* Featured Projects */}
      <section>
        <h2>Featured Projects</h2>
        {projects.length ? (
          <div className="project-cards">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects?project=${project.id}`}
                className="project-card"
              >
                <h3>{project.title}</h3>
                <p className="project-card-summary">
                  {project.oneLine || "Open project details"}
                </p>
                <p className="project-card-tools">
                  {project.tools.join(" • ")}
                </p>
              </Link>
            ))}
          </div>
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
