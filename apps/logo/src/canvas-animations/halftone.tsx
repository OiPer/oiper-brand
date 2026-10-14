import { ComponentProps, useEffect, useRef } from 'react'

const LOGO_PATH =
  'M444 222C444 163.122 420.611 106.655 378.978 65.0223C337.345 23.3892 280.878 0 222 0C163.122 0 106.655 23.3892 65.0223 65.0223C23.3892 106.655 0 163.122 0 222C0 280.878 23.3892 337.345 65.0223 378.978C106.655 420.611 163.122 444 222 444C280.878 444 337.345 420.611 378.978 378.978C420.611 337.345 444 280.878 444 222ZM298.96 222C298.96 203.342 295.285 184.866 288.145 167.628C281.005 150.39 270.539 134.728 257.346 121.534C244.152 108.341 228.49 97.8754 211.252 90.7352C194.014 83.595 175.538 79.92 156.88 79.92C138.222 79.92 119.746 83.595 102.508 90.7352C85.2704 97.8754 69.6076 108.341 56.4143 121.534C43.2209 134.728 32.7554 150.39 25.6152 167.628C18.475 184.866 14.8 203.342 14.8 222C14.8 240.658 18.475 259.134 25.6152 276.372C32.7554 293.61 43.2209 309.272 56.4143 322.466C69.6076 335.659 85.2704 346.125 102.508 353.265C119.746 360.405 138.222 364.08 156.88 364.08C175.538 364.08 194.014 360.405 211.252 353.265C228.49 346.125 244.152 335.659 257.346 322.466C270.539 309.272 281.005 293.61 288.145 276.372C295.285 259.134 298.96 240.658 298.96 222Z'

const DURATION = 2400

function wave(x: number, y: number, t: number) {
  return (
    (Math.sin(x * 0.034 + y * 0.016 - t * 2.1) +
      Math.sin(x * -0.018 + y * 0.03 - t * 1.6 + 1.3) +
      Math.sin(x * 0.027 - y * 0.023 + t * 1.3 + 2.4)) /
    2.2
  )
}

export function OiPerLogoHalftone({
  brandColor,
  continuous,
  style,
  ...props
}: ComponentProps<'canvas'> & { brandColor?: string; continuous?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const color = brandColor ?? 'white'

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const logo = new Path2D(LOGO_PATH)
    const start = performance.now()
    let frame = 0
    let done = false

    function draw(now: number) {
      if (!canvas || !ctx) return
      const elapsed = now - start
      const t = elapsed / 1000
      const progress = continuous ? 0 : Math.min(elapsed / DURATION, 1)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.setTransform(canvas.width / 444, 0, 0, canvas.height / 444, 0, 0)
      ctx.fillStyle = color
      if (!continuous && progress >= 1) {
        ctx.fill(logo, 'evenodd')
        done = true
        return
      }
      const columns = Math.min(30, Math.max(9, Math.round(canvas.width / 7)))
      const spacing = 444 / columns
      const rowHeight = (spacing * Math.sqrt(3)) / 2
      const rows = Math.ceil(444 / rowHeight) + 1
      ctx.save()
      ctx.clip(logo, 'evenodd')
      ctx.beginPath()
      for (let row = 0; row <= rows; row++) {
        const y = row * rowHeight
        const offset = row % 2 === 0 ? 0 : spacing / 2
        for (let column = -1; column <= columns; column++) {
          const x = column * spacing + offset
          const w = wave(x, y, t)
          const level = continuous
            ? 0.62 + 0.42 * w
            : Math.min(
                1.05,
                progress * 2.8 - 0.5 - ((x + 444 - y) / 888) * 0.6 + w * 0.4
              )
          if (level <= 0.02) continue
          const radius = level * spacing * 0.6
          ctx.moveTo(x + radius, y)
          ctx.arc(x, y, radius, 0, Math.PI * 2)
        }
      }
      ctx.fill()
      ctx.restore()
    }

    function tick(now: number) {
      draw(now)
      if (!done) frame = requestAnimationFrame(tick)
    }

    const observer = new ResizeObserver(() => {
      const ratio = window.devicePixelRatio || 1
      canvas.width = Math.round(canvas.clientWidth * ratio)
      canvas.height = Math.round(canvas.clientHeight * ratio)
      draw(performance.now())
    })
    observer.observe(canvas)
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [color, continuous])

  return (
    <canvas
      ref={ref}
      style={{ width: '1em', height: '1em', display: 'block', ...style }}
      {...props}
    />
  )
}
