"use client";

import { useEffect, useState } from "react";
import { getApartments } from "@/lib/api/apartments";
import { getProjects } from "@/lib/api/projects";
import type {
  ApartmentListItem,
  ApartmentType,
  FinishingStatus,
  GetAllApartmentsParams,
} from "@/types/apartment";
import type { Project } from "@/types/project";

const LIMIT = 20;

export type ApartmentFilterForm = {
  search: string;
  projectId: string;
  type: string;
  finishingStatus: string;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  rooms: string;
  bedrooms: string;
  bathrooms: string;
  floor: string;
};

export const EMPTY_FILTERS: ApartmentFilterForm = {
  search: "",
  projectId: "",
  type: "",
  finishingStatus: "",
  minPrice: "",
  maxPrice: "",
  minArea: "",
  maxArea: "",
  rooms: "",
  bedrooms: "",
  bathrooms: "",
  floor: "",
};

function toOptionalNumber(value: string) {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function toApartmentParams(
  form: ApartmentFilterForm,
): GetAllApartmentsParams {
  return {
    search: form.search.trim() || undefined,
    projectId: toOptionalNumber(form.projectId),
    type: (form.type || undefined) as ApartmentType | undefined,
    finishingStatus: (form.finishingStatus || undefined) as
      | FinishingStatus
      | undefined,
    minPrice: toOptionalNumber(form.minPrice),
    maxPrice: toOptionalNumber(form.maxPrice),
    minArea: toOptionalNumber(form.minArea),
    maxArea: toOptionalNumber(form.maxArea),
    rooms: toOptionalNumber(form.rooms),
    bedrooms: toOptionalNumber(form.bedrooms),
    bathrooms: toOptionalNumber(form.bathrooms),
    floor: toOptionalNumber(form.floor),
  };
}

export function hasActiveFilters(form: ApartmentFilterForm) {
  return Object.values(form).some((value) => value.trim() !== "");
}

export function useApartments() {
  const [draft, setDraft] = useState<ApartmentFilterForm>(EMPTY_FILTERS);
  const [applied, setApplied] = useState<ApartmentFilterForm>(EMPTY_FILTERS);
  const [projects, setProjects] = useState<Project[]>([]);
  const [apartments, setApartments] = useState<ApartmentListItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await getApartments({
          ...toApartmentParams(applied),
          page: 1,
          limit: LIMIT,
        });

        if (cancelled) {
          return;
        }

        setApartments(data.data);
        setPage(data.page);
        setHasNextPage(data.hasNextPage);
      } catch {
        if (!cancelled) {
          setError("Could not load apartments. Try again in a moment.");
          setApartments([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [applied]);

  async function loadMore() {
    setLoadingMore(true);
    setError(null);

    try {
      const data = await getApartments({
        ...toApartmentParams(applied),
        page: page + 1,
        limit: LIMIT,
      });

      setApartments((current) => [...current, ...data.data]);
      setPage(data.page);
      setHasNextPage(data.hasNextPage);
    } catch {
      setError("Could not load more apartments.");
    } finally {
      setLoadingMore(false);
    }
  }

  function applyFilters() {
    setApplied({ ...draft, search: draft.search.trim() });
  }

  function clearFilters() {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
  }

  return {
    draft,
    setDraft,
    applied,
    projects,
    apartments,
    loading,
    loadingMore,
    hasNextPage,
    error,
    loadMore,
    applyFilters,
    clearFilters,
    hasFilters: hasActiveFilters(applied) || hasActiveFilters(draft),
  };
}
