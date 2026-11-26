import nodemailer from "nodemailer";
import { INTEREST_OPTIONS } from "@/content/site";
import type { EnquiryData } from "./schema";

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** Strip CR/LF to prevent header injection in the subject line. */
function oneLine(s: string): string {
  return s.replace(/[\r\n]+/g, " ").trim();
}

export function interestLabel(value: string): string {
  return INTEREST_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function buildEnquiryEmail(data: EnquiryData, when = new Date()) {
  const interest = interestLabel(data.interest);
  const source = data.source || "direct (no source code)";
  const rows: [string, string][] = [
    ["Name", data.fullName],
    ["Phone / WhatsApp", data.phone],
    ["Email", data.email ?? "not provided"],
    ["Interested in", interest],
    ["Source", source],
    ["Received", when.toISOString()],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<h2>New Halleyvine enquiry</h2><table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table>`;
  return {
    subject: oneLine(`New enquiry: ${data.fullName} - ${interest} [${source}]`),
    text,
    html,
  };
}

export function mailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SALES_TO_EMAIL && process.env.SALES_FROM_EMAIL);
}

export async function sendEnquiryEmail(data: EnquiryData) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  const { subject, text, html } = buildEnquiryEmail(data);
  await transporter.sendMail({
    from: process.env.SALES_FROM_EMAIL,
    to: process.env.SALES_TO_EMAIL,
    replyTo: data.email,
    subject,
    text,
    html,
  });
}
