import type {
  Apartment,
  CreateApartmentRequest,
  GetAllApartmentsParams,
  GetAllApartmentsResponse,
} from "@/types/apartment";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export class ApartmentApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApartmentApiError";
  }
}

function appendParams(
  query: URLSearchParams,
  params: GetAllApartmentsParams,
) {
  const entries: [string, string | number | undefined][] = [
    ["search", params.search],
    ["projectId", params.projectId],
    ["type", params.type],
    ["finishingStatus", params.finishingStatus],
    ["minPrice", params.minPrice],
    ["maxPrice", params.maxPrice],
    ["minArea", params.minArea],
    ["maxArea", params.maxArea],
    ["rooms", params.rooms],
    ["bedrooms", params.bedrooms],
    ["bathrooms", params.bathrooms],
    ["floor", params.floor],
  ];

  for (const [key, value] of entries) {
    if (value === undefined || value === "") {
      continue;
    }

    query.set(key, String(value));
  }
}

export async function getApartments(
  params: GetAllApartmentsParams = {},
): Promise<GetAllApartmentsResponse> {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 20),
  });

  appendParams(query, params);

  const response = await fetch(`${API_URL}/apartments?${query}`);

  if (!response.ok) {
    throw new ApartmentApiError(response.status, "Could not load apartments");
  }

  return response.json();
}

function errorMessage(data: unknown, fallback: string) {
  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message: unknown }).message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string") return message;
  }

  return fallback;
}

export async function getApartment(id: number): Promise<Apartment> {
  const response = await fetch(`${API_URL}/apartments/${id}`);

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApartmentApiError(
      response.status,
      errorMessage(data, "Could not load apartment"),
    );
  }

  return response.json();
}

export async function createApartment(
  dto: CreateApartmentRequest,
): Promise<Apartment> {
  const response = await fetch(`${API_URL}/apartments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApartmentApiError(
      response.status,
      errorMessage(data, "Could not create apartment"),
    );
  }

  return response.json();
}
