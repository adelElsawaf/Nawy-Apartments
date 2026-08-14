"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import PrimaryButton from "@/components/ui/button/PrimaryButton";
import SecondaryButton from "@/components/ui/button/SecondaryButton";
import Card from "@/components/ui/card/Card";
import ApartmentFilters from "./ApartmentFilters";
import { useApartments } from "./hooks/useApartments";
import {
  APARTMENT_TYPE_LABELS,
  formatArea,
  formatPrice,
} from "./labels";

export default function ApartmentsList() {
  const {
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
    hasFilters,
  } = useApartments();

  const hasAppliedFilters = Object.values(applied).some(
    (value) => value.trim() !== "",
  );

  return (
    <Box sx={{ pb: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            mb: 4,
            alignItems: { xs: "stretch", sm: "flex-end" },
            justifyContent: "space-between",
          }}
        >
          <Stack spacing={1}>
            <Typography
              variant="overline"
              sx={{
                color: "accent.main",
                letterSpacing: "0.18em",
                fontWeight: 700,
              }}
            >
              Discover
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
              Apartments
            </Typography>
            <Typography color="text.secondary">
              Search units by name or project, then narrow with filters.
            </Typography>
          </Stack>

          <PrimaryButton href="/apartments/new">Add apartment</PrimaryButton>
        </Stack>

        <ApartmentFilters
          values={draft}
          projects={projects}
          onChange={setDraft}
          onApply={applyFilters}
          onClear={clearFilters}
          canClear={hasFilters}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                height={320}
                sx={{ borderRadius: 3 }}
              />
            ))}
          </Box>
        ) : apartments.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: { xs: 8, md: 10 },
              px: 3,
              borderRadius: 3,
              bgcolor: "background.paper",
              border: "1px dashed",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              {hasAppliedFilters ? "No matching apartments" : "No apartments yet"}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {hasAppliedFilters
                ? "Try different filters, or clear them to see all units."
                : "Create your first apartment to start the listing."}
            </Typography>
            {hasAppliedFilters ? (
              <SecondaryButton onClick={clearFilters}>
                Clear filters
              </SecondaryButton>
            ) : (
              <PrimaryButton href="/apartments/new">Add apartment</PrimaryButton>
            )}
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "repeat(3, 1fr)",
                },
                gap: 3,
              }}
            >
              {apartments.map((apartment) => (
                <Box
                  key={apartment.id}
                  component={Link}
                  href={`/apartments/${apartment.id}`}
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                    height: "100%",
                  }}
                >
                  <Card
                    title={apartment.unitName}
                    image={apartment.imageUrl ?? undefined}
                    tag={apartment.project?.name ?? "No project"}
                    description={`Unit ${apartment.unitNumber}`}
                    caption={`${APARTMENT_TYPE_LABELS[apartment.type]} · ${formatPrice(apartment.price)} · ${formatArea(apartment.area)} · ${apartment.bedrooms} bed`}
                  />
                </Box>
              ))}
            </Box>

            {hasNextPage && (
              <Stack sx={{ mt: 5, alignItems: "center" }}>
                <SecondaryButton onClick={loadMore} disabled={loadingMore}>
                  {loadingMore ? "Loading..." : "Load more"}
                </SecondaryButton>
              </Stack>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
