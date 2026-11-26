import { site } from "@/content/site";
import { WhatsAppButton } from "../WhatsAppButton";

export function WhatsAppSection() {
  return (
    <section id="whatsapp" className="hv-section hv-section--alt text-center" aria-labelledby="wa-title">
      <div className="container" style={{ maxWidth: 640 }}>
        <h2 id="wa-title" className="hv-title mb-3">
          {site.whatsapp.title}
        </h2>
        <p className="hv-lead mb-4">
          <a href={`tel:${site.whatsapp.phone}`} className="hv-call-link">
            {site.whatsapp.call}
          </a>
        </p>
        <WhatsAppButton label={site.whatsapp.cta} location="section" />
      </div>
    </section>
  );
}
