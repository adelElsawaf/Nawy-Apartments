"use client";

import Button, { type ButtonProps } from "@mui/material/Button";
import Link from "next/link";

type PrimaryButtonProps = Omit<ButtonProps, "variant"> & {
  href?: string;
};

export default function PrimaryButton({
  href,
  sx,
  ...props
}: PrimaryButtonProps) {
  return (
    <Button
      href={href}
      LinkComponent={href ? Link : undefined}
      variant="contained"
      sx={{
        borderRadius: "999px",
        textTransform: "none",
        fontWeight: 600,
        minHeight: 44,
        px: 2.5,
        ...sx,
      }}
      {...props}
    />
  );
}
