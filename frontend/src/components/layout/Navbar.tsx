"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PrimaryButton from "@/components/ui/button/PrimaryButton";
import SecondaryButton from "@/components/ui/button/SecondaryButton";

const links = [
  { href: "/about", label: "About us" },
  { href: "/apartments", label: "Apartments" },
  { href: "/projects", label: "Projects" },
];

const createLinks = [
  { href: "/apartments/new", label: "Add apartment" },
  { href: "/projects/new", label: "Add project" },
];

function LogoMark() {
  return (
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: "10px",
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <Image
        src="/nawyestate_logo.jpeg"
        alt="NawyTask logo"
        fill
        sizes="36px"
        style={{ objectFit: "cover" }}
      />
    </Box>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        component="header"
        sx={{
          position: "fixed",
          top: { xs: 12, md: 20 },
          left: "50%",
          transform: "translateX(-50%)",
          width: {
            xs: "calc(100% - 24px)",
            md: "min(1180px, calc(100% - 48px))",
          },
          px: { xs: 1.5, md: 2.5 },
          py: 1.25,
          borderRadius: "999px",
          bgcolor: "rgba(255, 255, 255, 0.78)",
          backdropFilter: "blur(18px)",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 10px 40px rgba(24, 58, 55, 0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            minHeight: 64,
            position: "relative",
          }}
        >
          <Box
            component={Link}
            href="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              textDecoration: "none",
              color: "text.primary",
              zIndex: 1,
            }}
          >
            <LogoMark />
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.03em" }}>
              NawyTask
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              display: { xs: "none", md: "flex" },
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {links.map((link) => {
              const active = pathname === link.href;

              return (
                <Box
                  key={link.href}
                  component={Link}
                  href={link.href}
                  sx={{
                    px: 2.25,
                    py: 1.25,
                    borderRadius: "999px",
                    textDecoration: "none",
                    color: active ? "primary.main" : "text.secondary",
                    fontWeight: active ? 700 : 500,
                    fontSize: 15,
                    bgcolor: active ? "rgba(24, 58, 55, 0.08)" : "transparent",
                    "&:hover": {
                      color: "primary.main",
                      bgcolor: "rgba(24, 58, 55, 0.06)",
                    },
                  }}
                >
                  {link.label}
                </Box>
              );
            })}
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              ml: "auto",
              display: { xs: "none", md: "flex" },
              zIndex: 1,
            }}
          >
            {createLinks.map((link) =>
              link.href.includes("apartment") ? (
                <PrimaryButton key={link.href} href={link.href}>
                  {link.label}
                </PrimaryButton>
              ) : (
                <SecondaryButton key={link.href} href={link.href}>
                  {link.label}
                </SecondaryButton>
              ),
            )}
          </Stack>

          <IconButton
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            sx={{
              ml: "auto",
              display: { md: "none" },
              color: "text.primary",
            }}
          >
            <Box
              sx={{
                width: 18,
                height: 2,
                bgcolor: "currentColor",
                boxShadow: "0 6px 0 currentColor, 0 -6px 0 currentColor",
              }}
            />
          </IconButton>
        </Box>
      </Box>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              bgcolor: "background.default",
              px: 2,
              py: 4,
            },
          },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, px: 1 }}>
          NawyTask
        </Typography>
        <Stack spacing={0.5}>
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Box
                key={link.href}
                component={Link}
                href={link.href}
                onClick={() => setOpen(false)}
                sx={{
                  px: 1.5,
                  py: 1.25,
                  borderRadius: 2,
                  textDecoration: "none",
                  color: active ? "primary.main" : "text.primary",
                  fontWeight: active ? 700 : 500,
                  bgcolor: active ? "rgba(24, 58, 55, 0.08)" : "transparent",
                }}
              >
                {link.label}
              </Box>
            );
          })}
        </Stack>
        <Typography
          variant="overline"
          sx={{ display: "block", mt: 3, mb: 1, px: 1, color: "text.secondary" }}
        >
          Create
        </Typography>
        <Stack spacing={1.5} sx={{ px: 1 }}>
          {createLinks.map((link) =>
            link.href.includes("apartment") ? (
              <PrimaryButton
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                sx={{ width: "100%" }}
              >
                {link.label}
              </PrimaryButton>
            ) : (
              <SecondaryButton
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                sx={{ width: "100%" }}
              >
                {link.label}
              </SecondaryButton>
            ),
          )}
        </Stack>
      </Drawer>
    </>
  );
}
