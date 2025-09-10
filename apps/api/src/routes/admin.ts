import { Router } from "express";
import { getDb } from "../db";
import ContactMessage from "../models/ContactMessage";

const router = Router();

router.get("/contacts", async (req, res) => {
  await getDb();

  const raw = req.query.q;
  const q = typeof raw === "string" ? raw.trim() : "";

  const filter = q
    ? {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
          { message: { $regex: q, $options: "i" } },
        ],
      }
    : {};

  const items = await ContactMessage.find(filter)
    .sort({ createdAt: -1 })
    .limit(200)
    .lean()
    .exec(); // <- important for TS overloads

  res.json({ ok: true, items });
});

export default router;
