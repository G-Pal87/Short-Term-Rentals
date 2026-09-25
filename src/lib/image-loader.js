// next/image loader for the static export: maps each srcset width to the
// nearest pre-built WebP variant (scripts/build-image-variants.js) instead of
// always serving the full-size original.
const { WIDTHS } = require("./image-widths.json");

module.exports = function imageLoader({ src, width }) {
  const m = src.match(/^(.*)\/images\/(.+)\.(jpe?g|png)$/i);
  if (!m) return src;
  const variant = WIDTHS.find((w) => w >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `${m[1]}/images/_opt/${m[2]}-${variant}.webp`;
};
