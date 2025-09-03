"use client";

import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import { services } from "../data/brandContent";

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

export default function Services() {
  return (
    <Box
      id="services"
      sx={{
        py: { xs: 8, md: 12 },
        background:
          "linear-gradient(180deg, rgba(227,6,19,0.04), rgba(227,6,19,0))",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: 32, md: 44 },
            mb: 1,
            fontFamily: "var(--font-orbitron)",
          }}
        >
          Services
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 5, maxWidth: 760 }}>
          Strategy, visuals, and code—built to move your brand forward.
        </Typography>

        <Grid container spacing={3}>
          {services.map((s, i) => (
            <Grid key={s.title} item xs={12} sm={6} md={4}>
              <Paper
                component={motion.article}
                {...fade}
                transition={{ duration: 0.4, delay: 0.05 * i }}
                elevation={3}
                sx={{ p: 3, borderRadius: 3, height: "100%" }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    mb: 2,
                    background: "linear-gradient(135deg, #E30613, #111111)",
                  }}
                />
                <Typography variant="h6" sx={{ mb: 1.5 }}>
                  {s.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {s.copy}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {s.tags.map((t) => (
                    <Chip key={t} label={t} size="small" variant="outlined" />
                  ))}
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
