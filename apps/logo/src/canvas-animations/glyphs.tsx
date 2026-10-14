import { ComponentProps, useEffect, useRef } from 'react'

const LOGO_PATH =
  'M444 222C444 163.122 420.611 106.655 378.978 65.0223C337.345 23.3892 280.878 0 222 0C163.122 0 106.655 23.3892 65.0223 65.0223C23.3892 106.655 0 163.122 0 222C0 280.878 23.3892 337.345 65.0223 378.978C106.655 420.611 163.122 444 222 444C280.878 444 337.345 420.611 378.978 378.978C420.611 337.345 444 280.878 444 222ZM298.96 222C298.96 203.342 295.285 184.866 288.145 167.628C281.005 150.39 270.539 134.728 257.346 121.534C244.152 108.341 228.49 97.8754 211.252 90.7352C194.014 83.595 175.538 79.92 156.88 79.92C138.222 79.92 119.746 83.595 102.508 90.7352C85.2704 97.8754 69.6076 108.341 56.4143 121.534C43.2209 134.728 32.7554 150.39 25.6152 167.628C18.475 184.866 14.8 203.342 14.8 222C14.8 240.658 18.475 259.134 25.6152 276.372C32.7554 293.61 43.2209 309.272 56.4143 322.466C69.6076 335.659 85.2704 346.125 102.508 353.265C119.746 360.405 138.222 364.08 156.88 364.08C175.538 364.08 194.014 360.405 211.252 353.265C228.49 346.125 244.152 335.659 257.346 322.466C270.539 309.272 281.005 293.61 288.145 276.372C295.285 259.134 298.96 240.658 298.96 222Z'
const GLYPHS = '01/\\+*<>#=OiPer'
const WORD = 'OiPer'
const DURATION = 2.25
const PERIOD = 2.6

function hash(a: number, b: number) {
  let h =
    Math.imul(a ^ 0x9e3779b9, 0x85ebca6b) ^
    Math.imul(b + 0x632be5ab, 0xc2b2ae35)
  h ^= h >>> 15
  h = Math.imul(h, 0x2c1b3c6d)
  h ^= h >>> 12
  return (h >>> 0) / 4294967296
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

export function OiPerLogoGlyphs({
  brandColor,
  continuous,
  style,
  ...props
}: ComponentProps<'canvas'> & { brandColor?: string; continuous?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const context = ctx
    const path = new Path2D(LOGO_PATH)
    const color = brandColor ?? 'white'
    let cells: { x: number; y: number; i: number; offset: number }[] = []
    let size = 0
    let frame = 0
    let done = false
    const start = performance.now()

    function layout() {
      const count = Math.min(
        16,
        Math.max(5, Math.round(canvas!.clientWidth / 8))
      )
      size = 444 / count
      cells = []
      context.setTransform(1, 0, 0, 1, 0, 0)
      for (let row = 0; row < count; row++) {
        for (let col = 0; col < count; col++) {
          let inside = false
          for (let sy = 0; sy <= 4 && !inside; sy++) {
            for (let sx = 0; sx <= 4 && !inside; sx++) {
              inside = context.isPointInPath(
                path,
                (col + sx / 4) * size,
                (row + sy / 4) * size,
                'evenodd'
              )
            }
          }
          if (!inside) continue
          const i = row * count + col
          const x = (col + 0.5) * size
          const y = (row + 0.5) * size
          cells.push({
            x,
            y,
            i,
            offset: clamp01(((x + y) / 888) * 0.85 + hash(i, 1) * 0.15),
          })
        }
      }
    }

    function glyph(char: string, x: number, y: number, alpha: number) {
      context.globalAlpha = alpha
      context.fillText(char, x, y)
    }

    function block(
      char: string,
      x: number,
      y: number,
      fill: number,
      cut: number,
      scale: number
    ) {
      if (fill <= 0) return
      const half = (size * scale) / 2
      context.save()
      context.beginPath()
      context.rect(x - half, y - half, half * 2, half * 2)
      context.clip()
      context.globalAlpha = fill
      context.fillRect(x - half, y - half, half * 2, half * 2)
      context.globalCompositeOperation = 'destination-out'
      glyph(char, x, y, cut)
      context.restore()
    }

    function cycling(i: number, t: number) {
      const step = Math.floor(t * 14 + hash(i, 2) * 14)
      return {
        char: GLYPHS[Math.floor(hash(i, step) * GLYPHS.length)],
        alpha: 0.3 + hash(i, step + 7) * 0.45,
      }
    }

    function draw(t: number) {
      context.setTransform(
        canvas!.width / 444,
        0,
        0,
        canvas!.height / 444,
        0,
        0
      )
      context.clearRect(0, 0, 444, 444)
      context.fillStyle = color
      if (!continuous && t >= DURATION) {
        context.globalAlpha = 1
        context.fill(path, 'evenodd')
        return
      }
      context.save()
      context.clip(path, 'evenodd')
      context.font = `bold ${size * 0.9}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      for (const { x, y, i, offset } of cells) {
        if (continuous) {
          const wave = t / PERIOD - offset
          const loop = Math.floor(wave)
          const phase = wave - loop
          if (phase < 0.4) {
            const char = WORD[(i + loop) % WORD.length]
            glyph(char, x, y, 1 - (phase / 0.4) * 0.35)
            const flash = 1 - phase / 0.1
            block(char, x, y, flash, flash, 1)
          } else {
            const { char, alpha } = cycling(i, t)
            glyph(char, x, y, alpha * clamp01(t / 0.4))
          }
          continue
        }
        const appear = offset * 0.5
        const lock = 0.5 + offset * 1.1
        if (t < appear) continue
        if (t < lock) {
          const { char, alpha } = cycling(i, t)
          glyph(char, x, y, alpha * clamp01((t - appear) / 0.15))
          continue
        }
        const char = WORD[i % WORD.length]
        const grow = clamp01((t - lock - 0.25) / 0.35)
        glyph(char, x, y, 1)
        if (grow > 0) {
          block(char, x, y, 1, 1 - grow, (1 - (1 - grow) ** 3) * 1.04)
        } else {
          const flash = 1 - (t - lock) / 0.12
          block(char, x, y, flash, flash, 1)
        }
      }
      context.restore()
    }

    function resize() {
      canvas!.width = Math.round(canvas!.clientWidth * devicePixelRatio)
      canvas!.height = Math.round(canvas!.clientHeight * devicePixelRatio)
      layout()
      if (done) draw(DURATION)
    }

    function tick(now: number) {
      const t = (now - start) / 1000
      if (!continuous && t >= DURATION) {
        done = true
        draw(DURATION)
        return
      }
      draw(t)
      frame = requestAnimationFrame(tick)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [brandColor, continuous])

  return (
    <canvas
      ref={ref}
      style={{ width: '1em', height: '1em', display: 'block', ...style }}
      {...props}
    />
  )
}
