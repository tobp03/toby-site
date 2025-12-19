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

  return (
    <main style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
      {/* Intro */}
      <section>
        <h1>Toby Purbojo</h1>
        <p>
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
            <img src="/github.png" alt="" aria-hidden="true" />
          </a>
          ,{" "}
          <a
            href="https://www.linkedin.com/in/tobypurbojo"
            aria-label="LinkedIn"
          >
            <img src="/linkedin.png" alt="" aria-hidden="true" />
          </a>
          , and{" "}
          <a href="mailto:tobypurbojo1@gmail.com" aria-label="Email">
            <img src="/email.png" alt="" aria-hidden="true" />
          </a>
        </p>
      </section>

      <hr style={{ margin: "40px 0" }} />

      {/* Featured Projects */}
      <section>
        <h2>Featured Projects</h2>
        <ul>
          <li>Coming soon...</li>
        </ul>
      </section>

      <hr style={{ margin: "40px 0" }} />

      {/* Latest Notes */}
      <section>
        <h2>Latest Notes / Blog</h2>
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
