import { z } from "zod";

export const PingQuerySchema = z.object({
  name: z.string().min(1).default("World")
});

export const PingResponseSchema = z.object({
  ok: z.literal(true),
  message: z.string()
});

export type PingQuery = z.infer<typeof PingQuerySchema>;
export type PingResponse = z.infer<typeof PingResponseSchema>;

export const InvoiceSchema = z.object({
  id: z.string(),
  amount: z.number(),
  status: z.enum(["pending", "paid"])
});
export type Invoice = z.infer<typeof InvoiceSchema>;
