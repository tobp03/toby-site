import Link from "next/link";
import { notFound } from "next/navigation";
import { getNoteBySlug, getNoteSlugs } from "../../../../lib/notes";

type SubjectPageProps = {
  params: { subject: string } | Promise<{ subject: string }>;
  searchParams?: { topic?: string } | Promise<{ topic?: string }>;
};

function formatLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function SubjectPage({
  params,
  searchParams,
}: SubjectPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const subject = decodeURIComponent(resolvedParams.subject);
  const resolvedSearch = await Promise.resolve(searchParams);
  const activeTopic = resolvedSearch?.topic
    ? decodeURIComponent(resolvedSearch.topic)
    : "";

  const notes = getNoteSlugs()
    .map((slug) => getNoteBySlug(slug))
    .filter((note) => (note.data.subjects ?? []).includes(subject));

  if (notes.length === 0) {
    notFound();
  }

  const topicOptions = Array.from(
    new Set(notes.flatMap((note) => note.data.topics ?? [])),
  ).sort((a, b) => a.localeCompare(b));

  const filteredNotes = activeTopic
    ? notes.filter((note) => (note.data.topics ?? []).includes(activeTopic))
    : notes;

  const sortedNotes = filteredNotes.sort((a, b) =>
    (b.data.date ?? "").localeCompare(a.data.date ?? ""),
  );

  return (
    <main style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1>Subject: {formatLabel(subject)}</h1>
      <p>
        <Link href="/notes">Back to notes</Link>
      </p>

      <section style={{ marginTop: 24 }}>
        <h2>Filter by topic</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <Link
            href={`/notes/subject/${encodeURIComponent(subject)}`}
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
              href={`/notes/subject/${encodeURIComponent(
                subject,
              )}?topic=${encodeURIComponent(topic)}`}
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

      <section style={{ marginTop: 24 }}>
        <h2>Latest notes</h2>
        <ul>
          {sortedNotes.map((note) => {
            const topics = note.data.topics ?? [];
            return (
              <li key={note.slug}>
                <Link href={`/notes/${note.slug}`}>
                  {note.data.title ?? note.slug}
                </Link>
                {(note.data.date || topics.length) ? (
                  <div className="meta-line">
                    {note.data.date ? (
                      <span className="meta-item">{note.data.date}</span>
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
