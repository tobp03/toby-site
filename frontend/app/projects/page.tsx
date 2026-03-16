import { Suspense } from "react";
import ProjectsList, { ProjectItem } from "./projects-list";
import { formatProjectDate, getProjects } from "../../lib/projects";

export default function ProjectsPage() {
  const projects = getProjects();

  const items: ProjectItem[] = projects.map((project) => ({
    ...project,
    dateLabel: formatProjectDate(project.date),
  }));

  return (
    <main style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1>Projects</h1>
      <Suspense fallback={<p>Loading projects...</p>}>
        <ProjectsList items={items} />
      </Suspense>
    </main>
  );
}
