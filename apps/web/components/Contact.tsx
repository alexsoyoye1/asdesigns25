"use client";
import { z } from "zod";
import { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_URL } from "../lib/config";
import { ContactMessageSchema } from "@asdesigns/shared";

type FormValues = z.input<typeof ContactMessageSchema>;

const currencyToLocale: Record<NonNullable<FormValues["currency"]>, string> = {
  NGN: "en-NG",
  USD: "en-US",
  GBP: "en-GB",
};

function formatAmountForDisplay(
  v: string | number | undefined,
  currency: "NGN" | "USD" | "GBP"
) {
  if (v === undefined || v === null || v === "") return "";
  // strip commas in case a string like "12,345.67" was passed
  const num =
    typeof v === "number" ? v : Number(String(v).replace(/[,\s]/g, ""));
  if (!Number.isFinite(num)) return "";
  // show number with grouping, but WITHOUT currency symbol (we already show ₦/$/£ in InputAdornment)
  return new Intl.NumberFormat(currencyToLocale[currency], {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

function stripFormatting(v: string) {
  return v.replace(/[,\s]/g, ""); // keep only digits & dot
}

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(ContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      phone: "",
      website: "",
      budgetAmount: undefined,
      currency: "NGN", // default to Naira
      company: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setStatus("idle");
    try {
      const payload = ContactMessageSchema.parse(values); // runs all transforms/refines
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("ok");
      reset({
        name: "",
        email: "",
        message: "",
        phone: "",
        website: "",
        budgetAmount: undefined,
        currency: "NGN",
        company: "",
      });
    } catch {
      setStatus("error");
    }
  };

  // helper for narrow typing on helperText
  const h = (e: unknown) =>
    typeof (e as { message?: unknown })?.message === "string"
      ? (e as { message: string }).message
      : undefined;

  const currency = watch("currency") ?? "NGN";
  const amt = watch("budgetAmount") as unknown as string | number | undefined;

  // get register props for the field
  const budgetReg = register("budgetAmount");

  return (
    <Box
      id="contact"
      sx={{
        py: { xs: 8, md: 12 },
        background:
          "linear-gradient(180deg, rgba(17,17,17,0.03), rgba(17,17,17,0))",
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
          Contact
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 760 }}>
          Tell us about your project. We’ll get back within 24–48h.
        </Typography>

        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Your name"
                  fullWidth
                  {...register("name")}
                  error={!!errors.name}
                  helperText={h(errors.name)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  {...register("email")}
                  error={!!errors.email}
                  helperText={h(errors.email)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Phone (optional)"
                  fullWidth
                  {...register("phone")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Website (optional)"
                  fullWidth
                  {...register("website")}
                  error={!!errors.website}
                  helperText={h(errors.website)}
                />
              </Grid>

              {/* NEW: Budget amount + currency */}

              <Grid item xs={12} md={6}>
                <TextField
                  label="Estimated budget (optional)"
                  type="text"
                  fullWidth
                  name={budgetReg.name}
                  inputRef={budgetReg.ref}
                  // controlled value so we can pretty-print
                  value={
                    typeof amt === "number"
                      ? formatAmountForDisplay(amt, currency)
                      : amt ?? ""
                  }
                  onChange={(e) => {
                    // let RHF know about the change if you want (optional since we use setValue)
                    // budgetReg.onChange(e);
                    // keep user input raw while typing
                    setValue("budgetAmount", e.target.value as any, {
                      shouldDirty: true,
                      shouldValidate: false,
                    });
                  }}
                  onFocus={(e) => {
                    // strip commas for easy editing
                    const raw = stripFormatting(e.currentTarget.value);
                    setValue("budgetAmount", raw as any, {
                      shouldDirty: true,
                      shouldValidate: false,
                    });
                  }}
                  onBlur={(e) => {
                    // pretty-print with locale grouping
                    const pretty = formatAmountForDisplay(
                      e.currentTarget.value,
                      currency
                    );
                    setValue("budgetAmount", pretty as any, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                    // call RHF's built-in onBlur to keep touched state accurate
                    budgetReg.onBlur(e);
                  }}
                  error={!!errors.budgetAmount}
                  helperText={h(errors.budgetAmount)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {currency === "NGN"
                          ? "₦"
                          : currency === "USD"
                          ? "$"
                          : "£"}
                      </InputAdornment>
                    ),
                    inputMode: "decimal",
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.currency}>
                  <InputLabel id="currency-label">Currency</InputLabel>
                  <Select
                    labelId="currency-label"
                    label="Currency"
                    value={currency}
                    onChange={(e) => {
                      setValue(
                        "currency",
                        e.target.value as FormValues["currency"],
                        { shouldDirty: true, shouldValidate: true }
                      );
                      // reformat amount immediately in the new locale for a nice feel
                      const current = String(watch("budgetAmount") ?? "");
                      const pretty = formatAmountForDisplay(
                        current,
                        e.target.value as FormValues["currency"]
                      );
                      setValue(
                        "budgetAmount",
                        pretty as unknown as FormValues["budgetAmount"],
                        { shouldDirty: true, shouldValidate: false }
                      );
                    }}
                  >
                    <MenuItem value="NGN">Naira (₦)</MenuItem>
                    <MenuItem value="USD">US Dollar ($)</MenuItem>
                    <MenuItem value="GBP">British Pound (£)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Honeypot (hidden) */}
              <Grid item xs={12} sx={{ display: "none" }}>
                <TextField label="Company" fullWidth {...register("company")} />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Project details"
                  fullWidth
                  multiline
                  minRows={5}
                  {...register("message")}
                  error={!!errors.message}
                  helperText={
                    h(errors.message) ??
                    "What are you trying to build? Timelines? Must-haves?"
                  }
                />
              </Grid>
            </Grid>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 3 }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  color: "#fff",
                  background:
                    "linear-gradient(90deg, #E30613 0%, #111111 100%)",
                  "&:hover": { filter: "brightness(1.05)" },
                }}
              >
                {isSubmitting ? "Sending..." : "Send message"}
              </Button>
              {status === "ok" && (
                <Alert severity="success">Thanks! We’ll be in touch.</Alert>
              )}
              {status === "error" && (
                <Alert severity="error">Something went wrong. Try again.</Alert>
              )}
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
