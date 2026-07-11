#!/usr/bin/env node
// Wraps the existing 32x32 icon.png in a minimal single-image ICO container
// (PNG-in-ICO has been valid since Windows Vista) so old clients requesting
// /favicon.ico get a real file instead of a 404.
const fs = require("fs");
const path = require("path");

const pngPath = path.join(__dirname, "..", "src", "app", "icon.png");
const icoPath = path.join(__dirname, "..", "src", "app", "favicon.ico");

const png = fs.readFileSync(pngPath);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // image count

const entry = Buffer.alloc(16);
entry.writeUInt8(32, 0); // width
entry.writeUInt8(32, 1); // height
entry.writeUInt8(0, 2); // color count (0 = not a palette image)
entry.writeUInt8(0, 3); // reserved
entry.writeUInt16LE(1, 4); // color planes
entry.writeUInt16LE(32, 6); // bits per pixel
entry.writeUInt32LE(png.length, 8); // size of PNG data
entry.writeUInt32LE(header.length + entry.length, 12); // offset of PNG data

fs.writeFileSync(icoPath, Buffer.concat([header, entry, png]));
console.log(`Wrote ${icoPath} (${png.length + 22} bytes)`);
