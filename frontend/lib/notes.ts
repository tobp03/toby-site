import fs from "fs";
import path from "path";

export type NoteFrontmatter = {
  title?: string;
  date?: string;
  updated?: string;
  subjects?: string[];
  topics?: string[];
};

type ParsedNote = {
  data: NoteFrontmatter;
  content: string;
};

const NOTES_DIR = path.join(process.cwd(), "content", "notes", "_published");

function parseFrontmatterValue(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatterList(value: string) {
  const trimmed = value.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) {
    return [];
  }
  const inner = trimmed.slice(1, -1).trim();
  if (!inner) {
    return [];
  }
  return inner
    .split(",")
    .map((item) => parseFrontmatterValue(item))
    .filter((item) => item.length > 0);
}

export function parseFrontmatter(markdown: string): ParsedNote {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return { data: {}, content: markdown };
  }

  const raw = match[1];
  const content = markdown.slice(match[0].length);
  const data: NoteFrontmatter = {};

  raw.split("\n").forEach((line) => {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      return;
    }
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1);

    if (key.length === 0) {
      return;
    }

    if (key === "title") {
      data.title = parseFrontmatterValue(value);
    } else if (key === "date") {
      data.date = parseFrontmatterValue(value);
    } else if (key === "updated") {
      data.updated = parseFrontmatterValue(value);
    } else if (key === "subjects") {
      data.subjects = parseFrontmatterList(value);
    } else if (key === "topics") {
      data.topics = parseFrontmatterList(value);
    }
  });

  return { data, content };
}

export function getNoteSlugs() {
  return fs
    .readdirSync(NOTES_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(".md", ""));
}

export function getNoteBySlug(slug: string) {
  const filePath = path.join(NOTES_DIR, `${slug}.md`);
  const markdown = fs.readFileSync(filePath, "utf8");
  const parsed = parseFrontmatter(markdown);

  return {
    slug,
    ...parsed,
  };
}
