import nodemailer from "nodemailer";
import { env } from "../env";

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE, // true for 465, false for 587
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

/** Useful for health checks during dev */
export async function verifyTransport() {
  try {
    await transporter.verify();
    return true;
  } catch (e) {
    console.error("SMTP verify failed:", e);
    return false;
  }
}

const currencyMeta: Record<
  "NGN" | "USD" | "GBP",
  { symbol: string; locale: string }
> = {
  NGN: { symbol: "₦", locale: "en-NG" },
  USD: { symbol: "$", locale: "en-US" },
  GBP: { symbol: "£", locale: "en-GB" },
};

function formatBudget(amount?: number, currency?: "NGN" | "USD" | "GBP") {
  if (!amount || !currency) return "N/A";
  const meta = currencyMeta[currency];
  return `${meta.symbol}${new Intl.NumberFormat(meta.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)} ${currency}`;
}

export async function sendContactEmail(payload: {
  name: string;
  email: string;
  message: string;
  phone?: string;
  website?: string;
  budgetAmount?: number;
  currency?: "NGN" | "USD" | "GBP";
}) {
  const subject = `New contact from ${payload.name} (${payload.email})`;
  const budget = formatBudget(payload.budgetAmount, payload.currency);

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#111">
      <h2 style="margin:0 0 8px">New Contact Message</h2>
      <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      ${
        payload.phone
          ? `<p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>`
          : ""
      }
      ${
        payload.website
          ? `<p><strong>Website:</strong> ${escapeHtml(payload.website)}</p>`
          : ""
      }
      <p><strong>Budget:</strong> ${budget}</p>
      <p><strong>Message:</strong></p>
      <div style="white-space:pre-wrap;border:1px solid #eee;padding:10px;border-radius:8px;background:#fafafa">
        ${escapeHtml(payload.message)}
      </div>
    </div>
  `;

  const text =
    `New Contact Message\n\n` +
    `Name: ${payload.name}\n` +
    `Email: ${payload.email}\n` +
    (payload.phone ? `Phone: ${payload.phone}\n` : "") +
    (payload.website ? `Website: ${payload.website}\n` : "") +
    `Budget: ${budget}\n\n` +
    `Message:\n${payload.message}\n`;

  return transporter.sendMail({
    from: env.MAIL_FROM,
    to: env.MAIL_TO,
    subject,
    text,
    html,
    replyTo: `${payload.name} <${payload.email}>`,
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
