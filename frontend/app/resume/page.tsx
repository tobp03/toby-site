import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";

export default function CVPage() {
  const filePath = path.join(process.cwd(), "content", "resume.md");
  const markdown = fs.readFileSync(filePath, "utf8");

  return (
    <main className="resume-page" style={{ padding: 36, maxWidth: 1040, margin: "0 auto" }}>
      <div className="resume-download-row">
        <a className="resume-download-button" href="/resume.pdf" download>
          Download PDF
        </a>
      </div>
      <div className="resume-card">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </main>
  );
}
