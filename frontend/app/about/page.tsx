import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { withBasePath } from "../../lib/site";

type AboutImage = {
  alt: string;
  src: string;
};

type AboutSection = {
  heading: string;
  markdown: string;
  images: AboutImage[];
};

function parseSection(sectionMarkdown: string): AboutSection {
  const lines = sectionMarkdown
    .split("\n")
    .map((line) => line.trimEnd());
  const images: AboutImage[] = [];
  const contentLines: string[] = [];
  const headingMatch = lines.find((line) => line.startsWith("## "));
  const heading = headingMatch ? headingMatch.replace(/^##\s+/, "").trim() : "";

  for (const line of lines) {
    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)\s]+(?:\s+"[^"]*")?)\)$/);
    if (imageMatch) {
      const [, alt, rawSrc] = imageMatch;
      const src = rawSrc.replace(/\s+"[^"]*"$/, "");
      images.push({ alt, src });
      continue;
    }
    contentLines.push(line);
  }

  return {
    heading,
    markdown: contentLines.join("\n").trim(),
    images,
  };
}

function parseAboutMarkdown(markdown: string) {
  const normalized = markdown.trim();
  const splitSections = normalized.split(/\n(?=## )/);
  const intro = parseSection(splitSections[0] ?? "");
  const stories = splitSections.slice(1).map(parseSection).filter((section) => {
    return section.markdown.length > 0 || section.images.length > 0;
  });

  return { intro, stories };
}

function MarkdownBlock({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={{
        a: ({ href, ...props }) => (
          <a {...props} href={href ? withBasePath(href) : href} />
        ),
        img: ({ src, alt, ...props }) => (
          <img
            {...props}
            src={typeof src === "string" ? withBasePath(src) : undefined}
            alt={alt ?? ""}
          />
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}

function MediaColumn({ images }: { images: AboutImage[] }) {
  if (!images.length) return null;

  return (
    <div className="about-media">
      {images.map((image) => (
        <figure key={`${image.src}-${image.alt}`} className="about-figure">
          <img src={withBasePath(image.src)} alt={image.alt} />
        </figure>
      ))}
    </div>
  );
}

export default function AboutPage() {
  const filePath = path.join(process.cwd(), "content", "about.md");
  const markdown = fs.readFileSync(filePath, "utf8");
  const { intro, stories } = parseAboutMarkdown(markdown);

  return (
    <main className="about-page">
      <div className="about-content">
        <section className="about-section about-section-intro">
          <div className="about-copy">
            <MarkdownBlock markdown={intro.markdown} />
          </div>
          <MediaColumn images={intro.images} />
        </section>

        {stories.map((story) => (
          <section
            key={story.markdown}
            className={[
              "about-section",
              story.heading === "I like taking pictures"
                ? "about-section-gallery"
                : "",
              story.heading === "These days" ? "about-section-single" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="about-copy">
              <MarkdownBlock markdown={story.markdown} />
            </div>
            <MediaColumn images={story.images} />
          </section>
        ))}
      </div>
    </main>
  );
}
