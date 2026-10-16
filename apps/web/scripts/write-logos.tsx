import {
  OiPerLogo,
  OiPerLogoBackground,
  OiPerLogoCompact,
  OiPerLogoText,
  OiPerText,
} from '@oiper/brand'
import { zipSync } from 'fflate'
import fs from 'fs'
import path from 'path'
import { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import sharp from 'sharp'
import ico from 'sharp-ico'
import { fileURLToPath } from 'url'

const PUBLIC_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../public'
)

const ICON_SIZES = [16, 32, 48, 64, 128, 256, 512, 1024]
const WORDMARK_HEIGHTS = [32, 64, 128, 256, 512]
const FAVICON_SIZES = [16, 32, 48, 64]
const FORMATS = ['png', 'webp', 'avif'] as const

const COLORS = [
  { name: 'black', fillColor: '#000000' },
  { name: 'white', fillColor: '#FFFFFF' },
  { name: 'red', fillColor: '#FF0000' },
  { name: 'blue', fillColor: '#0000FF' },
  { name: 'cyan', fillColor: '#00FFFF' },
  { name: 'green', fillColor: '#00FF00' },
  { name: 'yellow', fillColor: '#FFFF00' },
  { name: 'purple', fillColor: '#FF00FF' },
]

async function writeLogo(
  dir: string,
  name: string,
  element: ReactElement,
  resizes: Array<{ suffix: string; width?: number; height: number }>
) {
  fs.mkdirSync(dir, { recursive: true })

  const svg = renderToStaticMarkup(element)
  fs.writeFileSync(path.join(dir, `${name}.svg`), svg)

  for (const { suffix, width, height } of resizes) {
    for (const format of FORMATS) {
      await sharp(Buffer.from(svg), { density: 600 })
        .resize({ width, height })
        .toFormat(format)
        .toFile(path.join(dir, `${name}-${suffix}.${format}`))
    }
  }
}

async function writeFavicon(fileName: string, fillColor: string) {
  const svg = renderToStaticMarkup(<OiPerLogo brandColor={fillColor} />)
  const pngs = await Promise.all(
    FAVICON_SIZES.map((size) =>
      sharp(Buffer.from(svg), { density: 600 })
        .resize(size, size)
        .png()
        .toBuffer()
    )
  )
  fs.writeFileSync(path.join(PUBLIC_DIR, fileName), ico.encode(pngs))
}

