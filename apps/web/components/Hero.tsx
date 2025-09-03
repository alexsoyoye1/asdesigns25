"use client";

import { Container, Box, Stack, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={{
        pt: { xs: 10, md: 14 },
        pb: { xs: 10, md: 16 },
        background:
          "radial-gradient(1200px 600px at 20% -10%, rgba(227,6,19,0.10) 0%, rgba(227,6,19,0.00) 60%), radial-gradient(800px 400px at 100% 0%, rgba(17,17,17,0.08) 0%, rgba(17,17,17,0.00) 60%)",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={5}
          alignItems="center"
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}
          >
            <Typography
              variant="h1"
              sx={{ fontSize: { xs: 38, md: 64 }, lineHeight: 1.05 }}
            >
              Fusing Aesthetics and Functionality,
              <br /> <span style={{ color: "#E30613" }}>One</span> Pixel at a
              Time.
            </Typography>

            <Typography
              variant="body1"
              sx={{ mt: 2, maxWidth: 640, mx: { xs: "auto", md: 0 } }}
            >
              We blend clean engineering with striking visuals. Websites,
              portals, and interactive experiences that move your business
              forward.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 4, justifyContent: { xs: "center", md: "flex-start" } }}
            >
              <Button
                href="#contact"
                variant="contained"
                sx={{
                  color: "#fff",
                  background:
                    "linear-gradient(90deg, #E30613 0%, #111111 100%)",
                  "&:hover": { filter: "brightness(1.05)" },
                }}
              >
                Start a Project
              </Button>
              <Button href="#portfolio" variant="outlined" color="secondary">
                See our work
              </Button>
            </Stack>
          </Box>

          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            sx={{
              flex: 1,
              display: "grid",
              placeItems: "center",
              p: { xs: 2, md: 4 },
            }}
          >
            <Box
              component={motion.div}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                bgcolor: "background.paper",
                boxShadow: "0 18px 48px rgba(0,0,0,0.08)",
              }}
            >
              <Image
                src="/as-logo.png"
                alt="ASDesigns logo"
                width={220}
                height={220}
              />
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
