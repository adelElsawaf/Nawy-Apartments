"use client";

import { useEffect, useState } from "react";
import { ApartmentApiError, getApartment } from "@/lib/api/apartments";
import type { Apartment } from "@/types/apartment";

export function useApartment(id: string) {
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId < 1) {
      setApartment(null);
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const data = await getApartment(parsedId);
        if (!cancelled) {
          setApartment(data);
        }
      } catch (caught) {
        if (cancelled) {
          return;
        }

        if (caught instanceof ApartmentApiError && caught.status === 404) {
          setNotFound(true);
          setApartment(null);
          return;
        }

        setError("Could not load apartment. Try again in a moment.");
        setApartment(null);
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
  }, [id]);

  return { apartment, loading, error, notFound };
}
