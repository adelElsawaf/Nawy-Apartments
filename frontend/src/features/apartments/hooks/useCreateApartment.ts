"use client";

import { useEffect, useState } from "react";
import { ApartmentApiError, createApartment } from "@/lib/api/apartments";
import { getProjects } from "@/lib/api/projects";
import { UploadApiError, uploadFile } from "@/lib/api/uploads";
import type {
  ApartmentImageType,
  CreateApartmentRequest,
} from "@/types/apartment";
import type { Project } from "@/types/project";

export type PendingApartmentImage = {
  id: string;
  file: File;
  type: ApartmentImageType;
  preview: string;
};

type CreateApartmentResult =
  | { ok: true; id: number }
  | {
      ok: false;
      field: "unitNumber" | "projectId" | "images" | "root";
      message: string;
    };

export function useCreateApartment() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let cancelled = false;

    getProjects({ page: 1, limit: 50 })
      .then((response) => {
        if (!cancelled) {
          setProjects(response.data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProjects([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(
    dto: Omit<CreateApartmentRequest, "images">,
    images: PendingApartmentImage[],
  ): Promise<CreateApartmentResult> {
    try {
      const uploaded = await Promise.all(
        images.map(async (image) => {
          const stored = await uploadFile(image.file);
          return { path: stored.path, type: image.type };
        }),
      );

      const apartment = await createApartment({
        ...dto,
        ...(uploaded.length ? { images: uploaded } : {}),
      });

      return { ok: true, id: apartment.id };
    } catch (error) {
      if (error instanceof UploadApiError) {
        return { ok: false, field: "images", message: error.message };
      }

      if (error instanceof ApartmentApiError && error.status === 409) {
        return { ok: false, field: "unitNumber", message: error.message };
      }

      if (error instanceof ApartmentApiError && error.status === 404) {
        return { ok: false, field: "projectId", message: error.message };
      }

      return {
        ok: false,
        field: "root",
        message:
          error instanceof Error ? error.message : "Could not create apartment",
      };
    }
  }

  return { projects, submit };
}
