"use client";

import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SecondaryButton from "@/components/ui/button/SecondaryButton";
import { ApartmentImageType } from "@/types/apartment";
import type { PendingApartmentImage } from "./hooks/useCreateApartment";
import { APARTMENT_IMAGE_TYPE_LABELS } from "./labels";

const MAX_IMAGES = 20;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type ApartmentImagePickerProps = {
  images: PendingApartmentImage[];
  onChange: (images: PendingApartmentImage[]) => void;
  error?: string;
  disabled?: boolean;
};

export default function ApartmentImagePicker({
  images,
  onChange,
  error,
  disabled,
}: ApartmentImagePickerProps) {
  function addFiles(fileList: FileList | null) {
    if (!fileList || disabled) {
      return;
    }

    const remaining = MAX_IMAGES - images.length;
    const next: PendingApartmentImage[] = [...images];

    for (const file of Array.from(fileList).slice(0, remaining)) {
      if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE_BYTES) {
        continue;
      }

      next.push({
        id: crypto.randomUUID(),
        file,
        type:
          next.length === 0
            ? ApartmentImageType.Hero
            : ApartmentImageType.Carousel,
        preview: URL.createObjectURL(file),
      });
    }

    onChange(next);
  }

  function updateType(id: string, type: ApartmentImageType) {
    onChange(
      images.map((image) => (image.id === id ? { ...image, type } : image)),
    );
  }

  function removeImage(id: string) {
    const image = images.find((item) => item.id === id);
    if (image) {
      URL.revokeObjectURL(image.preview);
    }

    onChange(images.filter((item) => item.id !== id));
  }

  return (
    <Stack spacing={1.5}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700 }}>Images</Typography>
          <Typography variant="body2" color="text.secondary">
            Upload first, then we save the returned path. JPEG, PNG, WEBP, or GIF.
            Max 5MB each, up to {MAX_IMAGES}.
          </Typography>
        </Box>
        <SecondaryButton component="label" disabled={disabled || images.length >= MAX_IMAGES}>
          Add images
          <input
            hidden
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </SecondaryButton>
      </Stack>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      {images.length > 0 && (
        <Stack spacing={1.5}>
          {images.map((image) => (
            <Stack
              key={image.id}
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.default",
                alignItems: { sm: "center" },
              }}
            >
              <Box
                component="img"
                src={image.preview}
                alt={image.file.name}
                sx={{
                  width: { xs: "100%", sm: 96 },
                  height: 72,
                  objectFit: "cover",
                  borderRadius: 1.5,
                  display: "block",
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap sx={{ fontWeight: 600 }}>
                  {image.file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(image.file.size / 1024).toFixed(0)} KB
                </Typography>
              </Box>
              <TextField
                select
                label="Type"
                size="small"
                value={image.type}
                disabled={disabled}
                onChange={(event) =>
                  updateType(image.id, event.target.value as ApartmentImageType)
                }
                sx={{ minWidth: 140 }}
              >
                {Object.values(ApartmentImageType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {APARTMENT_IMAGE_TYPE_LABELS[type]}
                  </MenuItem>
                ))}
              </TextField>
              <SecondaryButton
                type="button"
                disabled={disabled}
                onClick={() => removeImage(image.id)}
              >
                Remove
              </SecondaryButton>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
