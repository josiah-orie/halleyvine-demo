"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

type Slide = { src: string; alt: string };
type Props = { images: Slide[]; intervalMs?: number };

const SWIPE_PX = 40;

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  mq?.addEventListener?.("change", cb);
  return () => mq?.removeEventListener?.("change", cb);
}
const getReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
const getReducedMotionServer = () => false;

/** Fading hero slideshow: autoplay, dots, swipe. Pauses on hover/focus, when the tab is hidden, and for reduced motion. */
export function HeroGallery({ images, intervalMs = 5000 }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getReducedMotionServer);
  const touchX = useRef<number | null>(null);
  const count = images.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused || reducedMotion) return;
    const t = window.setInterval(() => {
      if (document.visibilityState === "visible") setIndex((i) => (i + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(t);
  }, [count, paused, reducedMotion, intervalMs]);

  return (
    <div
      className="hv-media hv-hero-media hv-gallery"
      role="region"
      aria-roledescription="carousel"
      aria-label="Halleyvine Residence photos"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
        if (Math.abs(dx) > SWIPE_PX) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      {images.map((img, i) => (
        <div
          key={img.src}
          className={`hv-slide ${i === index ? "is-active" : ""}`}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${count}`}
          aria-hidden={i !== index}
        >
          <Image src={img.src} alt={img.alt} fill priority={i === 0} sizes="100vw" />
        </div>
      ))}

      {count > 1 && (
        <div className="hv-dots">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              className={`hv-dot ${i === index ? "is-active" : ""}`}
              aria-label={`Show photo ${i + 1} of ${count}`}
              aria-current={i === index}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
