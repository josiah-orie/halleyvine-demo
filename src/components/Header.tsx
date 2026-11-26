import Image from "next/image";
import { site } from "@/content/site";

export function Header() {
  const { logo } = site;
  return (
    <header className="hv-header">
      <div className="container d-flex align-items-center justify-content-between py-2">
        <a href="#top" className="hv-brand" aria-label={`${site.name}, back to top`}>
          {logo ? (
            <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} priority sizes="120px" className="hv-logo" />
          ) : (
            site.shortName
          )}
        </a>
        <a href="#enquiry" className="btn btn-hv btn-sm">
          Enquire
        </a>
      </div>
    </header>
  );
}
