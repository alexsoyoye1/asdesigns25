"use client";

import {
  Box,
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import { portfolio } from "../data/brandContent";

const cardVariants = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-80px" },
};

export default function Portfolio() {
  return (
    <Box id="portfolio" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: 32, md: 44 },
            mb: 1,
            fontFamily: "var(--font-orbitron)",
          }}
        >
          Portfolio
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 5, maxWidth: 760 }}>
          A selection of recent web builds, brand visuals, and product UX.
        </Typography>

        <Grid container spacing={3}>
          {portfolio.map((p, i) => (
            <Grid key={p.title} item xs={12} sm={6} md={4}>
              <Card
                component={motion.div}
                variants={cardVariants}
                initial="initial"
                whileInView="whileInView"
                viewport={cardVariants.viewport}
                transition={{ duration: 0.45, delay: 0.05 * i }}
                sx={{ borderRadius: 3, overflow: "hidden", height: "100%" }}
              >
                <CardActionArea href={p.href} target="_blank" rel="noreferrer">
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16 / 10",
                    }}
                  >
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    {/* gradient overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,.55))",
                      }}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{
                        position: "absolute",
                        left: 12,
                        bottom: 10,
                        color: "#fff",
                        fontWeight: 700,
                        textShadow: "0 2px 8px rgba(0,0,0,.5)",
                      }}
                    >
                      {p.title}
                    </Typography>
                  </Box>
                  <CardContent sx={{ minHeight: 84 }}>
                    <Typography variant="body2" color="text.secondary">
                      {p.copy}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
