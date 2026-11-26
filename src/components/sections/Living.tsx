import { site } from "@/content/site";
import { SiteImage } from "../SiteImage";

export function Living() {
  const { living } = site;
  return (
    <section id="living" className="hv-section hv-section--alt" aria-labelledby="living-title">
      <div className="container">
        <h2 id="living-title" className="hv-title text-center mb-4">
          {living.title}
        </h2>
        <div style={{ maxWidth: 960 }} className="mx-auto">
          <SiteImage src={living.image} alt={living.imageAlt} label="Living experience image" aspect="16 / 9" />
        </div>
        <p className="hv-lead text-center mx-auto mt-4 mb-5" style={{ maxWidth: 640 }}>
          {living.intro}
        </p>
        <div className="row g-4">
          {living.amenities.map((a) => (
            <div key={a.title} className="col-12 col-sm-6 col-lg-3">
              <div className="hv-amenity">
                <h3>{a.title}</h3>
                <p className="mb-0 text-body-secondary">{a.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
