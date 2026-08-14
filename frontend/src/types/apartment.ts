import type { Project } from "@/types/project";

export enum ApartmentType {
  Studio = "studio",
  Apartment = "apartment",
  Duplex = "duplex",
  Penthouse = "penthouse",
}

export enum FinishingStatus {
  CoreAndShell = "core_and_shell",
  SemiFinished = "semi_finished",
  Finished = "finished",
}

export enum ApartmentImageType {
  Hero = "hero",
  Carousel = "carousel",
}

export type ApartmentListItem = {
  id: number;
  unitName: string;
  unitNumber: string;
  type: ApartmentType;
  price: string;
  area: string;
  bedrooms: number;
  project: Project | null;
  imageUrl: string | null;
};

export type ApartmentImage = {
  id: number;
  path: string;
  url: string;
  type: ApartmentImageType;
  createdAt: string;
};

export type Apartment = {
  id: number;
  unitName: string;
  unitNumber: string;
  type: ApartmentType;
  project: Project | null;
  description: string | null;
  price: string;
  area: string;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  floor: number | null;
  finishingStatus: FinishingStatus;
  images: ApartmentImage[];
  createdAt: string;
};

export type GetAllApartmentsParams = {
  page?: number;
  limit?: number;
  search?: string;
  projectId?: number;
  type?: ApartmentType;
  finishingStatus?: FinishingStatus;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
};

export type GetAllApartmentsResponse = {
  data: ApartmentListItem[];
  page: number;
  limit: number;
  hasNextPage: boolean;
};

export type CreateApartmentImageRequest = {
  path: string;
  type: ApartmentImageType;
};

export type CreateApartmentRequest = {
  unitName: string;
  unitNumber: string;
  type: ApartmentType;
  projectId?: number | null;
  description?: string | null;
  price: number;
  area: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  floor?: number | null;
  finishingStatus: FinishingStatus;
  images?: CreateApartmentImageRequest[];
};
