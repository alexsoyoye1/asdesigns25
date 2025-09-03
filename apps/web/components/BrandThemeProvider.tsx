"use client";

import { PropsWithChildren, useMemo } from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

export default function BrandThemeProvider({ children }: PropsWithChildren) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
          primary: { main: "#E30613" },   // AS red
          secondary: { main: "#111111" }, // logo black
          background: { default: "#F5F5F5", paper: "#FFFFFF" },
          text: { primary: "#111111", secondary: "#444444" }
        },
        typography: {
          // these resolve to the next/font CSS variables set in layout.tsx
          fontFamily: 'var(--font-inter), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
          h1: { fontFamily: 'var(--font-orbitron), var(--font-inter), sans-serif', fontWeight: 800, letterSpacing: "-0.02em" },
          h2: { fontFamily: 'var(--font-orbitron), var(--font-inter), sans-serif', fontWeight: 700, letterSpacing: "-0.02em" },
          button: { textTransform: "none", fontWeight: 700 }
        },
        shape: { borderRadius: 12 },
        components: {
          MuiButton: {
            styleOverrides: {
              root: { borderRadius: 12, paddingInline: 20 }
            }
          },
        }
      }),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
