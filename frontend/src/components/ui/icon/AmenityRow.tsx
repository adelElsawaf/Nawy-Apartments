import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AmenityIcons, type AmenityIconName } from "./amenityIcons";

export type AmenityItem = {
  icon: AmenityIconName;
  label: string;
};

type AmenityRowProps = {
  items: AmenityItem[];
};

export default function AmenityRow({ items }: AmenityRowProps) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ flexWrap: "wrap", color: "text.secondary", gap: 1.5 }}
    >
      {items.map((item) => {
        const Icon = AmenityIcons[item.icon];

        return (
          <Stack
            key={`${item.icon}-${item.label}`}
            direction="row"
            spacing={0.5}
            sx={{ alignItems: "center" }}
          >
            <Icon sx={{ fontSize: 18 }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {item.label}
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
}

type SpecWithIconProps = {
  icon: AmenityIconName;
  label: string;
  value: string;
};

export function SpecWithIcon({ icon, label, value }: SpecWithIconProps) {
  const Icon = AmenityIcons[icon];

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "background.default",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", mb: 0.5 }}>
        <Icon sx={{ fontSize: 18, color: "accent.main" }} />
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", fontWeight: 600 }}
        >
          {label}
        </Typography>
      </Stack>
      <Typography sx={{ fontWeight: 700 }}>{value}</Typography>
    </Box>
  );
}
