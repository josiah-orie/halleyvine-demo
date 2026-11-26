import Image from "next/image";
import { site } from "@/content/site";

export function Footer() {
  const { developer } = site;
  return (
    <footer className="hv-footer">
      <div className="container">
        <div className="hv-developer">
          <span className="hv-eyebrow">Developed by</span>
          {developer.logo && (
            <span className="hv-developer-logo">
              <Image src={developer.logo.src} alt={developer.name} width={developer.logo.width} height={developer.logo.height} sizes="160px" />
            </span>
          )}
          <span className="hv-developer-name">{developer.name}</span>
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-between gap-2 pt-4 mt-4 border-top border-light border-opacity-10">
          <span>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </span>
          <span>{site.domain}</span>
        </div>
      </div>
    </footer>
  );
}
