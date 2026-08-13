import type {
  CreateProjectRequest,
  GetAllProjectsParams,
  GetAllProjectsResponse,
  Project,
} from "@/types/project";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export class ProjectApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ProjectApiError";
  }
}

function errorMessage(data: unknown, fallback: string) {
  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message: unknown }).message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string") return message;
  }

  return fallback;
}

export async function getProjects(
  params: GetAllProjectsParams = {},
): Promise<GetAllProjectsResponse> {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 20),
  });

  if (params.search) {
    query.set("search", params.search);
  }

  const response = await fetch(`${API_URL}/projects?${query}`);

  if (!response.ok) {
    throw new ProjectApiError(response.status, "Could not load projects");
  }

  return response.json();
}

export async function createProject(
  dto: CreateProjectRequest,
): Promise<Project> {
  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ProjectApiError(
      response.status,
      errorMessage(data, "Could not create project"),
    );
  }

  return response.json();
}
