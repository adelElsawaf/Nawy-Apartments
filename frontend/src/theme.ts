"use client";

import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    accent: Palette["primary"];
  }

  interface PaletteOptions {
    accent?: PaletteOptions["primary"];
  }
}

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#183A37",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#5F7D73",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#C94C4C",
    },
    accent: {
      main: "#C59D5F",
      contrastText: "#1C2523",
    },
    background: {
      default: "#F7F5F0",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1C2523",
      secondary: "#6B7471",
    },
    divider: "#E2E0D9",
  },
  typography: {
    fontFamily: "var(--font-geist-sans), Arial, sans-serif",
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "#E2E0D9",
        },
      },
    },
  },
});

export default theme;
