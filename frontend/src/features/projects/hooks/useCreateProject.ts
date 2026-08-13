"use client";

import { createProject, ProjectApiError } from "@/lib/api/projects";
import type { CreateProjectRequest } from "@/types/project";

type CreateProjectResult =
  | { ok: true }
  | { ok: false; field: "name" | "root"; message: string };

export function useCreateProject() {
  async function submit(
    dto: CreateProjectRequest,
  ): Promise<CreateProjectResult> {
    try {
      await createProject(dto);
      return { ok: true };
    } catch (error) {
      if (error instanceof ProjectApiError && error.status === 409) {
        return { ok: false, field: "name", message: error.message };
      }

      return {
        ok: false,
        field: "root",
        message:
          error instanceof Error ? error.message : "Could not create project",
      };
    }
  }

  return { submit };
}
