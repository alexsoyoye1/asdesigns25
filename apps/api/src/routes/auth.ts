import { Router } from "express";
import bcrypt from "bcryptjs";
import cookie from "cookie";
import { LoginSchema, MeSchema } from "@asdesigns/shared";
import { getDb } from "../db";
import User from "../models/User";
import { env } from "../env";
import { signAccess, signRefresh, verifyRefresh } from "../auth/jwt";
import { authRequired } from "../middleware/auth";

const router = Router();
const ACCESS_COOKIE = env.COOKIE_NAME;

/** DEV-ONLY: seed one admin account if none exists */
router.post("/dev/seed-admin", async (_req, res) => {
  if (process.env.NODE_ENV === "production") return res.status(404).end();

  await getDb();

  const existing = await User.findOne({ role: "admin" }).lean().exec(); // ✅ lean+exec
  if (existing) return res.json({ ok: true, note: "Admin exists" });

  const hash = await bcrypt.hash("admin123", 10);
  const u = await User.create({
    name: "Admin",
    email: "admin@local",
    passwordHash: hash,
    role: "admin",
  }); // create is fine

  return res.json({ ok: true, admin: { id: String(u._id), email: u.email } });
});

/** POST /auth/login */
router.post("/login", async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.flatten() });
  }

  await getDb();

  const { email, password } = parsed.data;
  const user = await User.findOne({ email }).exec(); // ✅ exec
  if (!user)
    return res.status(401).json({ ok: false, error: "INVALID_CREDENTIALS" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok)
    return res.status(401).json({ ok: false, error: "INVALID_CREDENTIALS" });

  const payload = {
    sub: String(user._id),
    role: user.role,
    email: user.email,
    name: user.name,
  } as const;
  const access = signAccess(payload);
  const refresh = signRefresh(payload);

  const accessCookie = cookie.serialize("access_token", access, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 15,
  });
  const refreshCookie = cookie.serialize("refresh_token", refresh, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  res.setHeader("Set-Cookie", [accessCookie, refreshCookie]);
  return res.json({ ok: true });
});

/** POST /auth/refresh */
router.post("/refresh", async (req, res) => {
  const rt = req.cookies?.refresh_token as string | undefined;
  if (!rt) return res.status(401).json({ ok: false, error: "NO_REFRESH" });
  try {
    const payload = verifyRefresh(rt);
    const access = signAccess(payload);
    const accessCookie = cookie.serialize("access_token", access, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 15,
    });
    res.setHeader("Set-Cookie", accessCookie);
    return res.json({ ok: true });
  } catch {
    return res.status(401).json({ ok: false, error: "INVALID_REFRESH" });
  }
});

/** GET /auth/me */
router.get("/me", authRequired, async (req, res) => {
  const { sub, email, name, role } = (req as any).user;
  const me = { id: sub, email, name, role };
  const check = MeSchema.safeParse(me);
  if (!check.success)
    return res.status(500).json({ ok: false, error: "INVALID_ME" });
  return res.json({ ok: true, me });
});

/** POST /auth/logout */
router.post("/logout", (_req, res) => {
  res.setHeader("Set-Cookie", [
    cookie.serialize("access_token", "", { path: "/", maxAge: 0 }),
    cookie.serialize("refresh_token", "", { path: "/", maxAge: 0 }),
  ]);
  return res.json({ ok: true });
});

export default router;
