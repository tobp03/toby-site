import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNoteBySlug, getNoteSlugs } from "../../../../lib/notes";
import SubjectNotesClient from "./subject-notes-client";

type SubjectPageProps = {
  params: { subject: string } | Promise<{ subject: string }>;
};

function formatLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function SubjectPage({
  params,
}: SubjectPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const subject = decodeURIComponent(resolvedParams.subject);

  const notes = getNoteSlugs()
    .map((slug) => getNoteBySlug(slug))
    .filter((note) => (note.data.subjects ?? []).includes(subject));

  if (notes.length === 0) {
    notFound();
  }

  const items = notes.map((note) => ({
    slug: note.slug,
    title: note.data.title ?? note.slug,
    date: note.data.date ?? "",
    topics: note.data.topics ?? [],
  }));

  return (
    <main style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1>Subject: {formatLabel(subject)}</h1>
      <p>
        <Link href="/notes">Back to notes</Link>
      </p>
      <Suspense fallback={<p>Loading notes...</p>}>
        <SubjectNotesClient notes={items} subject={subject} />
      </Suspense>
    </main>
  );
}

export function generateStaticParams() {
  const subjects = Array.from(
    new Set(
      getNoteSlugs()
        .map((slug) => getNoteBySlug(slug))
        .flatMap((note) => note.data.subjects ?? []),
    ),
  );

  return subjects.map((subject) => ({ subject }));
}
