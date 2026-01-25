"use client";

import { useEffect, useState, isValidElement, Children } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export type ProjectItem = {
  id: string;
  title: string;
  date: string;
  dateLabel: string;
  content: string;
  gitUrl?: string;
  liveUrl?: string;
};

type ProjectsListProps = {
  items: ProjectItem[];
};

export default function ProjectsList({ items }: ProjectsListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const activeItem = items.find((item) => item.id === activeId) ?? null;

  useEffect(() => {
    const projectParam = searchParams.get("project");
    if (projectParam) {
      setActiveId(projectParam);
      return;
    }
    setActiveId(null);
  }, [searchParams]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveId(null);
      }
    };

    if (activeItem) {
      window.addEventListener("keydown", onKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeItem]);

  if (!items.length) {
    return <p>Coming soon...</p>;
  }

  return (
    <>
      <ul className="projects-list">
        {items.map((item) => (
          <li key={item.id}>
            <span className="note-updated">{item.dateLabel}</span>{" "}
            <span aria-hidden="true">•</span>{" "}
            <button
              type="button"
              className="project-link"
              onClick={() => setActiveId(item.id)}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>

      {activeItem ? (
        <div className="project-modal" role="dialog" aria-modal="true">
          <button
            type="button"
            className="project-overlay"
            onClick={() => setActiveId(null)}
            aria-label="Close project details"
          />
          <div className="project-panel">
            <div className="project-panel-header">
              <div>
                <p className="project-panel-date">{activeItem.dateLabel}</p>
                <h2>{activeItem.title}</h2>
              </div>
              <div className="project-panel-actions">
                {activeItem.gitUrl ? (
                  <a
                    href={activeItem.gitUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open GitHub repository"
                    className="project-icon-link"
                  >
                    <span className="theme-icon" aria-hidden="true">
                      <img className="icon-light" src="/github_light.svg" alt="" />
                      <img className="icon-dark" src="/github_dark.svg" alt="" />
                    </span>
                  </a>
                ) : null}
                {activeItem.liveUrl ? (
                  <a
                    href={activeItem.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open live project"
                    className="project-icon-link"
                  >
                    <span className="theme-icon" aria-hidden="true">
                      <img className="icon-light" src="/play_light.svg" alt="" />
                      <img className="icon-dark" src="/play_dark.svg" alt="" />
                    </span>
                  </a>
                ) : null}
                <button
                  type="button"
                  className="project-close"
                  onClick={() => setActiveId(null)}
                >
                  Close
                </button>
              </div>
            </div>
            <div className="project-panel-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  p: ({ children, node }) => {
                    const childArray = Children.toArray(children);
                    const meaningfulChildren = childArray.filter((child) => {
                      if (typeof child === "string") {
                        return child.trim() !== "";
                      }
                      return true;
                    });
                    const hasImageNode = node?.children?.some(
                      (child) => child.type === "image",
                    );
                    const hasFigureOrImage = meaningfulChildren.some(
                      (child) =>
                        isValidElement(child) &&
                        (child.type === "figure" || child.type === "img"),
                    );
                    if (hasImageNode) {
                      return <div>{children}</div>;
                    }
                    if (
                      meaningfulChildren.length === 1 &&
                      isValidElement(meaningfulChildren[0]) &&
                      meaningfulChildren[0].type === "figure"
                    ) {
                      return <>{meaningfulChildren}</>;
                    }
                    if (hasFigureOrImage) {
                      return <div>{children}</div>;
                    }
                    return <p>{children}</p>;
                  },
                  img: ({ alt, title, ...props }) => {
                    const caption = title || alt;
                    if (!caption) {
                      return <img {...props} alt={alt ?? ""} />;
                    }
                    return (
                      <figure className="project-figure">
                        <img {...props} alt={alt ?? ""} />
                        <figcaption>{caption}</figcaption>
                      </figure>
                    );
                  },
                }}
              >
                {activeItem.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
