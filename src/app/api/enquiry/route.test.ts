// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const sendMail = vi.fn();
vi.mock("nodemailer", () => ({ default: { createTransport: () => ({ sendMail }) } }));

import { POST } from "./route";
import { resetRateLimit } from "@/lib/rateLimit";

const valid = { fullName: "Ada Obi", phone: "08090194101", interest: "brochure", source: "church-a", startedAt: Date.now() - 10_000 };

function req(body: unknown, ip = "1.1.1.1") {
  return new Request("http://localhost/api/enquiry", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  resetRateLimit();
  sendMail.mockReset();
  process.env.SMTP_HOST = "smtp.test";
  process.env.SALES_TO_EMAIL = "sales@test.dev";
  process.env.SALES_FROM_EMAIL = "noreply@test.dev";
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/enquiry", () => {
  it("sends email on valid input", async () => {
    sendMail.mockResolvedValue({});
    const res = await POST(req(valid));
    expect(res.status).toBe(200);
    expect(sendMail).toHaveBeenCalledOnce();
    const arg = sendMail.mock.calls[0][0];
    expect(arg.to).toBe("sales@test.dev");
    expect(arg.text).toContain("Source: church-a");
  });
  it("returns 400 with field errors on invalid input", async () => {
    const res = await POST(req({ ...valid, phone: "1" }));
    expect(res.status).toBe(400);
    expect((await res.json()).fieldErrors.phone).toBeTruthy();
    expect(sendMail).not.toHaveBeenCalled();
  });
  it("returns 400 on malformed JSON", async () => {
    expect((await POST(req("{nope"))).status).toBe(400);
  });
  it("silently drops honeypot hits", async () => {
    const res = await POST(req({ ...valid, website: "spam" }));
    expect((await res.json()).ok).toBe(true);
    expect(sendMail).not.toHaveBeenCalled();
  });
  it("silently drops too-fast submissions", async () => {
    const res = await POST(req({ ...valid, startedAt: Date.now() }));
    expect((await res.json()).ok).toBe(true);
    expect(sendMail).not.toHaveBeenCalled();
  });
  it("rate limits per IP", async () => {
    sendMail.mockResolvedValue({});
    for (let i = 0; i < 5; i++) await POST(req(valid, "9.9.9.9"));
    expect((await POST(req(valid, "9.9.9.9"))).status).toBe(429);
  });
  it("returns a friendly error when SMTP fails", async () => {
    sendMail.mockRejectedValue(new Error("boom"));
    const res = await POST(req(valid));
    expect(res.status).toBe(502);
    expect(JSON.stringify(await res.json())).not.toContain("boom");
  });
  it("returns 503 when SMTP is not configured", async () => {
    delete process.env.SMTP_HOST;
    expect((await POST(req(valid))).status).toBe(503);
  });
});
