/**
 * Generates a 1200x630 PNG og:image.
 * Run: bun run og-image
 */
import sharp from 'sharp'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0a0a0f"/>
  <rect x="40" y="40" width="1120" height="550" rx="24" fill="#141420" stroke="#2a2a3c" stroke-width="2"/>
  <text x="600" y="280" text-anchor="middle" font-family="monospace" font-size="64" font-weight="bold" fill="#e0e0e8" letter-spacing="0.05em">shashidev.me</text>
  <text x="600" y="350" text-anchor="middle" font-family="monospace" font-size="24" fill="#8888a0">interactive desktop OS portfolio</text>
  <rect x="520" y="400" width="160" height="4" rx="2" fill="#7c5cfc"/>
</svg>`

await sharp(Buffer.from(svg)).png().toFile('public/og.png')
console.log('Generated public/og.png (1200x630)')
