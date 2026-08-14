"use client";

import { FormEvent } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import SecondaryButton from "@/components/ui/button/SecondaryButton";
import {
  ApartmentType,
  FinishingStatus,
} from "@/types/apartment";
import type { Project } from "@/types/project";
import type { ApartmentFilterForm } from "./hooks/useApartments";
import {
  APARTMENT_TYPE_LABELS,
  FINISHING_STATUS_LABELS,
} from "./labels";

type ApartmentFiltersProps = {
  values: ApartmentFilterForm;
  projects: Project[];
  onChange: (values: ApartmentFilterForm) => void;
  onApply: () => void;
  onClear: () => void;
  canClear: boolean;
};

function update(
  values: ApartmentFilterForm,
  field: keyof ApartmentFilterForm,
  value: string,
): ApartmentFilterForm {
  return { ...values, [field]: value };
}

export default function ApartmentFilters({
  values,
  projects,
  onChange,
  onApply,
  onClear,
  canClear,
}: ApartmentFiltersProps) {
  function onSubmit(event: FormEvent) {
    event.preventDefault();
    onApply();
  }

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        mb: 4,
        p: { xs: 2, md: 2.5 },
        borderRadius: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <TextField
            fullWidth
            placeholder="Search by unit or project name"
            value={values.search}
            onChange={(event) =>
              onChange(update(values, "search", event.target.value))
            }
            slotProps={{ htmlInput: { maxLength: 120 } }}
          />
          <SecondaryButton type="submit" sx={{ flexShrink: 0 }}>
            Apply
          </SecondaryButton>
          {canClear && (
            <SecondaryButton
              type="button"
              onClick={onClear}
              sx={{ flexShrink: 0 }}
            >
              Clear
            </SecondaryButton>
          )}
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(4, 1fr)",
            },
            gap: 1.5,
          }}
        >
          <TextField
            select
            label="Project"
            value={values.projectId}
            onChange={(event) =>
              onChange(update(values, "projectId", event.target.value))
            }
          >
            <MenuItem value="">Any</MenuItem>
            {projects.map((project) => (
              <MenuItem key={project.id} value={String(project.id)}>
                {project.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Type"
            value={values.type}
            onChange={(event) =>
              onChange(update(values, "type", event.target.value))
            }
          >
            <MenuItem value="">Any</MenuItem>
            {Object.values(ApartmentType).map((type) => (
              <MenuItem key={type} value={type}>
                {APARTMENT_TYPE_LABELS[type]}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Finishing"
            value={values.finishingStatus}
            onChange={(event) =>
              onChange(update(values, "finishingStatus", event.target.value))
            }
          >
            <MenuItem value="">Any</MenuItem>
            {Object.values(FinishingStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {FINISHING_STATUS_LABELS[status]}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Floor"
            type="number"
            value={values.floor}
            onChange={(event) =>
              onChange(update(values, "floor", event.target.value))
            }
            slotProps={{ htmlInput: { step: 1 } }}
          />

          <TextField
            label="Min price"
            type="number"
            value={values.minPrice}
            onChange={(event) =>
              onChange(update(values, "minPrice", event.target.value))
            }
            slotProps={{ htmlInput: { min: 0 } }}
          />

          <TextField
            label="Max price"
            type="number"
            value={values.maxPrice}
            onChange={(event) =>
              onChange(update(values, "maxPrice", event.target.value))
            }
            slotProps={{ htmlInput: { min: 0 } }}
          />

          <TextField
            label="Min area (m²)"
            type="number"
            value={values.minArea}
            onChange={(event) =>
              onChange(update(values, "minArea", event.target.value))
            }
            slotProps={{ htmlInput: { min: 0 } }}
          />

          <TextField
            label="Max area (m²)"
            type="number"
            value={values.maxArea}
            onChange={(event) =>
              onChange(update(values, "maxArea", event.target.value))
            }
            slotProps={{ htmlInput: { min: 0 } }}
          />

          <TextField
            label="Rooms"
            type="number"
            value={values.rooms}
            onChange={(event) =>
              onChange(update(values, "rooms", event.target.value))
            }
            slotProps={{ htmlInput: { min: 0, step: 1 } }}
          />

          <TextField
            label="Bedrooms"
            type="number"
            value={values.bedrooms}
            onChange={(event) =>
              onChange(update(values, "bedrooms", event.target.value))
            }
            slotProps={{ htmlInput: { min: 0, step: 1 } }}
          />

          <TextField
            label="Bathrooms"
            type="number"
            value={values.bathrooms}
            onChange={(event) =>
              onChange(update(values, "bathrooms", event.target.value))
            }
            slotProps={{ htmlInput: { min: 0, step: 1 } }}
          />
        </Box>
      </Stack>
    </Box>
  );
}
