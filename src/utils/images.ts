import { InfrastructureProject } from "../types/Project";

export function getProjectFallbackImage(project: Pick<InfrastructureProject, "category" | "city" | "country" | "name" | "id">): string {
  const queryParts = [
    "infrastructure",
    project.category,
    project.city,
    project.country,
    project.name,
  ]
    .filter(Boolean)
    .join(",");

  // Featured images from Unsplash by keywords. Deterministic enough and realistic.
  return `https://source.unsplash.com/featured/800x600?${encodeURIComponent(queryParts)}`;
}

export function attachImgOnErrorFallback(e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackUrl: string): void {
  const target = e.target as HTMLImageElement;
  if (!target) return;
  if (target.dataset.fallbackApplied === "1") return; // avoid loops
  target.src = fallbackUrl;
  target.dataset.fallbackApplied = "1";
}


