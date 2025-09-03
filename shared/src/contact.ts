import { z } from "zod";

const cleanNumberString = (v: string) => v.replace(/[,\s]/g, ""); // remove commas & spaces; currency symbol isn't expected, but strip if you add it later

export const ContactMessageSchema = z
  .object({
    name: z.string().min(2, "Please enter your name"),
    email: z.string().email("Enter a valid email"),
    message: z.string().min(10, "Tell us a bit more (min 10 chars)"),
    phone: z.string().optional(),
    website: z
      .string()
      .url("Enter a valid URL")
      .optional()
      .or(z.literal("").transform(() => undefined)),

    // Budget as free amount (+ commas allowed) and currency
    budgetAmount: z
      .union([z.number(), z.string()])
      .transform((v) => {
        if (typeof v === "number") return v;
        const n = Number(cleanNumberString(v));
        return Number.isNaN(n) ? NaN : n;
      })
      .refine((n) => n === undefined || Number.isFinite(n), "Enter a number")
      .refine((n) => n === undefined || n > 0, "Enter a positive amount")
      .optional(),
    currency: z.enum(["NGN", "USD", "GBP"]).optional(),

    // Honeypot
    company: z.string().max(0).optional(),
  })
  // Pairing rule: if amount is set, currency is required
  .refine((d) => d.budgetAmount === undefined || !!d.currency, {
    message: "Select a currency",
    path: ["currency"],
  })
  // (optional) If currency is set without amount, flag it
  .refine((d) => !d.currency || d.budgetAmount !== undefined, {
    message: "Enter an amount",
    path: ["budgetAmount"],
  });

export type ContactMessage = z.infer<typeof ContactMessageSchema>;
