import type { UploadResponse } from "@/types/upload";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export class UploadApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "UploadApiError";
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

export async function uploadFile(file: File): Promise<UploadResponse> {
  const body = new FormData();
  body.append("file", file);

  const response = await fetch(`${API_URL}/uploads`, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new UploadApiError(
      response.status,
      errorMessage(data, "Could not upload image"),
    );
  }

  return response.json();
}
