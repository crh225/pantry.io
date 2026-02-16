const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'favicon.svg');

async function generateFavicons() {
  const svgBuffer = fs.readFileSync(svgPath);

  // Generate 192x192 logo
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'logo192.png'));
  console.log('Created logo192.png');

  // Generate 512x512 logo
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'logo512.png'));
  console.log('Created logo512.png');

  // Generate 32x32 favicon
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32.png'));
  console.log('Created favicon-32.png');

  // Generate 16x16 favicon for ICO
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16.png'));
  console.log('Created favicon-16.png');

  // Generate ICO file (multi-size)
  // For simplicity, we'll use the 32x32 version as the .ico
  // Modern browsers use SVG or PNG anyway
  await sharp(svgBuffer)
    .resize(32, 32)
    .toFormat('png')
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Created favicon.ico (32x32 PNG renamed)');

  console.log('\nAll favicon images generated successfully!');
  console.log('The SVG favicon will be used by modern browsers automatically.');
}

generateFavicons().catch(console.error);
