import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { notFound } from "next/navigation";
import { getNoteBySlug } from "../../../lib/notes";

type NotePageProps = {
  params: { slug: string } | Promise<{ slug: string }>;
};

function createSlugger() {
  const counts = new Map<string, number>();
  return (value: string) => {
    const base = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    const current = counts.get(base) ?? 0;
    counts.set(base, current + 1);
    return current === 0 ? base : `${base}-${current}`;
  };
}

function getTextFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children.map(getTextFromChildren).join("");
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(children)) {
    return getTextFromChildren(children.props.children);
  }
  return "";
}

export default async function NotePage({ params }: NotePageProps) {
  const resolvedParams = await Promise.resolve(params);
  const slug = decodeURIComponent(resolvedParams.slug);
  const note = (() => {
    try {
      return getNoteBySlug(slug);
    } catch {
      notFound();
    }
  })();
  const renderSlugger = createSlugger();

  return (
    <main className="notes-reader">
      <div className="notes-content-wrap">
        <div className="notes-content">
          <nav className="notes-sidebar-nav" aria-label="Primary">
            <Link href="/notes">Back</Link>
          </nav>
          <h1>{note.data.title ?? note.slug}</h1>
          {(() => {
            const topics = note.data.topics ?? [];
            const formatUpdated = (value?: string) => {
              if (!value) return "";
              const parsed = new Date(value);
              if (Number.isNaN(parsed.getTime())) {
                return value.replace("T", " ").replace(/:\d{2}(?:\.\d+)?$/, "");
              }
              return parsed.toISOString().slice(0, 16).replace("T", " ");
            };
            const hasMeta = note.data.date || note.data.updated || topics.length;
            return hasMeta ? (
              <p className="meta-line">
                {note.data.date ? (
                  <span className="meta-item">{`Created: ${note.data.date}`}</span>
                ) : null}
                {note.data.updated ? (
                  <span className="meta-item">
                    {`Updated: ${formatUpdated(note.data.updated)}`}
                  </span>
                ) : null}
                {topics.map((topic) => (
                  <span key={topic} className="meta-item">
                    {topic}
                  </span>
                ))}
              </p>
            ) : null;
          })()}
          <div className="note-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
              components={{
                h1({ children }) {
                  const text = getTextFromChildren(children);
                  const id = renderSlugger(text);
                  return <h1 id={id}>{children}</h1>;
                },
                h2({ children }) {
                  const text = getTextFromChildren(children);
                  const id = renderSlugger(text);
                  return <h2 id={id}>{children}</h2>;
                },
              }}
            >
              {note.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </main>
  );
}
