"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { API_URL } from "../../../lib/config";

type Currency = "NGN" | "USD" | "GBP";

type Item = {
  _id: string;
  name: string;
  email: string;
  message: string;
  phone?: string;
  website?: string;
  budgetAmount?: number;
  currency?: Currency;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const router = useRouter();

  // ---- UI state
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  // ---- derived helpers
  const localeFor = useMemo(
    () =>
      ({
        NGN: "en-NG",
        USD: "en-US",
        GBP: "en-GB",
      } as const),
    []
  );

  // ---- guard + initial load
  useEffect(() => {
    let cancelled = false;

    async function load(q: string) {
      setLoading(true);
      try {
        // Call API directly with credentials; API must allow CORS with credentials
        const res = await fetch(
          `${API_URL}/admin/contacts?q=${encodeURIComponent(q)}`,
          {
            cache: "no-store",
            credentials: "include",
          }
        );

        if (res.status === 401) {
          if (!cancelled) {
            setAuthed(false);
            router.replace("/admin/login");
          }
          return;
        }

        const json = await res.json();
        if (cancelled) return;

        setAuthed(true);
        setItems(Array.isArray(json.items) ? json.items : []);
      } catch {
        // On network/API error, treat as unauth for now
        if (!cancelled) {
          setAuthed(false);
          router.replace("/admin/login");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load(""); // initial load with empty search
    return () => {
      cancelled = true;
    };
  }, [router]);

  // ---- debounced search
  useEffect(() => {
    if (authed !== true) return;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/admin/contacts?q=${encodeURIComponent(query)}`,
          { cache: "no-store", credentials: "include" }
        );
        if (res.status === 401) {
          setAuthed(false);
          router.replace("/admin/login");
          return;
        }
        const json = await res.json();
        setItems(Array.isArray(json.items) ? json.items : []);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce 300ms
    return () => clearTimeout(t);
  }, [query, authed, router]);

  if (authed === null) return null; // simple SSR-safe placeholder while we check session

  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{ mb: 2, fontFamily: "var(--font-orbitron)" }}
        >
          Contact Messages
        </Typography>

        <TextField
          placeholder="Search by name, email, or text…"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Paper sx={{ overflow: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width={200}>When</TableCell>
                <TableCell width={260}>From</TableCell>
                <TableCell width={220}>Email</TableCell>
                <TableCell width={180}>Budget</TableCell>
                <TableCell>Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading…
                  </TableCell>
                </TableRow>
              )}

              {!loading && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No messages found
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                items.map((it) => {
                  const budget =
                    it.budgetAmount && it.currency
                      ? `${it.currency} ${new Intl.NumberFormat(
                          localeFor[it.currency],
                          { maximumFractionDigits: 2 }
                        ).format(it.budgetAmount)}`
                      : "—";

                  return (
                    <TableRow
                      key={it._id}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() =>
                        router.push(
                          `/admin/messages/${encodeURIComponent(it._id)}`
                        )
                      }
                    >
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {new Date(it.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {it.name}
                        {it.phone && (
                          <Chip
                            label={it.phone}
                            size="small"
                            sx={{ ml: 1, maxWidth: 160 }}
                          />
                        )}
                        {it.website && (
                          <Chip
                            label={it.website}
                            size="small"
                            sx={{ ml: 1, maxWidth: 200 }}
                          />
                        )}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {it.email}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {budget}
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: 520,
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                        title={it.message}
                      >
                        {it.message}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </Box>
  );
}
