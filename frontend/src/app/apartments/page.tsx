import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function ApartmentsPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Apartments
        </Typography>
        <Typography color="text.secondary">
          Apartment listing will go here.
        </Typography>
      </Box>
    </Container>
  );
}
