import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function CreateApartmentPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add apartment
        </Typography>
        <Typography color="text.secondary">
          Create apartment form will go here.
        </Typography>
      </Box>
    </Container>
  );
}
