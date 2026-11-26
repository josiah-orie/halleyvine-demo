export const SOURCE_STORAGE_KEY = "hv_src";
const MAX_LEN = 64;

/** Allow letters, digits, hyphen and underscore only; cap the length. Returns null when empty/invalid. */
export function sanitizeSource(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/[^A-Za-z0-9_-]/g, "").slice(0, MAX_LEN);
  return cleaned.length > 0 ? cleaned : null;
}

/** Read ?src= from the URL; if present persist it, otherwise fall back to the stored value. */
export function resolveSource(search: string, storage: Pick<Storage, "getItem" | "setItem"> | null): string | null {
  const fromUrl = sanitizeSource(new URLSearchParams(search).get("src"));
  if (fromUrl) {
    try {
      storage?.setItem(SOURCE_STORAGE_KEY, fromUrl);
    } catch {
      /* storage unavailable (private mode) */
    }
    return fromUrl;
  }
  try {
    return sanitizeSource(storage?.getItem(SOURCE_STORAGE_KEY));
  } catch {
    return null;
  }
}
