"use client";

import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import PrimaryButton from "@/components/ui/button/PrimaryButton";
import SecondaryButton from "@/components/ui/button/SecondaryButton";
import { useCreateProject } from "./hooks/useCreateProject";

type FormValues = {
  name: string;
  description: string;
};

const NAME_MAX = 120;
const DESCRIPTION_MAX = 2000;

export default function CreateProjectForm() {
  const router = useRouter();
  const { submit } = useCreateProject();
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: FormValues) {
    const description = values.description.trim();
    const result = await submit({
      name: values.name.trim(),
      ...(description ? { description } : {}),
    });

    if (!result.ok) {
      setError(result.field, { type: "server", message: result.message });
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/projects"), 2000);
  }

  return (
    <Box sx={{ pb: { xs: 8, md: 12 } }}>
      <Container maxWidth="sm">
        <Stack spacing={1.5} sx={{ mb: 4 }}>
          <Typography
            variant="overline"
            sx={{
              color: "accent.main",
              letterSpacing: "0.18em",
              fontWeight: 700,
            }}
          >
            Projects
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
            Add project
          </Typography>
          <Typography color="text.secondary">
            Create a compound to group apartments later.
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

            <TextField
              label="Name"
              required
              fullWidth
              autoComplete="off"
              error={!!errors.name}
              helperText={errors.name?.message ?? `${NAME_MAX} characters max`}
              slotProps={{ htmlInput: { maxLength: NAME_MAX } }}
              {...register("name", {
                required: "Name is required",
                maxLength: {
                  value: NAME_MAX,
                  message: `Name must be at most ${NAME_MAX} characters`,
                },
                validate: (value) =>
                  value.trim().length > 0 || "Name cannot be empty",
              })}
            />

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

            <Stack
              direction={{ xs: "column-reverse", sm: "row" }}
              spacing={1.5}
              sx={{ pt: 1, justifyContent: "flex-end" }}
            >
              <SecondaryButton href="/projects" disabled={isSubmitting || success}>
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={isSubmitting || success}>
                {isSubmitting ? "Creating..." : "Create project"}
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
          Project created successfully.
        </Alert>
      </Snackbar>
    </Box>
  );
}
