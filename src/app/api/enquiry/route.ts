import { enquirySchema } from "@/lib/schema";
import { mailConfigured, sendEnquiryEmail } from "@/lib/mail";
import { rateLimit } from "@/lib/rateLimit";
import { sanitizeSource } from "@/lib/source";

export const dynamic = "force-dynamic";

const MIN_FILL_MS = 2500;

function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: Request) {
  if (!rateLimit(`enquiry:${clientIp(req)}`)) {
    return Response.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    // A filled honeypot is treated as a bot: pretend success so it learns nothing.
    if (fieldErrors.website) return Response.json({ ok: true });
    return Response.json({ ok: false, error: "Please check the form.", fieldErrors }, { status: 400 });
  }

  const data = parsed.data;
  if (typeof data.startedAt === "number" && Date.now() - data.startedAt < MIN_FILL_MS) {
    return Response.json({ ok: true }); // too fast: silently drop
  }
  data.source = sanitizeSource(data.source) ?? undefined;

  if (!mailConfigured()) {
    console.error("Enquiry received but SMTP is not configured.");
    return Response.json({ ok: false, error: "We could not send your enquiry right now. Please use WhatsApp." }, { status: 503 });
  }

  try {
    await sendEnquiryEmail(data);
  } catch (err) {
    console.error("Failed to send enquiry email:", err instanceof Error ? err.message : "unknown error");
    return Response.json({ ok: false, error: "We could not send your enquiry right now. Please try again or use WhatsApp." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
