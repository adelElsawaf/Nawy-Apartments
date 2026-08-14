"use client";

import { FormEvent, type ChangeEvent, type ReactNode, useId, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SecondaryButton from "@/components/ui/button/SecondaryButton";
import { ApartmentType, FinishingStatus } from "@/types/apartment";
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

function formatRange(min: string, max: string, suffix = "") {
  const hasMin = min.trim() !== "";
  const hasMax = max.trim() !== "";

  if (!hasMin && !hasMax) return null;
  if (hasMin && hasMax) return `${min} – ${max}${suffix}`;
  if (hasMin) return `From ${min}${suffix}`;
  return `Up to ${max}${suffix}`;
}

function formatRoomsSummary(values: ApartmentFilterForm) {
  const parts = [
    values.bedrooms.trim() && `${values.bedrooms} bed`,
    values.bathrooms.trim() && `${values.bathrooms} bath`,
    values.rooms.trim() && `${values.rooms} room`,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" · ") : null;
}

function FilterDropdown({
  label,
  summary,
  children,
}: {
  label: string;
  summary: string | null;
  children: ReactNode;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const id = useId();

  return (
    <>
      <Button
        type="button"
        variant="outlined"
        fullWidth
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-describedby={open ? id : undefined}
        sx={{
          justifyContent: "space-between",
          textAlign: "left",
          textTransform: "none",
          minHeight: 56,
          px: 2,
          color: "text.primary",
          borderColor: "divider",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography noWrap sx={{ fontWeight: summary ? 600 : 400 }}>
            {summary ?? "Any"}
          </Typography>
        </Box>
        <Typography component="span" color="text.secondary" aria-hidden>
          ▾
        </Typography>
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        slotProps={{
          paper: { sx: { mt: 1, p: 2, width: 280 } },
        }}
      >
        <Stack spacing={2}>{children}</Stack>
      </Popover>
    </>
  );
}

export default function ApartmentFilters({
  values,
  projects,
  onChange,
  onApply,
  onClear,
  canClear,
}: ApartmentFiltersProps) {
  const [showMore, setShowMore] = useState(false);

  function setField(field: keyof ApartmentFilterForm) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      onChange({ ...values, [field]: event.target.value });
    };
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    onApply();
  }

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mb: 3 }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          <TextField
            placeholder="Search by unit or project name"
            value={values.search}
            onChange={setField("search")}
            slotProps={{ htmlInput: { maxLength: 120 } }}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <SecondaryButton type="submit">Apply</SecondaryButton>
          {canClear && (
            <SecondaryButton type="button" onClick={onClear}>
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
              md: "repeat(5, 1fr)",
            },
            gap: 1.5,
          }}
        >
          <TextField
            select
            label="Project"
            value={values.projectId}
            onChange={setField("projectId")}
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
            onChange={setField("type")}
          >
            <MenuItem value="">Any</MenuItem>
            {Object.values(ApartmentType).map((type) => (
              <MenuItem key={type} value={type}>
                {APARTMENT_TYPE_LABELS[type]}
              </MenuItem>
            ))}
          </TextField>

          <FilterDropdown
            label="Price"
            summary={formatRange(values.minPrice, values.maxPrice)}
          >
            <TextField
              label="Min"
              type="number"
              value={values.minPrice}
              onChange={setField("minPrice")}
              slotProps={{ htmlInput: { min: 0 } }}
              fullWidth
            />
            <TextField
              label="Max"
              type="number"
              value={values.maxPrice}
              onChange={setField("maxPrice")}
              slotProps={{ htmlInput: { min: 0 } }}
              fullWidth
            />
          </FilterDropdown>

          <FilterDropdown
            label="Rooms & baths"
            summary={formatRoomsSummary(values)}
          >
            <TextField
              label="Bedrooms"
              type="number"
              value={values.bedrooms}
              onChange={setField("bedrooms")}
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
              fullWidth
            />
            <TextField
              label="Bathrooms"
              type="number"
              value={values.bathrooms}
              onChange={setField("bathrooms")}
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
              fullWidth
            />
            <TextField
              label="Rooms"
              type="number"
              value={values.rooms}
              onChange={setField("rooms")}
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
              fullWidth
            />
          </FilterDropdown>

          <FilterDropdown
            label="Area"
            summary={formatRange(values.minArea, values.maxArea, " m²")}
          >
            <TextField
              label="Min (m²)"
              type="number"
              value={values.minArea}
              onChange={setField("minArea")}
              slotProps={{ htmlInput: { min: 0 } }}
              fullWidth
            />
            <TextField
              label="Max (m²)"
              type="number"
              value={values.maxArea}
              onChange={setField("maxArea")}
              slotProps={{ htmlInput: { min: 0 } }}
              fullWidth
            />
          </FilterDropdown>
        </Box>

        <Collapse in={showMore} unmountOnExit>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              select
              label="Finishing"
              value={values.finishingStatus}
              onChange={setField("finishingStatus")}
              sx={{ flex: 1, maxWidth: { sm: 240 } }}
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
              onChange={setField("floor")}
              slotProps={{ htmlInput: { step: 1 } }}
              sx={{ flex: 1, maxWidth: { sm: 240 } }}
            />
          </Stack>
        </Collapse>

        <Button
          type="button"
          variant="text"
          onClick={() => setShowMore((open) => !open)}
          sx={{ alignSelf: "flex-start", textTransform: "none" }}
        >
          {showMore ? "Show less" : "Show more filters"}
        </Button>
      </Stack>
    </Box>
  );
}
