"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Container,
  useScrollTrigger,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import styles from "./Navbar.module.css";

const links = [
  { label: "Home", href: "#hero" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

function ElevationScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 8 });
  return React.cloneElement(children, {
    elevation: trigger ? 6 : 0,
    sx: {
      ...(children.props.sx || {}),
      backdropFilter: trigger ? "saturate(1.2) blur(8px)" : "none",
      background: trigger
        ? "rgba(255,255,255,0.85)"
        : "linear-gradient(90deg, rgba(255,255,255,0.96), rgba(255,255,255,0.96))",
      transition: "all .25s ease",
    },
  });
}

export default function Navbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <ElevationScroll>
      <AppBar color="transparent" position="sticky">
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2 }}>
            <Link href="#hero" aria-label="ASDesigns home">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Image
                  src="/as-logo.png"
                  alt="ASDesigns logo"
                  width={36}
                  height={36}
                  priority
                />
                <Box
                  sx={{
                    fontFamily: "var(--font-orbitron)",
                    fontWeight: 800,
                    letterSpacing: ".02em",
                    color: "text.primary",
                    textDecoration: "none",
                  }}
                >
                  ASDESIGNS
                </Box>
              </Box>
            </Link>

            {/* desktop nav */}
            <Box
              sx={{
                ml: "auto",
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
              }}
            >
              {links.map((l) => (
                <Button
                  key={l.href}
                  className={styles["nav-link"]}
                  component={Link}
                  href={l.href}
                  sx={{ color: "text.primary" }}
                >
                  {l.label}
                </Button>
              ))}

              {/* gradient CTA */}
              <Button
                component={Link}
                href="#contact"
                sx={{
                  ml: 1.5,
                  color: "#fff",
                  background:
                    "linear-gradient(90deg, #E30613 0%, #111111 100%)",
                  "&:hover": { filter: "brightness(1.05)" },
                }}
                variant="contained"
              >
                Start a Project
              </Button>
            </Box>

            {/* mobile menu */}
            <IconButton
              onClick={() => setOpen(true)}
              sx={{ ml: "auto", display: { xs: "inline-flex", md: "none" } }}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>

            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
              <Box role="presentation" sx={{ width: 280, p: 2 }}>
                <List>
                  {links.map((l) => (
                    <ListItemButton
                      key={l.href}
                      component={Link}
                      href={l.href}
                      onClick={() => setOpen(false)}
                    >
                      <ListItemText primary={l.label} />
                    </ListItemButton>
                  ))}
                  <ListItemButton
                    component={Link}
                    href="#contact"
                    onClick={() => setOpen(false)}
                    sx={{
                      mt: 1,
                      color: "#fff",
                      borderRadius: 2,
                      background:
                        "linear-gradient(90deg, #E30613 0%, #111111 100%)",
                      "&:hover": { filter: "brightness(1.05)" },
                    }}
                  >
                    <ListItemText primary="Start a Project" />
                  </ListItemButton>
                </List>
              </Box>
            </Drawer>
          </Toolbar>
        </Container>
      </AppBar>
    </ElevationScroll>
  );
}
