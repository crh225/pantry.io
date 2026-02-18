const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, '..', 'public');
const SVG = fs.readFileSync(path.join(PUBLIC, 'favicon.svg'));

const SIZES = [
  // Standard PWA icons
  { name: 'icon-72.png', size: 72 },
  { name: 'icon-96.png', size: 96 },
  { name: 'icon-128.png', size: 128 },
  { name: 'icon-144.png', size: 144 },
  { name: 'icon-152.png', size: 152 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-384.png', size: 384 },
  { name: 'icon-512.png', size: 512 },
  // Apple touch icon
  { name: 'apple-touch-icon.png', size: 180 },
  // Favicons
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-32.png', size: 32 },
];

// Maskable icon: SVG rendered at smaller size with solid background padding
const MASKABLE = { name: 'icon-maskable-512.png', size: 512, padding: 80 };

async function generate() {
  // Generate standard icons
  for (const { name, size } of SIZES) {
    await sharp(SVG, { density: Math.max(300, size * 3) })
      .resize(size, size)
      .png()
      .toFile(path.join(PUBLIC, name));
    console.log(`  ${name}`);
  }

  // Generate maskable icon (icon with safe-zone padding + background fill)
  const innerSize = MASKABLE.size - MASKABLE.padding * 2;
  const inner = await sharp(SVG, { density: 900 })
    .resize(innerSize, innerSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: MASKABLE.size,
      height: MASKABLE.size,
      channels: 4,
      background: { r: 250, g: 246, b: 240, alpha: 1 }, // #faf6f0 from SVG bg
    },
  })
    .composite([{ input: inner, left: MASKABLE.padding, top: MASKABLE.padding }])
    .png()
    .toFile(path.join(PUBLIC, MASKABLE.name));
  console.log(`  ${MASKABLE.name} (maskable)`);

  // Generate ICO from 16, 32, 48 px PNGs using the sharp PNGs
  // ICO is just multi-size — we'll keep the existing one and overwrite favicon-16/32
  console.log('\nDone! Update manifest.json and index.html to reference the new icons.');
}

generate().catch(err => { console.error(err); process.exit(1); });
