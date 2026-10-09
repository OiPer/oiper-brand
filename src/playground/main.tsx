import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { OiPerLogoDissolve } from '../animations/dissolve'
import { OiPerLogoDraw } from '../animations/draw'
import { OiPerLogoMax } from '../animations/max'
import { OiPerLogoPro } from '../animations/pro'
import { OiPerLogoShine } from '../animations/shine'
import { OiPerLogoStripes } from '../animations/stripes'
import { OiPerLogoTextCascade } from '../animations/text-cascade'
import { OiPerLogoTextMax } from '../animations/text-max'
import { OiPerLogoTextPro } from '../animations/text-pro'
import { OiPerLogoTrace } from '../animations/trace'
import { OiPerLogoFlow } from '../canvas-animations/flow'
import { OiPerLogoGlyphs } from '../canvas-animations/glyphs'
import { OiPerLogoHalftone } from '../canvas-animations/halftone'
import { OiPerLogoInk } from '../canvas-animations/ink'
import { OiPerLogoParticles } from '../canvas-animations/particles'
import { OiPerLogoPixels } from '../canvas-animations/pixels'
import { OiPerLogoTextGlyphs } from '../canvas-animations/text-glyphs'
import { OiPerLogoTextHalftone } from '../canvas-animations/text-halftone'
import { OiPerLogoTextParticles } from '../canvas-animations/text-particles'
import { OiPerLogo, OiPerLogoBackground, OiPerLogoCompact } from '../logo'
import { OiPerLogoText, OiPerText } from '../text'

const ICON_SIZES = [16, 32, 64, 128]
const WORDMARK_HEIGHTS = [24, 48, 72]
const BRAND_COLOR = '#f5c451'

const FORMATS = ['svg', 'png', 'webp', 'avif'] as const

const ICON_FILE_SIZES = [16, 32, 48, 64, 128, 256, 512, 1024].map((size) => ({
  value: `${size}`,
  label: `${size}px`,
}))
const WORDMARK_FILE_SIZES = [32, 64, 128, 256, 512].map((height) => ({
  value: `h${height}`,
  label: `${height}px tall`,
}))

const ICONS = [
  { name: 'OiPerLogo', Logo: OiPerLogo, file: 'logo/white' },
  {
    name: 'OiPerLogoCompact',
    Logo: OiPerLogoCompact,
    file: 'logo-compact/white',
  },
  {
    name: 'OiPerLogoBackground',
    Logo: OiPerLogoBackground,
    file: 'logo-background/dark',
  },
]

const WORDMARKS = [
  { name: 'OiPerText', Logo: OiPerText, file: 'text/white' },
  { name: 'OiPerLogoText', Logo: OiPerLogoText, file: 'logo-text/white' },
]

type TAnimated = {
  name: string
  Logo: (props: {
    style?: CSSProperties
    brandColor?: string
    continuous?: boolean
  }) => ReactNode
  hasBrandColor: boolean
}

const ANIMATED: TAnimated[] = [
  { name: 'OiPerLogoMax', Logo: OiPerLogoMax, hasBrandColor: false },
  { name: 'OiPerLogoPro', Logo: OiPerLogoPro, hasBrandColor: false },
  { name: 'OiPerLogoDraw', Logo: OiPerLogoDraw, hasBrandColor: true },
  { name: 'OiPerLogoShine', Logo: OiPerLogoShine, hasBrandColor: true },
  { name: 'OiPerLogoTrace', Logo: OiPerLogoTrace, hasBrandColor: true },
  { name: 'OiPerLogoDissolve', Logo: OiPerLogoDissolve, hasBrandColor: true },
  { name: 'OiPerLogoStripes', Logo: OiPerLogoStripes, hasBrandColor: true },
]

const ANIMATED_WORDMARKS: TAnimated[] = [
  { name: 'OiPerLogoTextMax', Logo: OiPerLogoTextMax, hasBrandColor: false },
  { name: 'OiPerLogoTextPro', Logo: OiPerLogoTextPro, hasBrandColor: false },
  {
    name: 'OiPerLogoTextCascade',
    Logo: OiPerLogoTextCascade,
    hasBrandColor: true,
  },
]

const CANVAS_ANIMATED: TAnimated[] = [
  { name: 'OiPerLogoParticles', Logo: OiPerLogoParticles, hasBrandColor: true },
  { name: 'OiPerLogoGlyphs', Logo: OiPerLogoGlyphs, hasBrandColor: true },
  { name: 'OiPerLogoFlow', Logo: OiPerLogoFlow, hasBrandColor: true },
  { name: 'OiPerLogoHalftone', Logo: OiPerLogoHalftone, hasBrandColor: true },
  { name: 'OiPerLogoInk', Logo: OiPerLogoInk, hasBrandColor: true },
  { name: 'OiPerLogoPixels', Logo: OiPerLogoPixels, hasBrandColor: true },
]

const CANVAS_ANIMATED_WORDMARKS: TAnimated[] = [
  {
    name: 'OiPerLogoTextParticles',
    Logo: OiPerLogoTextParticles,
    hasBrandColor: true,
  },
  {
    name: 'OiPerLogoTextGlyphs',
    Logo: OiPerLogoTextGlyphs,
    hasBrandColor: true,
  },
  {
    name: 'OiPerLogoTextHalftone',
    Logo: OiPerLogoTextHalftone,
    hasBrandColor: true,
  },
]

