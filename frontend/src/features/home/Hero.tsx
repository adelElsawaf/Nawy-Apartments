"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PrimaryButton from "@/components/ui/button/PrimaryButton";
import SecondaryButton from "@/components/ui/button/SecondaryButton";

export default function Hero() {
  return (
    <Box
      sx={{
        minHeight: { xs: "56vh", md: "calc(100dvh - 340px)" },
        display: "flex",
        alignItems: "center",
        pb: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={3} sx={{ textAlign: "center", alignItems: "center" }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.04em",
              fontSize: { xs: "2.25rem", md: "3.5rem" },
              lineHeight: 1.15,
            }}
          >
            Find your next home in Egypt&apos;s finest projects
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ maxWidth: 560, fontSize: { xs: 16, md: 18 } }}
          >
            Browse apartments and compounds in one place. Compare units, explore
            projects, and move forward with confidence.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ pt: 1, width: { xs: "100%", sm: "auto" } }}
          >
            <PrimaryButton href="/apartments" size="large" sx={{ px: 3.5 }}>
              Explore apartments
            </PrimaryButton>
            <SecondaryButton href="/projects" size="large" sx={{ px: 3.5 }}>
              Discover projects
            </SecondaryButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
