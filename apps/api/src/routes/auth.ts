// apps/api/src/routes/auth.ts
import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import UserModel from "../models/User"; // <-- default export only (value)
import { signAccess, signRefresh } from "../auth/jwt"; // <-- matches your jwt.ts

const router = Router();

// ===== Validation Schemas =====
const RegisterSchema = z.object({
  name: z.string().min(1, "name required"),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "employee"]).default("employee"),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const SeedSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

// ===== Seed an admin once =====
router.post("/seed-admin", async (req, res) => {
  const { name, email, password } = SeedSchema.parse(req.body);

  const already = await UserModel.findOne({ role: "admin" }).lean().exec();
  if (already) return res.status(409).json({ error: "Admin already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  await UserModel.create({ name, email, passwordHash, role: "admin" });
  return res.json({ ok: true });
});

// ===== Register =====
router.post("/register", async (req, res) => {
  const { name, email, password, role } = RegisterSchema.parse(req.body);

  const exists = await UserModel.findOne({ email }).lean().exec();
  if (exists)
    return res.status(400).json({ message: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ name, email, passwordHash, role });

  const payload = {
    sub: String(user._id),
    role: user.role,
    email: user.email,
    name: user.name,
  };

  const accessToken = signAccess(payload);
  const refreshToken = signRefresh(payload);

  return res.json({ accessToken, refreshToken });
});

// ===== Login =====
router.post("/login", async (req, res) => {
  const { email, password } = LoginSchema.parse(req.body);

  const user = await UserModel.findOne({ email }).exec();
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const payload = {
    sub: String(user._id),
    role: user.role,
    email: user.email,
    name: user.name,
  };

  const accessToken = signAccess(payload);
  const refreshToken = signRefresh(payload);

  return res.json({ accessToken, refreshToken });
});

// ===== Logout (optional) =====
router.post("/logout", (_req, res) => {
  res.clearCookie("as_auth", { path: "/" });
  res.json({ ok: true });
});

export default router;
