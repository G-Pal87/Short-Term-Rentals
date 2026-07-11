#!/usr/bin/env node
// Recompresses every JPEG under public/images in place: caps the long edge at
// MAX_DIMENSION and re-encodes with mozjpeg. Run after adding new property photos.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const IMAGES_DIR = path.join(__dirname, "..", "public", "images");
const MAX_DIMENSION = 1920;
const QUALITY = 80;

function findJpegs(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...findJpegs(full));
    } else if (/\.(jpe?g)$/i.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

async function optimize(file) {
  const before = fs.statSync(file).size;
  const buffer = await sharp(file)
    .rotate() // apply EXIF orientation, then strip it
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer();
  fs.writeFileSync(file, buffer);
  const after = buffer.length;
  return { before, after };
}

async function main() {
  const files = findJpegs(IMAGES_DIR);
  let totalBefore = 0;
  let totalAfter = 0;
  for (const file of files) {
    const { before, after } = await optimize(file);
    totalBefore += before;
    totalAfter += after;
    const rel = path.relative(IMAGES_DIR, file);
    const pct = (100 * (1 - after / before)).toFixed(0);
    console.log(`${rel}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (-${pct}%)`);
  }
  console.log(
    `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB (-${(
      100 * (1 - totalAfter / totalBefore)
    ).toFixed(0)}%)`
  );
}

main();
