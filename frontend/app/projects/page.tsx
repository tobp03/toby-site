import fs from "fs";
import path from "path";
import ProjectsList, { ProjectItem } from "./projects-list";

export default function ProjectsPage() {
  const projectsDir = path.join(process.cwd(), "content", "projects");
  const projects = fs
    .readdirSync(projectsDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(projectsDir, file);
      const markdown = fs.readFileSync(filePath, "utf8");
      const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
      const frontmatter = frontmatterMatch?.[1] ?? "";
      const content = frontmatterMatch
        ? markdown.slice(frontmatterMatch[0].length)
        : markdown;

      let title = "";
      let date = "";
      let gitUrl = "";
      let liveUrl = "";

      frontmatter.split("\n").forEach((line) => {
        const separatorIndex = line.indexOf(":");
        if (separatorIndex === -1) return;
        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim();
        const cleaned =
          (value.startsWith("\"") && value.endsWith("\"")) ||
          (value.startsWith("'") && value.endsWith("'"))
            ? value.slice(1, -1)
            : value;
        if (key === "title") title = cleaned;
        if (key === "date") date = cleaned;
        if (key === "git_url") gitUrl = cleaned;
        if (key === "live_url") liveUrl = cleaned;
      });

      return {
        id: file.replace(".md", ""),
        title: title || file.replace(".md", ""),
        date,
        gitUrl,
        liveUrl,
        content: content.trim(),
      };
    })
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  const formatDate = (value?: string) => {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      const parts = value.split("-");
      if (parts.length === 3) {
        const [y, m, d] = parts;
        const months = [
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
        const idx = Number.parseInt(m, 10) - 1;
        const mon = months[idx] || m;
        return `${y}-${mon}-${d}`;
      }
      return value;
    }
    const months = [
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
    const year = parsed.getUTCFullYear();
    const month = months[parsed.getUTCMonth()];
    const day = String(parsed.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const items: ProjectItem[] = projects.map((project) => ({
    ...project,
    dateLabel: formatDate(project.date),
  }));

  return (
    <main style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1>Projects</h1>
      <ProjectsList items={items} />
    </main>
  );
}
