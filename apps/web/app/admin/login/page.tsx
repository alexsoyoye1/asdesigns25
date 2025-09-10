"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { API_URL } from "../../../lib/config";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important for httpOnly cookies
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      router.replace("/admin/messages");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            sx={{ mb: 2, fontFamily: "var(--font-orbitron)" }}
          >
            Admin Login
          </Typography>
          <form onSubmit={onSubmit}>
            <Stack spacing={2}>
              <TextField name="email" label="Email" type="email" required />
              <TextField
                name="password"
                label="Password"
                type="password"
                required
              />
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </Button>
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
