import Image from "next/image";

type Props = {
  src: string | null;
  alt: string;
  label?: string;
  aspect?: string; // CSS aspect-ratio, e.g. "16 / 9"
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** "cover" fills and crops (photos); "contain" shows the whole image on white (floor plans, drawings). */
  fit?: "cover" | "contain";
};

/** Renders a real image when available, otherwise a clearly labeled placeholder box. */
export function SiteImage({ src, alt, label, aspect = "16 / 9", priority = false, sizes = "(min-width: 992px) 960px, 100vw", className = "", fit = "cover" }: Props) {
  const fitClass = src && fit === "contain" ? "hv-media--contain" : "";
  return (
    <div className={`hv-media ${fitClass} ${className}`} style={aspect === "auto" ? undefined : { aspectRatio: aspect }}>
      {src ? (
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} />
      ) : (
        <div className="hv-placeholder w-100 h-100" role="img" aria-label={`Placeholder: ${alt}`}>
          Image placeholder: {label ?? alt}
        </div>
      )}
    </div>
  );
}
