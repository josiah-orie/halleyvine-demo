import { site } from "@/content/site";
import { SiteImage } from "../SiteImage";
import { HeroGallery } from "../HeroGallery";

export function Hero() {
  const { images, intervalMs, imageAlt } = site.hero;
  return (
    <section id="top" aria-labelledby="hero-title">
      {images.length > 0 ? (
        <HeroGallery images={images} intervalMs={intervalMs} />
      ) : (
        <SiteImage src={null} alt={imageAlt} label="Hero image (Halleyvine Residence)" aspect="auto" className="hv-hero-media" />
      )}
      <div className="container hv-hero-text">
        <p className="hv-eyebrow mb-2">{site.name} &middot; Sangotedo</p>
        <h1 id="hero-title" className="hv-title mb-3">
          {site.headline}
        </h1>
        <p className="hv-lead mx-auto mb-4" style={{ maxWidth: 560 }}>
          {site.hero.subcopy}
        </p>
        <a href="#introduction" className="hv-tab">
          {site.hero.cta}
        </a>
      </div>
    </section>
  );
}
