import {
  Copy01Icon,
  Download04Icon,
  Link01Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  OiPerLogoDissolve,
  OiPerLogoDraw,
  OiPerLogoFlow,
  OiPerLogoGlyphs,
  OiPerLogoHalftone,
  OiPerLogoInk,
  OiPerLogoMax,
  OiPerLogoParticles,
  OiPerLogoPixels,
  OiPerLogoPro,
  OiPerLogoShine,
  OiPerLogoStripes,
  OiPerLogoTextCascade,
  OiPerLogoTextGlyphs,
  OiPerLogoTextHalftone,
  OiPerLogoTextMax,
  OiPerLogoTextParticles,
  OiPerLogoTextPro,
  OiPerLogoTrace,
} from '@oiper/brand'
import { createFileRoute } from '@tanstack/react-router'
import clsx from 'clsx'
import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({
  component: Home,
})

const SQUARE_SIZE = 96
const WORDMARK_HEIGHT = 48

const FORMATS = ['svg', 'png', 'webp', 'avif'] as const

const ICON_FILE_SIZES = [16, 32, 48, 64, 128, 256, 512, 1024].map((size) => ({
  value: `${size}`,
  label: `${size}px`,
}))
const WORDMARK_FILE_SIZES = [32, 64, 128, 256, 512].map((height) => ({
  value: `h${height}`,
  label: `${height}px tall`,
}))

const SQUARE_LOGOS = [
  { name: 'OiPerLogo', file: 'logo/white', sizes: ICON_FILE_SIZES },
  {
    name: 'OiPerLogoCompact',
    file: 'logo-compact/white',
    sizes: ICON_FILE_SIZES,
  },
  {
    name: 'OiPerLogoBackground',
    file: 'logo-background/dark',
    sizes: ICON_FILE_SIZES,
  },
]

const WORDMARK_LOGOS = [
  { name: 'OiPerText', file: 'text/white', sizes: WORDMARK_FILE_SIZES },
  {
    name: 'OiPerLogoText',
    file: 'logo-text/white',
    sizes: WORDMARK_FILE_SIZES,
  },
]

type TAnimated = {
  name: string
  Logo: (props: { style?: CSSProperties; continuous?: boolean }) => ReactNode
}

const ANIMATED: TAnimated[] = [
  { name: 'OiPerLogoMax', Logo: OiPerLogoMax },
  { name: 'OiPerLogoPro', Logo: OiPerLogoPro },
  { name: 'OiPerLogoDraw', Logo: OiPerLogoDraw },
  { name: 'OiPerLogoShine', Logo: OiPerLogoShine },
  { name: 'OiPerLogoTrace', Logo: OiPerLogoTrace },
  { name: 'OiPerLogoDissolve', Logo: OiPerLogoDissolve },
  { name: 'OiPerLogoStripes', Logo: OiPerLogoStripes },
]

const ANIMATED_WORDMARKS: TAnimated[] = [
  { name: 'OiPerLogoTextMax', Logo: OiPerLogoTextMax },
  { name: 'OiPerLogoTextPro', Logo: OiPerLogoTextPro },
  {
    name: 'OiPerLogoTextCascade',
    Logo: OiPerLogoTextCascade,
  },
]

const CANVAS_ANIMATED: TAnimated[] = [
  { name: 'OiPerLogoParticles', Logo: OiPerLogoParticles },
  { name: 'OiPerLogoGlyphs', Logo: OiPerLogoGlyphs },
  { name: 'OiPerLogoFlow', Logo: OiPerLogoFlow },
  { name: 'OiPerLogoHalftone', Logo: OiPerLogoHalftone },
  { name: 'OiPerLogoInk', Logo: OiPerLogoInk },
  { name: 'OiPerLogoPixels', Logo: OiPerLogoPixels },
]

