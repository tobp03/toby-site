import Link from "next/link";
import { getNoteBySlug, getNoteSlugs } from "../../lib/notes";

type NotesPageProps = {
  searchParams?: { topic?: string } | Promise<{ topic?: string }>;
};

function formatLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const resolvedSearch = await Promise.resolve(searchParams);
  const activeTopic = resolvedSearch?.topic
    ? decodeURIComponent(resolvedSearch.topic)
    : "";

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

  const slugs = getNoteSlugs();
  const notes = slugs
    .map((slug) => getNoteBySlug(slug))
    .sort((a, b) =>
      (b.data.updated ?? b.data.date ?? "").localeCompare(
        a.data.updated ?? a.data.date ?? "",
      ),
    );

  const subjectLabels = Array.from(
    new Set(notes.flatMap((note) => note.data.subjects ?? [])),
  )
    .sort()
    .map((subject) => ({
      value: subject,
      label: formatLabel(subject),
    }));

  const singleSubject = subjectLabels.length === 1 ? subjectLabels[0] : null;
  const notesForSubject = singleSubject
    ? notes.filter((note) =>
        (note.data.subjects ?? []).includes(singleSubject.value),
      )
    : [];
  const topicOptions = singleSubject
    ? Array.from(
        new Set(notesForSubject.flatMap((note) => note.data.topics ?? [])),
      ).sort((a, b) => a.localeCompare(b))
    : [];
  const filteredNotes = singleSubject
    ? activeTopic
      ? notesForSubject.filter((note) =>
          (note.data.topics ?? []).includes(activeTopic),
        )
      : notesForSubject
    : notes;

  const sortedNotes = filteredNotes.sort((a, b) =>
    (b.data.updated ?? b.data.date ?? "").localeCompare(
      a.data.updated ?? a.data.date ?? "",
    ),
  );

  return (
    <main style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1>Notes</h1>

      <p className="notes-disclaimer">
        Some notes may take a moment to load.
      </p>

      {singleSubject ? (
        <section style={{ marginTop: 32 }}>
          <h2>Browse by topic</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <Link
              href="/notes"
              style={{
                padding: "6px 12px",
                border: "1px solid #ccc",
                borderRadius: 999,
                textDecoration: "none",
              }}
            >
              All topics
            </Link>
            {topicOptions.map((topic) => (
              <Link
                key={topic}
                href={`/notes?topic=${encodeURIComponent(topic)}`}
                style={{
                  padding: "6px 12px",
                  border: "1px solid #ccc",
                  borderRadius: 999,
                  textDecoration: "none",
                }}
              >
                {formatLabel(topic)}
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section style={{ marginTop: 32 }}>
          <h2>Browse by subject</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {subjectLabels.map((subject) => (
              <Link
                key={subject.value}
                href={`/notes/subject/${encodeURIComponent(subject.value)}`}
                style={{
                  padding: "6px 12px",
                  border: "1px solid #ccc",
                  borderRadius: 999,
                  textDecoration: "none",
                }}
              >
                {subject.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section style={{ marginTop: 24 }}>
        <h2>Last updated notes</h2>
        <ul>
          {sortedNotes.map((note) => {
            const title = note.data.title ?? note.slug;
            const updated = note.data.updated ?? note.data.date ?? "";
            const topics = note.data.topics ?? [];
            return (
              <li key={note.slug}>
                <Link href={`/notes/${note.slug}`}>{title}</Link>
                {(updated || topics.length) ? (
                  <div className="meta-line">
                    {updated ? (
                      <span className="meta-item meta-date">
                        {`Updated: ${formatUpdated(updated)}`}
                      </span>
                    ) : null}
                    {topics.map((topic) => (
                      <span key={topic} className="meta-item">
                        {topic}
                      </span>
                    ))}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
