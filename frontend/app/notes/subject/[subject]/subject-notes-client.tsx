"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type SubjectNoteItem = {
  slug: string;
  title: string;
  date: string;
  topics: string[];
};

type SubjectNotesClientProps = {
  notes: SubjectNoteItem[];
  subject: string;
};

function formatLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function SubjectNotesClient({
  notes,
  subject,
}: SubjectNotesClientProps) {
  const searchParams = useSearchParams();
  const activeTopic = searchParams.get("topic")
    ? decodeURIComponent(searchParams.get("topic") as string)
    : "";

  const topicOptions = Array.from(
    new Set(notes.flatMap((note) => note.topics)),
  ).sort((a, b) => a.localeCompare(b));

  const filteredNotes = activeTopic
    ? notes.filter((note) => note.topics.includes(activeTopic))
    : notes;

  const sortedNotes = [...filteredNotes].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <>
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
          {sortedNotes.map((note) => (
            <li key={note.slug}>
              <Link href={`/notes/${note.slug}`}>{note.title}</Link>
              {(note.date || note.topics.length) ? (
                <div className="meta-line">
                  {note.date ? (
                    <span className="meta-item">{note.date}</span>
                  ) : null}
                  {note.topics.map((topic) => (
                    <span key={topic} className="meta-item">
                      {topic}
                    </span>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
