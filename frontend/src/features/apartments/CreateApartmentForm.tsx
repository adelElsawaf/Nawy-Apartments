"use client";

import { useEffect, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import PrimaryButton from "@/components/ui/button/PrimaryButton";
import SecondaryButton from "@/components/ui/button/SecondaryButton";
import ApartmentImagePicker from "./ApartmentImagePicker";
import {
  type PendingApartmentImage,
  useCreateApartment,
} from "./hooks/useCreateApartment";
import {
  APARTMENT_TYPE_LABELS,
  FINISHING_STATUS_LABELS,
} from "./labels";
import {
  ApartmentType,
  FinishingStatus,
} from "@/types/apartment";

type FormValues = {
  unitName: string;
  unitNumber: string;
  type: ApartmentType;
  projectId: string;
  description: string;
  price: string;
  area: string;
  rooms: string;
  bedrooms: string;
  bathrooms: string;
  floor: string;
  finishingStatus: FinishingStatus;
};

const UNIT_NAME_MAX = 120;
const UNIT_NUMBER_MAX = 50;
const DESCRIPTION_MAX = 2000;

function requiredNumber(label: string, integer = false) {
  return {
    required: `${label} is required`,
    validate: (value: string) => {
      if (!value.trim()) {
        return `${label} is required`;
      }

      const parsed = Number(value);
      if (!Number.isFinite(parsed)) {
        return `${label} must be a number`;
      }

      if (integer && !Number.isInteger(parsed)) {
        return `${label} must be a whole number`;
      }

      if (parsed < 0) {
        return `${label} cannot be negative`;
      }

      return true;
    },
  };
}

export default function CreateApartmentForm() {
  const router = useRouter();
  const { projects, submit } = useCreateApartment();
  const [images, setImages] = useState<PendingApartmentImage[]>([]);
  const [imagesError, setImagesError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const imagesRef = useRef(images);
  imagesRef.current = images;

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      unitName: "",
      unitNumber: "",
      type: ApartmentType.Apartment,
      projectId: "",
      description: "",
      price: "",
      area: "",
      rooms: "",
      bedrooms: "",
      bathrooms: "",
      floor: "",
      finishingStatus: FinishingStatus.Finished,
    },
  });

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, []);

  async function onSubmit(values: FormValues) {
    clearErrors("root");
    setImagesError(undefined);
    const description = values.description.trim();
    const projectId = values.projectId ? Number(values.projectId) : undefined;
    const floor = values.floor.trim() ? Number(values.floor) : undefined;

    if (values.floor.trim() && !Number.isFinite(floor)) {
      setError("floor", { type: "validate", message: "Floor must be a number" });
      return;
    }

    const result = await submit(
      {
        unitName: values.unitName.trim(),
        unitNumber: values.unitNumber.trim(),
        type: values.type,
        finishingStatus: values.finishingStatus,
        price: Number(values.price),
        area: Number(values.area),
        rooms: Number(values.rooms),
        bedrooms: Number(values.bedrooms),
        bathrooms: Number(values.bathrooms),
        ...(projectId ? { projectId } : {}),
        ...(description ? { description } : {}),
        ...(floor == null ? {} : { floor }),
      },
      images,
    );

    if (!result.ok) {
      if (result.field === "images") {
        setImagesError(result.message);
        return;
      }

      setError(result.field, { type: "server", message: result.message });
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push(`/apartments/${result.id}`), 2000);
  }

  return (
    <Box sx={{ pb: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">
        <Stack spacing={1.5} sx={{ mb: 4 }}>
          <Typography
            variant="overline"
            sx={{
              color: "accent.main",
              letterSpacing: "0.18em",
              fontWeight: 700,
            }}
          >
            Apartments
          </Typography>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.03em",
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Add apartment
          </Typography>
          <Typography color="text.secondary">
            Upload images first, then we create the unit with the returned paths.
          </Typography>
        </Stack>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack spacing={2.5}>
            {errors.root && (
              <Alert severity="error">{errors.root.message}</Alert>
            )}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField
                label="Unit name"
                required
                fullWidth
                autoComplete="off"
                error={!!errors.unitName}
                helperText={
                  errors.unitName?.message ?? `${UNIT_NAME_MAX} characters max`
                }
                slotProps={{ htmlInput: { maxLength: UNIT_NAME_MAX } }}
                {...register("unitName", {
                  required: "Unit name is required",
                  maxLength: {
                    value: UNIT_NAME_MAX,
                    message: `Unit name must be at most ${UNIT_NAME_MAX} characters`,
                  },
                  validate: (value) =>
                    value.trim().length > 0 || "Unit name cannot be empty",
                })}
              />

              <TextField
                label="Unit number"
                required
                fullWidth
                autoComplete="off"
                error={!!errors.unitNumber}
                helperText={
                  errors.unitNumber?.message ?? `${UNIT_NUMBER_MAX} characters max`
                }
                slotProps={{ htmlInput: { maxLength: UNIT_NUMBER_MAX } }}
                {...register("unitNumber", {
                  required: "Unit number is required",
                  maxLength: {
                    value: UNIT_NUMBER_MAX,
                    message: `Unit number must be at most ${UNIT_NUMBER_MAX} characters`,
                  },
                  validate: (value) =>
                    value.trim().length > 0 || "Unit number cannot be empty",
                })}
              />

              <TextField
                select
                label="Type"
                required
                fullWidth
                error={!!errors.type}
                helperText={errors.type?.message}
                {...register("type", { required: "Type is required" })}
              >
                {Object.values(ApartmentType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {APARTMENT_TYPE_LABELS[type]}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Finishing"
                required
                fullWidth
                error={!!errors.finishingStatus}
                helperText={errors.finishingStatus?.message}
                {...register("finishingStatus", {
                  required: "Finishing is required",
                })}
              >
                {Object.values(FinishingStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {FINISHING_STATUS_LABELS[status]}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Project"
                fullWidth
                error={!!errors.projectId}
                helperText={errors.projectId?.message ?? "Optional"}
                {...register("projectId")}
              >
                <MenuItem value="">No project</MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project.id} value={String(project.id)}>
                    {project.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Floor"
                type="number"
                fullWidth
                error={!!errors.floor}
                helperText={errors.floor?.message ?? "Optional"}
                {...register("floor", {
                  validate: (value) => {
                    if (!value.trim()) {
                      return true;
                    }

                    const parsed = Number(value);
                    if (!Number.isInteger(parsed)) {
                      return "Floor must be a whole number";
                    }

                    return true;
                  },
                })}
              />

              <TextField
                label="Price"
                type="number"
                required
                fullWidth
                error={!!errors.price}
                helperText={errors.price?.message}
                slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                {...register("price", requiredNumber("Price"))}
              />

              <TextField
                label="Area (m²)"
                type="number"
                required
                fullWidth
                error={!!errors.area}
                helperText={errors.area?.message}
                slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                {...register("area", requiredNumber("Area"))}
              />

              <TextField
                label="Rooms"
                type="number"
                required
                fullWidth
                error={!!errors.rooms}
                helperText={errors.rooms?.message}
                slotProps={{ htmlInput: { min: 0, step: 1 } }}
                {...register("rooms", requiredNumber("Rooms", true))}
              />

              <TextField
                label="Bedrooms"
                type="number"
                required
                fullWidth
                error={!!errors.bedrooms}
                helperText={errors.bedrooms?.message}
                slotProps={{ htmlInput: { min: 0, step: 1 } }}
                {...register("bedrooms", requiredNumber("Bedrooms", true))}
              />

              <TextField
                label="Bathrooms"
                type="number"
                required
                fullWidth
                error={!!errors.bathrooms}
                helperText={errors.bathrooms?.message}
                slotProps={{ htmlInput: { min: 0, step: 1 } }}
                {...register("bathrooms", requiredNumber("Bathrooms", true))}
              />
            </Box>

            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={4}
              error={!!errors.description}
              helperText={
                errors.description?.message ?? `${DESCRIPTION_MAX} characters max`
              }
              slotProps={{ htmlInput: { maxLength: DESCRIPTION_MAX } }}
              {...register("description", {
                maxLength: {
                  value: DESCRIPTION_MAX,
                  message: `Description must be at most ${DESCRIPTION_MAX} characters`,
                },
              })}
            />

            <ApartmentImagePicker
              images={images}
              onChange={setImages}
              disabled={isSubmitting || success}
              error={imagesError}
            />

            <Stack
              direction={{ xs: "column-reverse", sm: "row" }}
              spacing={1.5}
              sx={{ pt: 1, justifyContent: "flex-end" }}
            >
              <SecondaryButton
                href="/apartments"
                disabled={isSubmitting || success}
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={isSubmitting || success}>
                {isSubmitting ? "Creating..." : "Create apartment"}
              </PrimaryButton>
            </Stack>
          </Stack>
        </Box>
      </Container>

      <Snackbar
        open={success}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          Apartment created successfully.
        </Alert>
      </Snackbar>
    </Box>
  );
}
