import { z } from "zod";
import { INTEREST_OPTIONS } from "@/content/site";

/** Normalize Nigerian numbers to +234XXXXXXXXXX; other international numbers keep a leading +. */
export function normalizePhone(input: string): string {
  const compact = input.trim().replace(/[\s\-().]/g, "");
  if (/^\+234\d{10}$/.test(compact)) return compact;
  if (/^234\d{10}$/.test(compact)) return `+${compact}`;
  if (/^0\d{10}$/.test(compact)) return `+234${compact.slice(1)}`;
  if (/^00\d{8,15}$/.test(compact)) return `+${compact.slice(2)}`;
  return compact;
}

const interestValues = INTEREST_OPTIONS.map((o) => o.value) as [string, ...string[]];

export const enquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "Name is too long."),
  phone: z
    .string()
    .trim()
    .min(1, "Please enter your phone or WhatsApp number.")
    .transform(normalizePhone)
    .refine((v) => /^\+\d{8,15}$/.test(v), "Please enter a valid phone number."),
  email: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => v === undefined || z.string().email().safeParse(v).success, "Please enter a valid email address."),
  interest: z.enum(interestValues, { message: "Please select your interest." }),
  source: z.string().max(64).optional(),
  /** Honeypot: must stay empty. */
  website: z.string().max(0).optional(),
  /** Epoch ms when the form was rendered, used for minimum submit time. */
  startedAt: z.number().optional(),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type EnquiryData = z.output<typeof enquirySchema>;
