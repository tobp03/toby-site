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
  category: string[];
  tools: string[];
  oneLine: string;
  content: string;
  gitUrl?: string;
  liveUrl?: string;
};

type ProjectsListProps = {
  items: ProjectItem[];
};

export default function ProjectsList({ items }: ProjectsListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dismissedQueryId, setDismissedQueryId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const projectParam = searchParams.get("project");
  const resolvedActiveId =
    activeId ?? (projectParam && projectParam !== dismissedQueryId ? projectParam : null);
  const activeItem = items.find((item) => item.id === resolvedActiveId) ?? null;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveId(null);
        if (projectParam) {
          setDismissedQueryId(projectParam);
        }
      }
    };

    if (activeItem) {
      window.addEventListener("keydown", onKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeItem, projectParam]);

  if (!items.length) {
    return <p>Coming soon...</p>;
  }

  const openProject = (id: string) => {
    setDismissedQueryId(null);
    setActiveId(id);
  };

  const closeProject = () => {
    setActiveId(null);
    if (projectParam) {
      setDismissedQueryId(projectParam);
    }
  };

  return (
    <>
      <div className="project-cards">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="project-card project-card-button project-card-projects"
            onClick={() => openProject(item.id)}
          >
            <h2>{item.title}</h2>
            <p className="project-card-date">{item.dateLabel}</p>
            <p className="project-card-summary">
              {item.oneLine || "Open project details"}
            </p>
            <p className="project-card-tools">{item.tools.join(" • ")}</p>
            <div className="project-card-badges">
              {item.category.map((category) => (
                <span key={category} className="project-card-badge">
                  {category}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {activeItem ? (
        <div className="project-modal" role="dialog" aria-modal="true">
          <button
            type="button"
            className="project-overlay"
            onClick={closeProject}
            aria-label="Close project details"
          />
          <div className="project-panel">
            <div className="project-panel-header">
              <div>
                <p className="project-panel-date">{activeItem.dateLabel}</p>
                <h2>{activeItem.title}</h2>
                <div className="project-meta">
                  {activeItem.tools.length ? (
                    <span className="project-meta-chip">
                      Tools: {activeItem.tools.join(" • ")}
                    </span>
                  ) : null}
                  {activeItem.category.length ? (
                    <span className="project-meta-chip">
                      Category: {activeItem.category.join(" • ")}
                    </span>
                  ) : null}
                </div>
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
                  onClick={closeProject}
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
                    const hasImageNode = node?.children?.some((child) => {
                      if (child.type !== "element") return false;
                      return "tagName" in child && child.tagName === "img";
                    });
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
