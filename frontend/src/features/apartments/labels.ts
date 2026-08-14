import {
  ApartmentImageType,
  ApartmentType,
  FinishingStatus,
} from "@/types/apartment";

export const APARTMENT_TYPE_LABELS: Record<ApartmentType, string> = {
  [ApartmentType.Studio]: "Studio",
  [ApartmentType.Apartment]: "Apartment",
  [ApartmentType.Duplex]: "Duplex",
  [ApartmentType.Penthouse]: "Penthouse",
};

export const FINISHING_STATUS_LABELS: Record<FinishingStatus, string> = {
  [FinishingStatus.CoreAndShell]: "Core & shell",
  [FinishingStatus.SemiFinished]: "Semi finished",
  [FinishingStatus.Finished]: "Finished",
};

export const APARTMENT_IMAGE_TYPE_LABELS: Record<ApartmentImageType, string> = {
  [ApartmentImageType.Hero]: "Hero",
  [ApartmentImageType.Carousel]: "Carousel",
};

export function formatPrice(value: string | number) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return String(value);
  }

  return `EGP ${amount.toLocaleString("en-EG", {
    maximumFractionDigits: 0,
  })}`;
}

export function formatArea(value: string | number) {
  const area = Number(value);

  if (!Number.isFinite(area)) {
    return String(value);
  }

  return `${area.toLocaleString("en-EG", { maximumFractionDigits: 0 })} m²`;
}
