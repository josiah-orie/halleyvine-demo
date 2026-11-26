"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { SiteImage } from "../SiteImage";
import { useSource } from "../SourceProvider";
import { trackEvent } from "@/lib/analytics";

type Unit = (typeof site.apartments.units)[number];

function Lightbox({ unit, onClose }: { unit: Unit; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="hv-lightbox" role="dialog" aria-modal="true" aria-label={`${unit.name} floor plan`} onClick={onClose}>
      <div className="bg-white rounded-3 p-3" style={{ maxWidth: 1000, width: "100%" }} onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <strong>{unit.name}</strong>
          <button ref={closeRef} type="button" className="btn-close" aria-label="Close floor plan" onClick={onClose} />
        </div>
        {unit.floorPlan ? (
          <Image
            src={unit.floorPlan.src}
            alt={`${unit.name} floor plan`}
            width={unit.floorPlan.width}
            height={unit.floorPlan.height}
            sizes="(min-width: 1032px) 1000px, 100vw"
            style={{ width: "100%", height: "auto" }}
          />
        ) : (
          <SiteImage src={null} alt={`${unit.name} floor plan`} label="Floor plan" aspect="4 / 3" />
        )}
      </div>
    </div>
  );
}

export function Apartments() {
  const { apartments } = site;
  const { goToEnquiry } = useSource();
  const [open, setOpen] = useState<Unit | null>(null);

  return (
    <section id="apartments" className="hv-section" aria-labelledby="apartments-title">
      <div className="container">
        <div className="text-center mb-5">
          <h2 id="apartments-title" className="hv-title">
            {apartments.title}
          </h2>
          <p className="hv-lead mb-0">{apartments.subtitle}</p>
        </div>
        <div className="row g-4 justify-content-center">
          {apartments.units.map((unit) => (
            <div key={unit.id} className="col-12 col-md-6 col-lg-5">
              <article className="hv-unit-card">
                <button
                  type="button"
                  className="hv-plan-btn"
                  aria-label={`View ${unit.name} floor plan`}
                  onClick={() => {
                    setOpen(unit);
                    trackEvent("floorplan_view", { unit: unit.id });
                  }}
                >
                  {unit.floorPlan ? (
                    <SiteImage
                      src={unit.floorPlan.src}
                      alt={`${unit.name} floor plan`}
                      aspect="4 / 3"
                      fit="contain"
                      sizes="(min-width: 992px) 480px, 100vw"
                      className="rounded-0"
                    />
                  ) : (
                    <SiteImage src={null} alt={`${unit.name} floor plan`} label={`${unit.name} floor plan`} aspect="4 / 3" className="rounded-0" />
                  )}
                </button>
                <div className="p-4">
                  <h3 className="h4">{unit.name}</h3>
                  <ul className="list-unstyled text-body-secondary mb-3">
                    {unit.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                  <div className="d-flex flex-wrap gap-2">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setOpen(unit)}>
                      View floor plan
                    </button>
                    <button type="button" className="btn btn-hv btn-sm" onClick={() => goToEnquiry("units")}>
                      Enquire about this unit
                    </button>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
      {open && <Lightbox unit={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
