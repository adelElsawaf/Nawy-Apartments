"use client";

import { FormEvent } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PrimaryButton from "@/components/ui/button/PrimaryButton";
import SecondaryButton from "@/components/ui/button/SecondaryButton";
import Card from "@/components/ui/card/Card";
import { useProjects } from "./hooks/useProjects";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ProjectsList() {
  const {
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
  } = useProjects();

  function onSearch(event: FormEvent) {
    event.preventDefault();
    applySearch();
  }

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
              Projects
            </Typography>
            <Typography color="text.secondary">
              Browse compounds, then add apartments to them.
            </Typography>
          </Stack>

          <PrimaryButton href="/projects/new">Add project</PrimaryButton>
        </Stack>

        <Box
          component="form"
          onSubmit={onSearch}
          sx={{
            mb: 4,
            p: { xs: 2, md: 2.5 },
            borderRadius: 3,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              fullWidth
              placeholder="Search by project name"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              slotProps={{ htmlInput: { maxLength: 120 } }}
            />
            <SecondaryButton type="submit" sx={{ flexShrink: 0 }}>
              Search
            </SecondaryButton>
            {(search || searchInput) && (
              <SecondaryButton
                type="button"
                onClick={clearSearch}
                sx={{ flexShrink: 0 }}
              >
                Clear
              </SecondaryButton>
            )}
          </Stack>
        </Box>

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
                height={220}
                sx={{ borderRadius: 3 }}
              />
            ))}
          </Box>
        ) : projects.length === 0 ? (
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
              {search ? "No matching projects" : "No projects yet"}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {search
                ? "Try another name, or clear the search."
                : "Create your first compound to start listing apartments."}
            </Typography>
            {search ? (
              <SecondaryButton onClick={clearSearch}>Clear search</SecondaryButton>
            ) : (
              <PrimaryButton href="/projects/new">Add project</PrimaryButton>
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
              {projects.map((project) => (
                <Card
                  key={project.id}
                  title={project.name}
                  description={project.description}
                  caption={`Added ${formatDate(project.createdAt)}`}
                />
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
