#!/usr/bin/env node
// Usage: node scripts/qr.mjs <codes-file.txt | code1,code2,...> [outDir]
// Generates one PNG QR code per source code pointing to https://halleyvine.online/?src=<code>
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function qrUrl(code, base = process.env.NEXT_PUBLIC_SITE_URL || "https://halleyvine.online") {
  const clean = String(code).trim().replace(/[^A-Za-z0-9_-]/g, "").slice(0, 64);
  if (!clean) throw new Error(`Invalid source code: "${code}"`);
  return `${base.replace(/\/$/, "")}/?src=${clean}`;
}

async function main() {
  const [input, outDir = "qr-codes"] = process.argv.slice(2);
  if (!input) {
    console.error("Usage: node scripts/qr.mjs <codes-file.txt | code1,code2,...> [outDir]");
    process.exit(1);
  }
  let raw = input;
  try {
    raw = await readFile(input, "utf8");
  } catch {
    /* treat as inline list */
  }
  const codes = raw.split(/[\s,]+/).filter(Boolean);
  const QRCode = (await import("qrcode")).default;
  await mkdir(outDir, { recursive: true });
  for (const code of codes) {
    const url = qrUrl(code);
    const file = path.join(outDir, `${code}.png`);
    await QRCode.toFile(file, url, { width: 1024, margin: 2, errorCorrectionLevel: "M" });
    console.log(`${file} -> ${url}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
