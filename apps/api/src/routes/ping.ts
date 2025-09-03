import { Router } from "express";
import { PingQuerySchema, PingResponseSchema } from "@asdesigns/shared";

const router = Router();

router.get("/", (req, res) => {
  const parsed = PingQuerySchema.safeParse({ name: req.query.name });
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.flatten() });
  }
  const { name } = parsed.data;
  const payload = { ok: true as const, message: `Hello, ${name}! 👋` };

  const check = PingResponseSchema.safeParse(payload);
  if (!check.success) {
    return res.status(500).json({ ok: false, error: check.error.flatten() });
  }
  return res.json(payload);
});

export default router;
