import fs from 'fs'
import path from 'path'
import { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import sharp from 'sharp'
import ico from 'sharp-ico'
import { fileURLToPath } from 'url'
import { OiPerLogo, OiPerLogoBackground, OiPerLogoCompact } from '../logo'
import { OiPerLogoText, OiPerText } from '../text'

const PUBLIC_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../playground/public'
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
      <OiPerLogo brandColor={fillColor} />,
      iconResizes
    )
    await writeLogo(
      path.join(PUBLIC_DIR, 'logo-compact'),
      name,
      <OiPerLogoCompact brandColor={fillColor} />,
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
    <OiPerLogoBackground backgroundColor="#282828" brandColor="#FFFFFF" />,
    iconResizes
  )
  await writeLogo(
    path.join(PUBLIC_DIR, 'logo-background'),
    'light',
    <OiPerLogoBackground backgroundColor="#FFFFFF" brandColor="#000000" />,
    iconResizes
  )

  await writeFavicon('favicon.ico', '#FFFFFF')
  await writeFavicon('favicon-white.ico', '#FFFFFF')
  await writeFavicon('favicon-black.ico', '#000000')
})()
