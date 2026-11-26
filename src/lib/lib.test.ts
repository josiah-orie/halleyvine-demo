import { describe, expect, it, beforeEach, vi } from "vitest";
import { sanitizeSource, resolveSource, SOURCE_STORAGE_KEY } from "./source";
import { buildWhatsAppLink } from "./whatsapp";
import { enquirySchema, normalizePhone } from "./schema";
import { rateLimit, resetRateLimit } from "./rateLimit";
import { buildEnquiryEmail, escapeHtml } from "./mail";
import { trackEvent } from "./analytics";

function memStorage(initial: Record<string, string> = {}) {
  const m = new Map(Object.entries(initial));
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
}

describe("source tracking", () => {
  it("sanitizes and caps", () => {
    expect(sanitizeSource("stmarys-bulletin_jan")).toBe("stmarys-bulletin_jan");
    expect(sanitizeSource("<script>x</script>")).toBe("scriptxscript");
    expect(sanitizeSource("a".repeat(200))).toHaveLength(64);
    expect(sanitizeSource("")).toBeNull();
    expect(sanitizeSource(null)).toBeNull();
  });
  it("persists from URL and falls back to storage", () => {
    const s = memStorage();
    expect(resolveSource("?src=church-a", s)).toBe("church-a");
    expect(s.getItem(SOURCE_STORAGE_KEY)).toBe("church-a");
    expect(resolveSource("", s)).toBe("church-a");
  });
  it("returns null when missing", () => {
    expect(resolveSource("", memStorage())).toBeNull();
    expect(resolveSource("?src=", null)).toBeNull();
  });
});

describe("whatsapp link", () => {
  it("includes number, encoded text and source", () => {
    const url = buildWhatsAppLink({ source: "church-a", number: "2348090194101" });
    expect(url.startsWith("https://wa.me/2348090194101?text=")).toBe(true);
    expect(decodeURIComponent(url.split("text=")[1])).toContain("(Ref: church-a)");
  });
  it("omits ref when no source", () => {
    expect(decodeURIComponent(buildWhatsAppLink({}).split("text=")[1])).not.toContain("Ref:");
  });
});

describe("enquiry schema", () => {
  const base = { fullName: "Ada Obi", phone: "08090194101", interest: "brochure" };
  it("normalizes Nigerian numbers", () => {
    expect(normalizePhone("0809 019 4101")).toBe("+2348090194101");
    expect(normalizePhone("2348090194101")).toBe("+2348090194101");
    expect(normalizePhone("+234 809 019 4101")).toBe("+2348090194101");
  });
  it("accepts valid input and treats blank email as absent", () => {
    const r = enquirySchema.safeParse({ ...base, email: "" });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.phone).toBe("+2348090194101");
      expect(r.data.email).toBeUndefined();
    }
  });
  it("rejects bad input", () => {
    expect(enquirySchema.safeParse({ ...base, fullName: "A" }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...base, phone: "123" }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...base, email: "nope" }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...base, interest: "" }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...base, website: "http://spam" }).success).toBe(false);
  });
});

describe("rate limit", () => {
  beforeEach(() => resetRateLimit());
  it("blocks after the limit and recovers after the window", () => {
    for (let i = 0; i < 5; i++) expect(rateLimit("ip", 5, 1000, 0)).toBe(true);
    expect(rateLimit("ip", 5, 1000, 10)).toBe(false);
    expect(rateLimit("ip", 5, 1000, 2000)).toBe(true);
  });
});

describe("email builder", () => {
  it("escapes html and includes source", () => {
    const data = enquirySchema.parse({ fullName: "<b>Eve</b>", phone: "08090194101", interest: "pricing", source: "church-a" });
    const m = buildEnquiryEmail(data, new Date("2026-01-01T00:00:00Z"));
    expect(m.html).not.toContain("<b>Eve</b>");
    expect(m.html).toContain("&lt;b&gt;Eve&lt;/b&gt;");
    expect(m.subject).toContain("[church-a]");
    expect(m.text).toContain("Source: church-a");
    expect(escapeHtml(`"'&`)).toBe("&quot;&#39;&amp;");
  });
  it("strips newlines from the subject", () => {
    const data = enquirySchema.parse({ fullName: "Eve\r\nBcc: x@y.z", phone: "08090194101", interest: "brochure" });
    expect(buildEnquiryEmail(data).subject).not.toMatch(/[\r\n]/);
  });
});

describe("analytics", () => {
  it("is a safe no-op without scripts", () => {
    expect(() => trackEvent("x")).not.toThrow();
  });
  it("calls gtag when present", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    trackEvent("enquiry_submit", { a: 1 });
    expect(gtag).toHaveBeenCalledWith("event", "enquiry_submit", { a: 1 });
    delete window.gtag;
  });
});
