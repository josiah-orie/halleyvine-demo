"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { INTEREST_OPTIONS, site } from "@/content/site";
import { enquirySchema } from "@/lib/schema";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { useSource } from "../SourceProvider";

type Errors = Partial<Record<string, string>>;

export function EnquiryForm() {
  const { source, interest, setInterest } = useSource();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ name: string; interestLabel: string } | null>(null);
  const startedAt = useRef<number>(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    const payload = { fullName, phone, email, interest, source: source ?? undefined, website, startedAt: startedAt.current };
    const parsed = enquirySchema.safeParse(payload);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] ??= issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fieldErrors?: Errors };
      if (res.ok && json.ok) {
        const label = INTEREST_OPTIONS.find((o) => o.value === interest)?.label ?? "";
        setSubmitted({ name: parsed.data.fullName, interestLabel: label });
        setStatus("success");
        trackEvent("enquiry_submit", { interest, source });
        return;
      }
      if (json.fieldErrors) setErrors(json.fieldErrors);
      setServerError(json.error ?? "Something went wrong. Please try again.");
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
    setStatus("idle");
  }

  if (status === "success" && submitted) {
    return (
      <div className="hv-form-card text-center" role="status" aria-live="polite">
        <h3 className="h3 mb-2">Thank you, {submitted.name.split(" ")[0]}.</h3>
        <p className="mb-4 text-body-secondary">Your enquiry has been received. Our team will be in touch shortly.</p>
        <a
          className="btn btn-whatsapp"
          href={buildWhatsAppLink({ source, name: submitted.name, interest: submitted.interestLabel })}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("whatsapp_click", { location: "post_enquiry", source })}
        >
          Continue on WhatsApp (optional)
        </a>
      </div>
    );
  }

  const busy = status === "submitting";
  return (
    <form className="hv-form-card" onSubmit={onSubmit} noValidate>
      <div className="mb-3">
        <label htmlFor="fullName" className="form-label fw-semibold">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          className={`form-control form-control-lg ${errors.fullName ? "is-invalid" : ""}`}
          placeholder="Enter your full name"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? "fullName-err" : undefined}
        />
        {errors.fullName && (
          <div id="fullName-err" className="invalid-feedback">
            {errors.fullName}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="phone" className="form-label fw-semibold">
          Phone / WhatsApp number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          className={`form-control form-control-lg ${errors.phone ? "is-invalid" : ""}`}
          placeholder="Enter your phone number"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-err" : undefined}
        />
        {errors.phone && (
          <div id="phone-err" className="invalid-feedback">
            {errors.phone}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label fw-semibold">
          Email <span className="text-body-secondary fw-normal">(optional)</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className={`form-control form-control-lg ${errors.email ? "is-invalid" : ""}`}
          placeholder="Enter your email address"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-err" : undefined}
        />
        {errors.email && (
          <div id="email-err" className="invalid-feedback">
            {errors.email}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="interest" className="form-label fw-semibold">
          What are you interested in?
        </label>
        <select
          id="interest"
          name="interest"
          className={`form-select form-select-lg ${errors.interest ? "is-invalid" : ""}`}
          value={interest}
          onChange={(e) => setInterest(e.target.value as typeof interest)}
          aria-invalid={!!errors.interest}
          aria-describedby={errors.interest ? "interest-err" : undefined}
        >
          <option value="">Select your interest</option>
          {INTEREST_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {errors.interest && (
          <div id="interest-err" className="invalid-feedback">
            {errors.interest}
          </div>
        )}
      </div>

      {/* Honeypot: hidden from people, visible to bots */}
      <div className="hv-hp" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      {serverError && (
        <div className="alert alert-danger" role="alert">
          {serverError}
        </div>
      )}

      <button type="submit" className="btn btn-hv btn-lg w-100" disabled={busy}>
        {busy ? "Sending..." : "Submit enquiry"}
      </button>
    </form>
  );
}

export function EnquirySection() {
  return (
    <section id="enquiry" className="hv-section hv-section--dark" aria-labelledby="enquiry-title">
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="text-center mb-4">
          <h2 id="enquiry-title" className="hv-title">
            {site.enquiry.title}
          </h2>
          <p className="mb-0 opacity-75">{site.enquiry.subtitle}</p>
        </div>
        <EnquiryForm />
      </div>
    </section>
  );
}
