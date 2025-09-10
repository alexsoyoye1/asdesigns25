import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  // --- Email ---
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((v) => (v ?? "").toLowerCase())
    .transform((v) => v === "true")
    .or(z.boolean())
    .transform((v) => !!v),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  MAIL_FROM: z.string().min(3),
  MAIL_TO: z.string().min(3),

  // --- Web ---
  WEB_ORIGIN: z.string().url(),

  // --- Database ---
  MONGO_URI: z.string().min(10),

  // --- Auth / Cookies ---
  JWT_ACCESS_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),
  COOKIE_NAME: z.string().default("as_auth"),

  // --- Optional dev key (admin proxy fallback) ---
  ADMIN_KEY: z.string().optional(),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  // surface a clean error at boot
  console.error(
    "Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  throw new Error("Invalid env");
}

export const env = parsed.data;
