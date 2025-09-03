import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
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
  WEB_ORIGIN: z.string().url(),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  // surface a clean error at boot
  // eslint-disable-next-line no-console
  console.error(
    "Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  throw new Error("Invalid env");
}

export const env = parsed.data;
