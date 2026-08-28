import { Suspense } from "react";
import { getNoteBySlug, getNoteSlugs } from "../../lib/notes";
import NotesIndexClient, { type NotesIndexItem } from "./notes-index-client";

export default function NotesPage() {
  const slugs = getNoteSlugs();
  const notes: NotesIndexItem[] = slugs
    .map((slug) => getNoteBySlug(slug))
    .sort((a, b) =>
      (b.data.updated ?? b.data.date ?? "").localeCompare(
        a.data.updated ?? a.data.date ?? "",
      ),
    )
    .map((note) => ({
      slug: note.slug,
      title: note.data.title ?? note.slug,
      date: note.data.date ?? "",
      updated: note.data.updated ?? "",
      subjects: note.data.subjects ?? [],
      topics: note.data.topics ?? [],
    }));

  return (
    <main style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1>Notes</h1>

      <p className="notes-disclaimer">
        Some notes may take a moment to load.
      </p>
      <Suspense fallback={<p>Loading notes...</p>}>
        <NotesIndexClient notes={notes} />
      </Suspense>
    </main>
  );
}