const CANVAS_ANIMATED_WORDMARKS: TAnimated[] = [
  {
    name: 'OiPerLogoTextParticles',
    Logo: OiPerLogoTextParticles,
  },
  {
    name: 'OiPerLogoTextGlyphs',
    Logo: OiPerLogoTextGlyphs,
  },
  {
    name: 'OiPerLogoTextHalftone',
    Logo: OiPerLogoTextHalftone,
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
  const [open, setOpen] = useState<'copy' | 'link' | 'download' | null>(null)
  const [copied, setCopied] = useState<'copy' | 'link' | null>(null)
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
    <div className="relative flex gap-1.5" ref={ref}>
      <button
        className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md border border-line bg-surface hover:border-muted aria-expanded:border-muted"
        aria-label="Copy"
        title="Copy"
        aria-expanded={open === 'copy'}
        onClick={() => setOpen(open === 'copy' ? null : 'copy')}
      >
        <HugeiconsIcon
          icon={copied === 'copy' ? Tick02Icon : Copy01Icon}
          size={16}
        />
      </button>
      <button
        className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md border border-line bg-surface hover:border-muted aria-expanded:border-muted"
        aria-label="Link"
        title="Link"
        aria-expanded={open === 'link'}
        onClick={() => setOpen(open === 'link' ? null : 'link')}
      >
        <HugeiconsIcon
          icon={copied === 'link' ? Tick02Icon : Link01Icon}
          size={16}
        />
      </button>
      <button
        className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md border border-line bg-surface hover:border-muted aria-expanded:border-muted"
        aria-label="Download"
        title="Download"
        aria-expanded={open === 'download'}
        onClick={() => setOpen(open === 'download' ? null : 'download')}
      >
        <HugeiconsIcon icon={Download04Icon} size={16} />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+0.375rem)] left-0 z-10 grid w-max gap-2.5 rounded-lg border border-line bg-background p-3 shadow-[0_12px_32px_rgb(0_0_0/0.5)]">
          {FORMATS.filter(
            (format) => open !== 'copy' || format === 'svg' || format === 'png'
          ).map((format) => (
            <div
              key={format}
              className="grid grid-cols-[2.75rem_auto] items-start gap-2"
            >
              <span className="pt-[0.3rem] text-xs font-[650] text-muted">
                {format.toUpperCase()}
              </span>
              <div className="grid grid-cols-[repeat(4,auto)] gap-1.5">
                {(format === 'svg'
                  ? [{ value: 'svg', label: 'Vector' }]
                  : sizes
                ).map((size) => {
                  const url =
                    format === 'svg'
                      ? `/${file}.svg`
                      : `/${file}-${size.value}.${format}`

                  if (open === 'copy' || open === 'link') {
                    return (
                      <button
                        key={size.value}
                        className="inline-flex h-7 cursor-pointer items-center rounded-md border border-line bg-surface px-2.5 text-xs font-medium whitespace-nowrap hover:border-muted"
                        onClick={async () => {
                          setOpen(null)
                          if (open === 'copy') await copyFile(url, format)
                          if (open === 'link') {
                            await navigator.clipboard.writeText(
                              new URL(url, window.location.origin).href
                            )
                          }
                          setCopied(open)
                          setTimeout(() => setCopied(null), 1500)
                        }}
                      >
                        {size.label}
                      </button>
                    )
                  }
                  return (
                    <a
                      key={size.value}
                      className="inline-flex h-7 cursor-pointer items-center rounded-md border border-line bg-surface px-2.5 text-xs font-medium whitespace-nowrap hover:border-muted"
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

function LogoTile({
  logo,
  isWordmark,
}: {
  logo: (typeof SQUARE_LOGOS)[number]
  isWordmark: boolean
}) {
  return (
    <article
      id={logo.name}
      className="flex flex-col rounded-md border border-line"
    >
      <div className="flex h-48 items-center justify-center">
        <img
          src={`/${logo.file}.svg`}
          alt={logo.name}
          className={clsx(
            isWordmark && 'h-12 w-auto',
            !isWordmark && 'size-24'
          )}
        />
      </div>
      <div className="flex min-h-13 grow flex-wrap items-center justify-between gap-2 rounded-b-md border-t border-line bg-surface px-4 py-3">
        <code className="text-sm">{logo.name}</code>
        <Downloads file={logo.file} sizes={logo.sizes} />
      </div>
    </article>
  )
}

function AnimatedTile({
  item,
  isWordmark,
}: {
  item: TAnimated
  isWordmark: boolean
}) {
  return (
    <article
      id={item.name}
      className="flex flex-col rounded-md border border-line"
    >
      <div className="flex h-48 items-center justify-center">
        <item.Logo
          continuous
          style={
            isWordmark
              ? {
                  width: (WORDMARK_HEIGHT * 1786) / 444,
                  height: WORDMARK_HEIGHT,
                }
              : { fontSize: SQUARE_SIZE }
          }
        />
      </div>
      <div className="flex min-h-13 grow flex-wrap items-center justify-between gap-2 rounded-b-md border-t border-line bg-surface px-4 py-3">
        <code className="text-sm">{item.name}</code>
      </div>
    </article>
  )
}

function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-18">
      <header className="flex items-start justify-between gap-6">
        <div>
          <h1 className="font-display text-[2.5rem] leading-[1.1] font-semibold tracking-[-0.02em]">
            OiPer Brand
          </h1>
          <p className="mt-4 text-lg text-muted">All logo components.</p>
        </div>
        <a
          className="shrink-0 rounded-md bg-foreground px-3.5 py-2 text-sm font-semibold text-background hover:bg-white"
          href="/oiper-brand-kit.zip"
          download
        >
          Download brand kit
        </a>
      </header>

      <section className="mt-18 grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4">
        {SQUARE_LOGOS.map((logo) => (
          <LogoTile key={logo.name} logo={logo} isWordmark={false} />
        ))}
        {ANIMATED.map((item) => (
          <AnimatedTile key={item.name} item={item} isWordmark={false} />
        ))}
        {CANVAS_ANIMATED.map((item) => (
          <AnimatedTile key={item.name} item={item} isWordmark={false} />
        ))}
      </section>

      <section className="mt-18 grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4">
        {WORDMARK_LOGOS.map((logo) => (
          <LogoTile key={logo.name} logo={logo} isWordmark />
        ))}
        {ANIMATED_WORDMARKS.map((item) => (
          <AnimatedTile key={item.name} item={item} isWordmark />
        ))}
        {CANVAS_ANIMATED_WORDMARKS.map((item) => (
          <AnimatedTile key={item.name} item={item} isWordmark />
        ))}
      </section>
    </div>
  )
}