void (async () => {
  fs.rmSync(PUBLIC_DIR, { recursive: true, force: true })
  fs.mkdirSync(PUBLIC_DIR, { recursive: true })

  const iconResizes = ICON_SIZES.map((size) => ({
    suffix: `${size}`,
    width: size,
    height: size,
  }))
  const wordmarkResizes = WORDMARK_HEIGHTS.map((height) => ({
    suffix: `h${height}`,
    height,
  }))

  for (const { name, fillColor } of COLORS) {
    await writeLogo(
      path.join(PUBLIC_DIR, 'logo'),
      name,
      <OiPerLogo brandColor={fillColor} width={512} height={512} />,
      iconResizes
    )
    await writeLogo(
      path.join(PUBLIC_DIR, 'logo-compact'),
      name,
      <OiPerLogoCompact brandColor={fillColor} width={512} height={512} />,
      iconResizes
    )
    await writeLogo(
      path.join(PUBLIC_DIR, 'text'),
      name,
      <OiPerText brandColor={fillColor} />,
      wordmarkResizes
    )
    await writeLogo(
      path.join(PUBLIC_DIR, 'logo-text'),
      name,
      <OiPerLogoText brandColor={fillColor} />,
      wordmarkResizes
    )
  }

  await writeLogo(
    path.join(PUBLIC_DIR, 'logo-background'),
    'dark',
    <OiPerLogoBackground
      backgroundColor="#282828"
      brandColor="#FFFFFF"
      width={512}
      height={512}
    />,
    iconResizes
  )
  await writeLogo(
    path.join(PUBLIC_DIR, 'logo-background'),
    'light',
    <OiPerLogoBackground
      backgroundColor="#FFFFFF"
      brandColor="#000000"
      width={512}
      height={512}
    />,
    iconResizes
  )

  await writeFavicon('favicon.ico', '#FFFFFF')
  await writeFavicon('favicon-white.ico', '#FFFFFF')
  await writeFavicon('favicon-black.ico', '#000000')

  const SITE = 'https://brand.oiper.com'
  const colorNames = COLORS.map((color) => color.name)
  const iconSizes = ICON_SIZES.join(', ')
  const wordmarkHeights = WORDMARK_HEIGHTS.join(', ')
  const svgFiles = [
    ...colorNames.flatMap((color) => [
        `logo/${color}.svg`,
        `logo-compact/${color}.svg`,
        `text/${color}.svg`,
        `logo-text/${color}.svg`,
      ]),
    'logo-background/dark.svg',
    'logo-background/light.svg',
  ]

  const llmsTxt = `# OiPer Brand

> Logo and brand assets for OiPer. Every file below is hosted at ${SITE} and hotlinkable (CORS: Access-Control-Allow-Origin: *). Animated logos ship as React components in the npm package \`@oiper/brand\` (source: https://github.com/OiPer/oiper-brand).

## Main logos

The primary pair, one white and one black:

- ${SITE}/logo/white.svg
- ${SITE}/logo/black.svg

Raster versions of the same two: ${SITE}/logo/white-{size}.{format} and ${SITE}/logo/black-{size}.{format}.

## Static logo URL scheme

Available colors: white, black, ${colorNames.filter((color) => color !== 'white' && color !== 'black').join(', ')} (white and black are the defaults; the rest are optional variants).
Raster formats: png, webp, avif.

### OiPerLogo (square icon)
- SVG: ${SITE}/logo/{color}.svg
- Raster, sizes ${iconSizes}: ${SITE}/logo/{color}-{size}.{format}
- Example: ${SITE}/logo/white-512.png

### OiPerLogoCompact (square icon)
- SVG: ${SITE}/logo-compact/{color}.svg
- Raster, sizes ${iconSizes}: ${SITE}/logo-compact/{color}-{size}.{format}

### OiPerLogoBackground (logo on filled background, only dark and light)
- SVG: ${SITE}/logo-background/{dark|light}.svg
- Raster, sizes ${iconSizes}: ${SITE}/logo-background/{dark|light}-{size}.{format}

### OiPerText (wordmark)
- SVG: ${SITE}/text/{color}.svg
- Raster, heights ${wordmarkHeights}: ${SITE}/text/{color}-h{height}.{format}
- Example: ${SITE}/text/black-h128.webp

### OiPerLogoText (icon + wordmark)
- SVG: ${SITE}/logo-text/{color}.svg
- Raster, heights ${wordmarkHeights}: ${SITE}/logo-text/{color}-h{height}.{format}

## All SVG files

${svgFiles.map((file) => `- ${SITE}/${file}`).join('\n')}

## Other

- Favicons: ${SITE}/favicon.ico, ${SITE}/favicon-white.ico, ${SITE}/favicon-black.ico
- Brand kit, one zip of every SVG/PNG/ICO: ${SITE}/oiper-brand-kit.zip

## Animated logos

No hosted files. OiPerLogoMax, OiPerLogoPro, OiPerLogoDraw, OiPerLogoShine, OiPerLogoTrace, OiPerLogoDissolve, OiPerLogoStripes, OiPerLogoParticles, OiPerLogoGlyphs, OiPerLogoFlow, OiPerLogoHalftone, OiPerLogoInk, OiPerLogoPixels and the wordmark variants are React components in \`@oiper/brand\`.
`

  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), llmsTxt)

  const brandKit: Record<string, Uint8Array> = {}
  for (const entry of fs.readdirSync(PUBLIC_DIR, { recursive: true })) {
    const filePath = path.join(PUBLIC_DIR, entry.toString())
    if (!/\.(svg|png|ico)$/.test(filePath)) continue
    brandKit[`oiper-brand-kit/${entry.toString()}`] = fs.readFileSync(filePath)
  }
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'oiper-brand-kit.zip'),
    zipSync(brandKit, { level: 9 })
  )
})()
