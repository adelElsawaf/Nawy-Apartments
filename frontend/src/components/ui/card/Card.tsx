import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tag from "@/components/ui/tag/Tag";
import AmenityRow, { type AmenityItem } from "@/components/ui/icon/AmenityRow";

type CardProps = {
  title: string;
  description?: string | null;
  caption?: string;
  amenities?: AmenityItem[];
  image?: string;
  tag?: string | null;
};

export default function Card({
  title,
  description,
  caption,
  amenities,
  image,
  tag,
}: CardProps) {
  return (
    <Box
      sx={{
        height: "100%",
        borderRadius: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition:
          "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        ...(!image && {
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #C59D5F 0%, #183A37 100%)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(197, 157, 95, 0.1) 0%, transparent 45%)",
            pointerEvents: "none",
          },
        }),
        "&:hover": {
          transform: "translateY(-6px)",
          borderColor: "accent.main",
          boxShadow: "0 20px 44px rgba(24, 58, 55, 0.14)",
        },
      }}
    >
      {image && (
        <Box sx={{ position: "relative" }}>
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{
              width: "100%",
              height: 180,
              objectFit: "cover",
              display: "block",
            }}
          />
          {tag && (
            <Box sx={{ position: "absolute", top: 12, left: 12, right: 12 }}>
              <Tag label={tag} />
            </Box>
          )}
        </Box>
      )}

      <Stack spacing={2} sx={{ position: "relative", zIndex: 1, flex: 1, p: 3 }}>
        {!image && (
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "-0.04em",
              boxShadow: "0 10px 22px rgba(24, 58, 55, 0.28)",
            }}
          >
            {title.slice(0, 1).toUpperCase()}
          </Box>
        )}

        <Box sx={{ flex: 1 }}>
          {!image && tag && (
            <Box sx={{ mb: 1.5 }}>
              <Tag label={tag} />
            </Box>
          )}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            {title}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: image ? undefined : 72,
            }}
          >
            {description || "No description yet."}
          </Typography>
        </Box>

        {amenities && amenities.length > 0 ? (
          <AmenityRow items={amenities} />
        ) : caption ? (
          <Typography variant="caption" color="text.secondary">
            {caption}
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
}
