"use client";

import { useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SecondaryButton from "@/components/ui/button/SecondaryButton";
import Tag from "@/components/ui/tag/Tag";
import { SpecWithIcon } from "@/components/ui/icon/AmenityRow";
import { AmenityIcons } from "@/components/ui/icon/amenityIcons";
import { ApartmentImageType, type ApartmentImage } from "@/types/apartment";
import { useApartment } from "./hooks/useApartment";
import {
  APARTMENT_TYPE_LABELS,
  FINISHING_STATUS_LABELS,
  formatArea,
  formatPrice,
} from "./labels";

type ApartmentDetailsProps = {
  id: string;
};

function sortImages(images: ApartmentImage[]) {
  return [...images].sort((left, right) => {
    if (left.type === right.type) {
      return left.id - right.id;
    }

    return left.type === ApartmentImageType.Hero ? -1 : 1;
  });
}

export default function ApartmentDetails({ id }: ApartmentDetailsProps) {
  const { apartment, loading, error, notFound } = useApartment(id);
  const images = useMemo(
    () => sortImages(apartment?.images ?? []),
    [apartment],
  );
  const [activeImageId, setActiveImageId] = useState<number | null>(null);

  useEffect(() => {
    setActiveImageId(null);
  }, [apartment?.id]);

  const activeImage =
    images.find((image) => image.id === activeImageId) ?? images[0] ?? null;

  if (loading) {
    return (
      <Box sx={{ pb: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Skeleton width={120} height={28} sx={{ mb: 2 }} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
              gap: 3,
              mb: 3,
            }}
          >
            <Skeleton
              variant="rounded"
              height={360}
              sx={{ borderRadius: 3, gridRow: { md: "1 / 3" } }}
            />
            <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />
            <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3 }} />
          </Box>
          <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
        </Container>
      </Box>
    );
  }

  if (notFound) {
    return (
      <Box sx={{ pb: { xs: 8, md: 12 } }}>
        <Container maxWidth="sm">
          <Stack spacing={2} sx={{ textAlign: "center", py: { xs: 8, md: 10 } }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Apartment not found
            </Typography>
            <Typography color="text.secondary">
              This unit may have been removed, or the link is incorrect.
            </Typography>
            <Box>
              <SecondaryButton href="/apartments">
                Back to apartments
              </SecondaryButton>
            </Box>
          </Stack>
        </Container>
      </Box>
    );
  }

  if (error || !apartment) {
    return (
      <Box sx={{ pb: { xs: 8, md: 12 } }}>
        <Container maxWidth="sm">
          <Alert severity="error" sx={{ mb: 3 }}>
            {error ?? "Could not load apartment."}
          </Alert>
          <SecondaryButton href="/apartments">Back to apartments</SecondaryButton>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            mb: 3,
            alignItems: { xs: "stretch", sm: "flex-end" },
            justifyContent: "space-between",
          }}
        >
          <Stack spacing={1}>
            <Tag label={apartment.project?.name ?? "No project"} />
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.03em",
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              {apartment.unitName}
            </Typography>
            <Typography color="text.secondary">
              Unit {apartment.unitNumber} · {APARTMENT_TYPE_LABELS[apartment.type]} ·{" "}
              {FINISHING_STATUS_LABELS[apartment.finishingStatus]}
            </Typography>
          </Stack>

          <SecondaryButton href="/apartments">Back to listing</SecondaryButton>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
            gridTemplateRows: { md: "auto auto" },
            gap: 3,
            alignItems: "stretch",
            mb: 4,
          }}
        >
          <Stack
            spacing={1.5}
            sx={{
              gridColumn: { md: 1 },
              gridRow: { md: "1 / 3" },
              height: "100%",
            }}
          >
            <Box
              sx={{
                position: "relative",
                flex: 1,
                minHeight: { xs: 240, md: 0 },
                borderRadius: 3,
                overflow: "hidden",
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              {activeImage ? (
                <Box
                  component="img"
                  src={activeImage.url}
                  alt={apartment.unitName}
                  sx={{
                    position: { md: "absolute" },
                    inset: { md: 0 },
                    width: "100%",
                    height: { xs: 240, md: "100%" },
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <Typography
                  color="text.secondary"
                  sx={{
                    py: 8,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  No images yet
                </Typography>
              )}
            </Box>

            {images.length > 1 && (
              <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 0.5 }}>
                {images.map((image) => {
                  const selected =
                    (activeImage?.id ?? images[0]?.id) === image.id;

                  return (
                    <Box
                      key={image.id}
                      component="button"
                      type="button"
                      onClick={() => setActiveImageId(image.id)}
                      sx={{
                        p: 0,
                        border: "2px solid",
                        borderColor: selected ? "accent.main" : "divider",
                        borderRadius: 2,
                        overflow: "hidden",
                        cursor: "pointer",
                        bgcolor: "transparent",
                        flex: "0 0 auto",
                        width: 80,
                        height: 64,
                      }}
                    >
                      <Box
                        component="img"
                        src={image.url}
                        alt=""
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            )}
          </Stack>

          <Box
            sx={{
              gridColumn: { md: 2 },
              gridRow: { md: 1 },
              p: { xs: 2.5, md: 3 },
              borderRadius: 3,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.5 }}>
              <AmenityIcons.price sx={{ fontSize: 22, color: "accent.main" }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {formatPrice(apartment.price)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", mb: 2.5 }}>
              <AmenityIcons.area sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography color="text.secondary">
                {formatArea(apartment.area)}
              </Typography>
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.5,
              }}
            >
              <SpecWithIcon
                icon="bed"
                label="Bedrooms"
                value={String(apartment.bedrooms)}
              />
              <SpecWithIcon
                icon="bath"
                label="Bathrooms"
                value={String(apartment.bathrooms)}
              />
              <SpecWithIcon
                icon="room"
                label="Rooms"
                value={String(apartment.rooms)}
              />
              <SpecWithIcon
                icon="floor"
                label="Floor"
                value={apartment.floor == null ? "—" : String(apartment.floor)}
              />
            </Box>
          </Box>

          <Box
            sx={{
              gridColumn: { md: 2 },
              gridRow: { md: 2 },
              p: { xs: 2.5, md: 3 },
              borderRadius: 3,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderLeft: "4px solid",
              borderLeftColor: "accent.main",
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: "text.secondary",
                fontWeight: 700,
                letterSpacing: "0.14em",
              }}
            >
              Project
            </Typography>
            <Box sx={{ mt: 1.25, mb: 1.5 }}>
              <Tag label={apartment.project?.name ?? "No project"} />
            </Box>
            {apartment.project ? (
              <>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {apartment.project.name}
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {apartment.project.description || "No project description yet."}
                </Typography>
              </>
            ) : (
              <Typography color="text.secondary">
                This unit is not assigned to a project yet.
              </Typography>
            )}
          </Box>
        </Box>

        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
            About this unit
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 16, lineHeight: 1.8 }}>
            {apartment.description || "No description yet."}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
