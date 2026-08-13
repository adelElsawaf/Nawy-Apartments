"use client";

import Button, { type ButtonProps } from "@mui/material/Button";
import Link from "next/link";

type SecondaryButtonProps = Omit<ButtonProps, "variant"> & {
  href?: string;
};

export default function SecondaryButton({
  href,
  sx,
  ...props
}: SecondaryButtonProps) {
  return (
    <Button
      href={href}
      LinkComponent={href ? Link : undefined}
      variant="outlined"
      sx={{
        borderRadius: "999px",
        textTransform: "none",
        fontWeight: 600,
        minHeight: 44,
        px: 2.5,
        borderColor: "primary.main",
        color: "primary.main",
        ...sx,
      }}
      {...props}
    />
  );
}
