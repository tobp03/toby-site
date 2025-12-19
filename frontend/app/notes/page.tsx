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

  const slugs = getNoteSlugs();
  const notes = slugs
    .map((slug) => getNoteBySlug(slug))
    .sort((a, b) => (b.data.date ?? "").localeCompare(a.data.date ?? ""));

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
    (b.data.date ?? "").localeCompare(a.data.date ?? ""),
  );

  return (
    <main style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1>Notes</h1>

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
        <h2>Latest notes</h2>
        <ul>
          {sortedNotes.map((note) => {
            const title = note.data.title ?? note.slug;
            const date = note.data.date ?? "";
            const topics = note.data.topics ?? [];
            return (
              <li key={note.slug}>
                <Link href={`/notes/${note.slug}`}>{title}</Link>
                {(date || topics.length) ? (
                  <div className="meta-line">
                    {date ? (
                      <span className="meta-item meta-date">{date}</span>
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
