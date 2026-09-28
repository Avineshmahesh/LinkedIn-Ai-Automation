import type { AspectRatio, ImageStyle } from '@/types'

// Generates a deterministic, dependency-free "AI image" as an inline SVG
// data URI. This keeps the image-generation mock fully offline and fast,
// while still producing visually distinct results per style/topic so the
// preview and galleries don't look like static placeholders.

const STYLE_PALETTES: Record<ImageStyle, [string, string, string]> = {
  Modern: ['#4A55FF', '#8892FF', '#12151C'],
  Minimal: ['#EEF1F5', '#DCE1E8', '#454E5C'],
  Professional: ['#1C212B', '#3D45F0', '#B9C1CC'],
  '3D': ['#3D45F0', '#14B87F', '#1C212B'],
  Illustration: ['#E39A17', '#4A55FF', '#F7F8FA'],
  Technology: ['#0A0C11', '#14B87F', '#4A55FF'],
  Abstract: ['#E8484F', '#4A55FF', '#E39A17'],
}

const DIMENSIONS: Record<AspectRatio, { w: number; h: number }> = {
  '1:1': { w: 800, h: 800 },
  '4:5': { w: 800, h: 1000 },
  '16:9': { w: 1200, h: 675 },
}

function hashSeed(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function mulberry32(a: number) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function generateMockImage(
  seed: string,
  style: ImageStyle,
  aspectRatio: AspectRatio,
): string {
  const rand = mulberry32(hashSeed(seed + style))
  const { w, h } = DIMENSIONS[aspectRatio]
  const [c1, c2, c3] = STYLE_PALETTES[style]

  const shapes: string[] = []
  const shapeCount = 4 + Math.floor(rand() * 4)

  for (let i = 0; i < shapeCount; i++) {
    const kind = rand()
    const cx = rand() * w
    const cy = rand() * h
    const size = 60 + rand() * Math.min(w, h) * 0.35
    const opacity = (0.12 + rand() * 0.28).toFixed(2)
    const fill = [c1, c2, c3][Math.floor(rand() * 3)]

    if (kind < 0.34) {
      shapes.push(
        `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${size.toFixed(
          0,
        )}" fill="${fill}" opacity="${opacity}" />`,
      )
    } else if (kind < 0.67) {
      const rot = (rand() * 360).toFixed(0)
      shapes.push(
        `<rect x="${(cx - size / 2).toFixed(0)}" y="${(cy - size / 2).toFixed(
          0,
        )}" width="${size.toFixed(0)}" height="${size.toFixed(
          0,
        )}" rx="${(size * 0.18).toFixed(0)}" fill="${fill}" opacity="${opacity}" transform="rotate(${rot} ${cx.toFixed(
          0,
        )} ${cy.toFixed(0)})" />`,
      )
    } else {
      const x1 = cx - size
      const y1 = cy + size * 0.6
      const x2 = cx + size
      const y2 = cy + size * 0.6
      const x3 = cx
      const y3 = cy - size * 0.8
      shapes.push(
        `<polygon points="${x1.toFixed(0)},${y1.toFixed(0)} ${x2.toFixed(
          0,
        )},${y2.toFixed(0)} ${x3.toFixed(0)},${y3.toFixed(
          0,
        )}" fill="${fill}" opacity="${opacity}" />`,
      )
    }
  }

  const gridLines: string[] = []
  if (style === 'Technology' || style === 'Modern') {
    const step = Math.round(Math.min(w, h) / 10)
    for (let x = 0; x <= w; x += step) {
      gridLines.push(
        `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${c2}" stroke-opacity="0.06" />`,
      )
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c3}" />
        <stop offset="100%" stop-color="${c1}" stop-opacity="0.85" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)" />
    ${gridLines.join('')}
    ${shapes.join('')}
  </svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
