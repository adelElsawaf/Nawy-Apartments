"use client";

import { useEffect, useState } from "react";
import { getProjects } from "@/lib/api/projects";
import type { Project } from "@/types/project";

const LIMIT = 20;

export function useProjects() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await getProjects({
          page: 1,
          limit: LIMIT,
          search: search || undefined,
        });

        if (cancelled) return;

        setProjects(data.data);
        setPage(data.page);
        setHasNextPage(data.hasNextPage);
      } catch {
        if (!cancelled) {
          setError("Could not load projects. Try again in a moment.");
          setProjects([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [search]);

  async function loadMore() {
    setLoadingMore(true);
    setError(null);

    try {
      const data = await getProjects({
        page: page + 1,
        limit: LIMIT,
        search: search || undefined,
      });

      setProjects((current) => [...current, ...data.data]);
      setPage(data.page);
      setHasNextPage(data.hasNextPage);
    } catch {
      setError("Could not load more projects.");
    } finally {
      setLoadingMore(false);
    }
  }

  function applySearch() {
    setSearch(searchInput.trim());
  }

  function clearSearch() {
    setSearchInput("");
    setSearch("");
  }

  return {
    searchInput,
    setSearchInput,
    search,
    applySearch,
    clearSearch,
    projects,
    loading,
    loadingMore,
    hasNextPage,
    error,
    loadMore,
  };
}
