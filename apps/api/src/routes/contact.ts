import { Router } from "express";
import { ContactMessageSchema } from "@asdesigns/shared";
import { sendContactEmail } from "../lib/mailer";

const router = Router();

router.post("/", async (req, res) => {
  const parsed = ContactMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.flatten() });
  }

  const data = parsed.data;

  // Honeypot: bots fill "company"
  if (data.company && data.company.length > 0) {
    return res.status(204).end();
  }

  try {
    await sendContactEmail({
      name: data.name,
      email: data.email,
      message: data.message,
      phone: data.phone,
      website: data.website,
      budgetAmount: data.budgetAmount,
      currency: data.currency,
    });

    return res.json({ ok: true });
  } catch (e) {
    console.error("sendContactEmail failed:", e);
    return res.status(500).json({ ok: false, error: "MAIL_SEND_FAILED" });
  }
});

export default router;
