"use client";

import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { useSource } from "./SourceProvider";

type Props = { label: string; className?: string; location: string };

export function WhatsAppButton({ label, className = "btn btn-whatsapp btn-lg", location }: Props) {
  const { source } = useSource();
  return (
    <a
      href={buildWhatsAppLink({ source })}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click", { location, source })}
    >
      {label}
    </a>
  );
}

export function WhatsAppFab() {
  return <WhatsAppButton label="WhatsApp" className="hv-fab" location="floating" />;
}
