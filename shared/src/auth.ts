import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Min 6 characters"),
});
export type LoginInput = z.input<typeof LoginSchema>;

export const MeSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "employee"]),
});
export type Me = z.infer<typeof MeSchema>;
