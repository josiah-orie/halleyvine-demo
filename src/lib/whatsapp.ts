import { site } from "@/content/site";

export function whatsappNumber(): string {
  const n = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || site.whatsappDefaultNumber).replace(/\D/g, "");
  return n || site.whatsappDefaultNumber;
}

export function buildWhatsAppLink(opts: { source?: string | null; name?: string; interest?: string; number?: string } = {}): string {
  const parts: string[] = [site.whatsapp.message];
  if (opts.name) parts.push(`My name is ${opts.name}.`);
  if (opts.interest) parts.push(`I'm interested in: ${opts.interest}.`);
  if (opts.source) parts.push(`(Ref: ${opts.source})`);
  const number = (opts.number ?? whatsappNumber()).replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(parts.join(" "))}`;
}
