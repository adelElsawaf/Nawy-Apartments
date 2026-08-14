import Box from "@mui/material/Box";
import Link from "next/link";

type TagProps = {
  label: string;
  href?: string;
};

export default function Tag({ label, href }: TagProps) {
  const sx = {
    display: "inline-flex",
    alignItems: "center",
    maxWidth: "100%",
    px: 1.25,
    py: 0.5,
    borderRadius: "999px",
    bgcolor: "rgba(197, 157, 95, 0.18)",
    color: "accent.main",
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    textDecoration: "none",
    lineHeight: 1.2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  };

  if (href) {
    return (
      <Box component={Link} href={href} sx={sx}>
        {label}
      </Box>
    );
  }

  return <Box sx={sx}>{label}</Box>;
}
