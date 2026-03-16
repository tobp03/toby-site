import fs from "fs";
import path from "path";

export type Project = {
  id: string;
  title: string;
  date: string;
  category: string[];
  tools: string[];
  oneLine: string;
  content: string;
  gitUrl?: string;
  liveUrl?: string;
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function stripQuotes(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseListValue(value: string) {
  const trimmed = value.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) {
    return trimmed ? [stripQuotes(trimmed)] : [];
  }

  return trimmed
    .slice(1, -1)
    .split(",")
    .map((item) => stripQuotes(item))
    .filter(Boolean);
}

export function formatProjectDate(value?: string) {
  if (!value) return "";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    const parts = value.split("-");
    if (parts.length === 3) {
      const [y, m, d] = parts;
      const idx = Number.parseInt(m, 10) - 1;
      const month = MONTHS[idx] || m;
      return `${y}-${month}-${d}`;
    }
    return value;
  }

  const year = parsed.getUTCFullYear();
  const month = MONTHS[parsed.getUTCMonth()];
  const day = String(parsed.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getProjects() {
  const projectsDir = path.join(process.cwd(), "content", "projects");

  return fs
    .readdirSync(projectsDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(projectsDir, file);
      const markdown = fs.readFileSync(filePath, "utf8");
      const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
      const frontmatter = frontmatterMatch?.[1] ?? "";
      const content = frontmatterMatch
        ? markdown.slice(frontmatterMatch[0].length).trim()
        : markdown.trim();

      let title = "";
      let date = "";
      let gitUrl = "";
      let liveUrl = "";
      let oneLine = "";
      let category: string[] = [];
      let tools: string[] = [];

      frontmatter.split("\n").forEach((line) => {
        const separatorIndex = line.indexOf(":");
        if (separatorIndex === -1) return;

        const key = line.slice(0, separatorIndex).trim();
        const rawValue = line.slice(separatorIndex + 1).trim();

        if (key === "title") title = stripQuotes(rawValue);
        if (key === "date") date = stripQuotes(rawValue);
        if (key === "git_url") gitUrl = stripQuotes(rawValue);
        if (key === "live_url") liveUrl = stripQuotes(rawValue);
        if (key === "one_line") oneLine = stripQuotes(rawValue);
        if (key === "category") category = parseListValue(rawValue);
        if (key === "tools") tools = parseListValue(rawValue);
      });

      return {
        id: file.replace(".md", ""),
        title: title || file.replace(".md", ""),
        date,
        category,
        tools,
        oneLine,
        content,
        gitUrl: gitUrl || undefined,
        liveUrl: liveUrl || undefined,
      };
    })
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}
