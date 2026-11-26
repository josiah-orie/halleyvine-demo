import { site } from "@/content/site";
import { SiteImage } from "../SiteImage";

export function Intro() {
  const { intro } = site;
  return (
    <section id="introduction" className="hv-section hv-section--alt" aria-labelledby="intro-title">
      <div className="container" style={{ maxWidth: 860 }}>
        <h2 id="intro-title" className="hv-title mb-4 text-center">
          {intro.title}
        </h2>
        <SiteImage
          src={intro.image?.src ?? null}
          alt={intro.imageAlt}
          label="Introduction image"
          aspect={intro.image ? `${intro.image.width} / ${intro.image.height}` : "16 / 9"}
          sizes="(min-width: 900px) 860px, 100vw"
        />
        <div className="mt-4">
          {intro.body.map((p) => (
            <p key={p} className="hv-lead">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
