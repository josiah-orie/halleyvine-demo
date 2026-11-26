import { describe, expect, it } from "vitest";
// @ts-expect-error plain JS module
import { qrUrl } from "./qr.mjs";

describe("qrUrl", () => {
  it("builds a tracked URL", () => {
    expect(qrUrl("stmarys-bulletin-jan", "https://halleyvine.online/")).toBe("https://halleyvine.online/?src=stmarys-bulletin-jan");
  });
  it("sanitizes and rejects empty codes", () => {
    expect(qrUrl("a b&c", "https://x.test")).toBe("https://x.test/?src=abc");
    expect(() => qrUrl("&&&")).toThrow();
  });
});
