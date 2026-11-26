import { site } from "@/content/site";
import { SiteImage } from "../SiteImage";

export function Location() {
  const { location } = site;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(location.mapQuery)}&output=embed`;
  return (
    <section id="location" className="hv-section" aria-labelledby="location-title">
      <div className="container" style={{ maxWidth: 960 }}>
        <h2 id="location-title" className="hv-title text-center mb-4">
          {location.title}
        </h2>
        <div className="position-relative">
          <SiteImage src={location.image} alt={location.imageAlt} label="Novare Mall, Sangotedo" aspect="16 / 10" />
          <div className="hv-map-overlay">
            <iframe
              title="Map showing the Halleyvine location in Sangotedo"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
        <p className="hv-lead mt-4">{location.text}</p>
        <div className="hv-callout">
          <strong>{location.coastalCallout.title}</strong>
          <p className="mb-0">{location.coastalCallout.text}</p>
        </div>
      </div>
    </section>
  );
}
