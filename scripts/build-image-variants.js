#!/usr/bin/env node
// Writes resized WebP copies of every photo under public/images into
// public/images/_opt/ (git-ignored), one per width in WIDTHS. The static
// export can't resize images on request, so src/lib/image-loader.js points
// next/image's srcset at these files instead of the full-size originals.
// Runs before `next dev` / `next build`; unchanged photos are skipped.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { WIDTHS } = require("../src/lib/image-widths.json");

const IMAGES_DIR = path.join(__dirname, "..", "public", "images");
const OUT_DIR = path.join(IMAGES_DIR, "_opt");
const QUALITY = 72;

function findImages(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (full !== OUT_DIR) out.push(...findImages(full));
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

async function variants(file) {
  const rel = path.relative(IMAGES_DIR, file).replace(/\.(jpe?g|png)$/i, "");
  const srcTime = fs.statSync(file).mtimeMs;
  let written = 0;
  for (const width of WIDTHS) {
    const out = path.join(OUT_DIR, `${rel}-${width}.webp`);
    if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= srcTime) continue;
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await sharp(file)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(out);
    written++;
  }
  return written;
}

async function main() {
  const files = findImages(IMAGES_DIR);
  const started = Date.now();
  let written = 0;
  // A few at a time: sharp is multi-threaded already.
  for (let i = 0; i < files.length; i += 4) {
    const counts = await Promise.all(files.slice(i, i + 4).map(variants));
    written += counts.reduce((a, b) => a + b, 0);
  }
  console.log(
    `Image variants: ${written} written for ${files.length} photos in ${((Date.now() - started) / 1000).toFixed(1)}s`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
