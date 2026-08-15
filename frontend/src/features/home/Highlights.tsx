"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AmenityIcons, type AmenityIconName } from "@/components/ui/icon/amenityIcons";

const items: {
  title: string;
  description: string;
  icon: AmenityIconName;
}[] = [
  {
    title: "Browse units",
    description:
      "Search apartments by unit name, number, or project and open full details in one click.",
    icon: "search",
  },
  {
    title: "Explore compounds",
    description:
      "See every project in one list, then filter the homes that belong to it.",
    icon: "project",
  },
  {
    title: "List with ease",
    description:
      "Add a project or apartment from the navbar whenever you have a new listing.",
    icon: "add",
  },
];

export default function Highlights() {
  return (
    <Box sx={{ pt: { xs: 1, md: 2 }, pb: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 700,
            textAlign: "center",
            mb: { xs: 4, md: 6 },
            letterSpacing: "-0.03em",
          }}
        >
          Everything you need to choose a home
        </Typography>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          sx={{ alignItems: "stretch" }}
        >
          {items.map((item) => {
            const Icon = AmenityIcons[item.icon];

            return (
              <Box
                key={item.title}
                sx={{
                  flex: 1,
                  p: 3.5,
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(197, 157, 95, 0.12)",
                    color: "accent.main",
                    mb: 2,
                  }}
                >
                  <Icon sx={{ fontSize: 24 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography color="text.secondary">{item.description}</Typography>
              </Box>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
}