async function copyFile(url: string, format: (typeof FORMATS)[number]) {
  if (format === 'svg') {
    const response = await fetch(url)
    await navigator.clipboard.writeText(await response.text())
    return
  }
  if (format === 'png') {
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': fetch(url).then((response) => response.blob()),
      }),
    ])
    return
  }
  throw new Error(`Copying ${format} is not supported`)
}

function Downloads({
  file,
  sizes,
}: {
  file: string
  sizes: Array<{ value: string; label: string }>
}) {
  const [open, setOpen] = useState<'copy' | 'download' | null>(null)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(null)
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(null)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div className="downloads" ref={ref}>
      <button
        aria-expanded={open === 'copy'}
        onClick={() => setOpen(open === 'copy' ? null : 'copy')}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <button
        aria-expanded={open === 'download'}
        onClick={() => setOpen(open === 'download' ? null : 'download')}
      >
        Download
      </button>

      {open && (
        <div className="menu">
          {FORMATS.filter(
            (format) =>
              open === 'download' || format === 'svg' || format === 'png'
          ).map((format) => (
            <div key={format} className="menu-row">
              <span>{format.toUpperCase()}</span>
              <div>
                {(format === 'svg'
                  ? [{ value: 'svg', label: 'Vector' }]
                  : sizes
                ).map((size) => {
                  const url =
                    format === 'svg'
                      ? `/${file}.svg`
                      : `/${file}-${size.value}.${format}`

                  if (open === 'copy') {
                    return (
                      <button
                        key={size.value}
                        onClick={() => {
                          setOpen(null)
                          void copyFile(url, format).then(() => {
                            setCopied(true)
                            setTimeout(() => setCopied(false), 1500)
                          })
                        }}
                      >
                        {size.label}
                      </button>
                    )
                  }
                  return (
                    <a
                      key={size.value}
                      href={url}
                      download={`oiper-${url.slice(1).replace('/', '-')}`}
                      onClick={() => setOpen(null)}
                    >
                      {size.label}
                    </a>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AnimatedTable({
  items,
  isWordmark,
}: {
  items: TAnimated[]
  isWordmark: boolean
}) {
  const sizes = isWordmark ? [24, 48] : ICON_SIZES
  const previewSize = isWordmark ? 48 : 64

  function sizeStyle(size: number): CSSProperties {
    if (isWordmark) return { width: (size * 1786) / 444, height: size }
    return { fontSize: size }
  }

  return (
    <div className={isWordmark ? 'grid animated-wordmarks' : 'grid animated'}>
      <div className="head">
        <span>Component</span>
        {sizes.map((size) => (
          <span key={size}>{size}px</span>
        ))}
        <span>Brand color</span>
        <span>Continuous</span>
      </div>
      {items.map((item) => (
        <div key={item.name}>
          <code>{item.name}</code>
          {sizes.map((size) => (
            <span key={size}>
              <item.Logo style={sizeStyle(size)} />
            </span>
          ))}
          <span>
            {item.hasBrandColor && (
              <item.Logo
                brandColor={BRAND_COLOR}
                style={sizeStyle(previewSize)}
              />
            )}
          </span>
          <span>
            <item.Logo continuous style={sizeStyle(previewSize)} />
          </span>
        </div>
      ))}
    </div>
  )
}

function App() {
  return (
    <div className="page">
      <header>
        <div>
          <h1>OiPer Logo</h1>
          <p className="lede">All logo components at different sizes.</p>
        </div>
        <a className="brand-kit" href="/oiper-brand-kit.zip" download>
          Download brand kit
        </a>
      </header>

      <section>
        <h2>Icons</h2>
        <div className="grid icons">
          <div className="head">
            <span>Component</span>
            {ICON_SIZES.map((size) => (
              <span key={size}>{size}px</span>
            ))}
            <span>Brand color</span>
          </div>
          {ICONS.map((icon) => (
            <div key={icon.name}>
              <div className="name">
                <code>{icon.name}</code>
                <Downloads file={icon.file} sizes={ICON_FILE_SIZES} />
              </div>
              {ICON_SIZES.map((size) => (
                <span key={size}>
                  <icon.Logo style={{ fontSize: size }} />
                </span>
              ))}
              <span>
                <icon.Logo brandColor={BRAND_COLOR} style={{ fontSize: 64 }} />
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Wordmarks</h2>
        <div className="grid wordmarks">
          <div className="head">
            <span>Component</span>
            {WORDMARK_HEIGHTS.map((height) => (
              <span key={height}>{height}px</span>
            ))}
          </div>
          {WORDMARKS.map((wordmark) => (
            <div key={wordmark.name}>
              <div className="name">
                <code>{wordmark.name}</code>
                <Downloads file={wordmark.file} sizes={WORDMARK_FILE_SIZES} />
              </div>
              {WORDMARK_HEIGHTS.map((height) => (
                <span key={height}>
                  <wordmark.Logo style={{ width: 'auto', height }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Animated</h2>
        <AnimatedTable items={ANIMATED} isWordmark={false} />
        <AnimatedTable items={ANIMATED_WORDMARKS} isWordmark />
      </section>

      <section>
        <h2>Canvas Animation</h2>
        <AnimatedTable items={CANVAS_ANIMATED} isWordmark={false} />
        <AnimatedTable items={CANVAS_ANIMATED_WORDMARKS} isWordmark />
      </section>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
