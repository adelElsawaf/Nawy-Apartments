import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function AboutContent() {
  return (
    <Box sx={{ pb: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">
        <Stack spacing={3} sx={{ mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="overline"
            sx={{
              color: "accent.main",
              letterSpacing: "0.18em",
              fontWeight: 700,
            }}
          >
            Get To Know
          </Typography>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.03em",
              fontSize: { xs: "2rem", md: "2.75rem" },
              lineHeight: 1.2,
            }}
          >
            Africa&apos;s Largest Prop-tech Company
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: { xs: 16, md: 18 } }}>
            Nawy is a fully integrated platform delivering a seamless real
            estate experience for buyers, sellers, and investors.
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: { xs: 16, md: 18 } }}>
            Since 2016, we have helped over 100,000 families easily find the
            most suitable property to turn into a loving home. Nawy understands
            the challenges of finding the right property, which is why our
            platform serves as a hub for transparent, efficient, and
            data-driven real estate services.
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: { xs: 16, md: 18 } }}>
            Staying true to our mission to revolutionize the real estate
            industry, we promise to help each and every one of our customers
            make a well-informed decision and get their dream house in no time.
          </Typography>
        </Stack>

        <Box
          sx={{
            p: { xs: 3, md: 4.5 },
            borderRadius: 3,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 4,
              borderRadius: 999,
              bgcolor: "accent.main",
              mb: 2.5,
            }}
          />
          <Typography
            variant="overline"
            sx={{ color: "secondary.main", fontWeight: 700, letterSpacing: "0.14em" }}
          >
            Vision
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, mt: 0.5 }}>
            Our Vision
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: { xs: 16, md: 18 } }}>
            Become the region&apos;s leading prop-tech company and disrupt the
            real estate ecosystem by offering a fully immersive digitized
            experience for home buyers, sellers & investors.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
