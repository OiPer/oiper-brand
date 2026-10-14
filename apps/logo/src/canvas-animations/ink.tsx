import { ComponentProps, useEffect, useRef } from 'react'

const LOGO_PATH =
  'M444 222C444 163.122 420.611 106.655 378.978 65.0223C337.345 23.3892 280.878 0 222 0C163.122 0 106.655 23.3892 65.0223 65.0223C23.3892 106.655 0 163.122 0 222C0 280.878 23.3892 337.345 65.0223 378.978C106.655 420.611 163.122 444 222 444C280.878 444 337.345 420.611 378.978 378.978C420.611 337.345 444 280.878 444 222ZM298.96 222C298.96 203.342 295.285 184.866 288.145 167.628C281.005 150.39 270.539 134.728 257.346 121.534C244.152 108.341 228.49 97.8754 211.252 90.7352C194.014 83.595 175.538 79.92 156.88 79.92C138.222 79.92 119.746 83.595 102.508 90.7352C85.2704 97.8754 69.6076 108.341 56.4143 121.534C43.2209 134.728 32.7554 150.39 25.6152 167.628C18.475 184.866 14.8 203.342 14.8 222C14.8 240.658 18.475 259.134 25.6152 276.372C32.7554 293.61 43.2209 309.272 56.4143 322.466C69.6076 335.659 85.2704 346.125 102.508 353.265C119.746 360.405 138.222 364.08 156.88 364.08C175.538 364.08 194.014 360.405 211.252 353.265C228.49 346.125 244.152 335.659 257.346 322.466C270.539 309.272 281.005 293.61 288.145 276.372C295.285 259.134 298.96 240.658 298.96 222Z'

const DURATION = 2600
const FILL_END = 2100
const PERIOD = 4200
const WAVE_COUNT = 7
const DROPS = [
  { x: 380, y: 150, delay: 0, seed: 1 },
  { x: 250, y: 400, delay: 200, seed: 2 },
  { x: 120, y: 40, delay: 380, seed: 3 },
  { x: 30, y: 300, delay: 540, seed: 4 },
  { x: 360, y: 330, delay: 680, seed: 5 },
]

function createRandom(seed: number) {
  let state = seed >>> 0
  return function random() {
    state = (state + 0x6d2b79f5) >>> 0
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3)
}

function traceBlot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  seed: number,
  time: number
) {
  const random = createRandom(seed)
  const waves = [2, 3, 5, 7, 11].map((frequency, index) => ({
    frequency,
    amplitude: (0.16 / (index + 1)) * (0.6 + random() * 0.8),
    phase: random() * Math.PI * 2,
    speed: (random() - 0.5) * 1.6,
  }))
  const steps = 56
  const points: [number, number][] = []
  for (let step = 0; step < steps; step++) {
    const angle = (step / steps) * Math.PI * 2
    let offset = 1
    for (const wave of waves) {
      offset +=
        wave.amplitude *
        Math.sin(wave.frequency * angle + wave.phase + wave.speed * time)
    }
    points.push([
      x + Math.cos(angle) * radius * offset,
      y + Math.sin(angle) * radius * offset,
    ])
  }
  ctx.beginPath()
  const last = points[steps - 1]
  ctx.moveTo((last[0] + points[0][0]) / 2, (last[1] + points[0][1]) / 2)
  for (let step = 0; step < steps; step++) {
    const current = points[step]
    const next = points[(step + 1) % steps]
    ctx.quadraticCurveTo(
      current[0],
      current[1],
      (current[0] + next[0]) / 2,
      (current[1] + next[1]) / 2
    )
  }
  ctx.closePath()
}

function drawBlot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  seed: number,
  time: number,
  alpha: number
) {
  const layers = [
    { scale: 1, opacity: 0.32 },
    { scale: 0.82, opacity: 0.3 },
    { scale: 0.58, opacity: 0.38 },
  ]
  for (let index = 0; index < layers.length; index++) {
    const layer = layers[index]
    traceBlot(ctx, x, y, radius * layer.scale, seed * 31 + index, time)
    ctx.globalAlpha = alpha * layer.opacity
    ctx.fill()
  }
}

export function OiPerLogoInk({
  brandColor,
  continuous,
  style,
  ...props
}: ComponentProps<'canvas'> & { brandColor?: string; continuous?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }
    const color = brandColor ?? 'white'
    const logo = new Path2D(LOGO_PATH)
    const random = createRandom(7)
    const spots: [number, number][] = []
    while (spots.length < 48) {
      const x = random() * 444
      const y = random() * 444
      if (ctx.isPointInPath(logo, x, y, 'evenodd')) {
        spots.push([x, y])
      }
    }
    const start = performance.now()
    let frame = 0
    let finished = false

    function drawOnce(elapsed: number) {
      if (!ctx) {
        return
      }
      const time = elapsed / 1000
      for (const drop of DROPS) {
        const progress = Math.min(
          Math.max((elapsed - drop.delay) / (FILL_END - drop.delay), 0),
          1
        )
        if (progress <= 0) {
          continue
        }
        const radius = 340 * (1 - Math.pow(1 - progress, 2))
        drawBlot(
          ctx,
          drop.x,
          drop.y,
          radius,
          drop.seed,
          time,
          Math.min(progress * 4, 1)
        )
      }
      const solid = Math.min(
        Math.max((elapsed - FILL_END * 0.75) / (DURATION - FILL_END * 0.75), 0),
        1
      )
      ctx.globalAlpha = solid * solid * (3 - 2 * solid)
      ctx.fill(logo, 'evenodd')
    }

    function drawContinuous(elapsed: number) {
      if (!ctx) {
        return
      }
      const time = elapsed / 1000
      ctx.globalAlpha = 0.22
      ctx.fill(logo, 'evenodd')
      for (let index = 0; index < WAVE_COUNT; index++) {
        const local = elapsed / PERIOD + index / WAVE_COUNT
        const cycle = Math.floor(local)
        const progress = local - cycle
        const seed = index * 977 + cycle * 131
        const spot = spots[Math.floor(createRandom(seed)() * spots.length)]
        const radius = 230 * easeOutCubic(progress)
        const alpha =
          Math.min(progress * 6, 1) * Math.pow(1 - progress, 1.4) * 1.5
        drawBlot(ctx, spot[0], spot[1], radius, seed, time, alpha)
      }
    }

    function draw(now: number) {
      if (!canvas || !ctx) {
        return
      }
      const elapsed = now - start
      const scale = canvas.width / 444
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (canvas.width === 0) {
        return
      }
      ctx.setTransform(scale, 0, 0, canvas.height / 444, 0, 0)
      ctx.save()
      ctx.clip(logo, 'evenodd')
      ctx.fillStyle = color
      if (continuous) {
        drawContinuous(elapsed)
      }
      if (!continuous && elapsed < DURATION) {
        drawOnce(elapsed)
      }
      if (!continuous && elapsed >= DURATION) {
        ctx.globalAlpha = 1
        ctx.fill(logo, 'evenodd')
        finished = true
      }
      ctx.restore()
    }

    function tick(now: number) {
      draw(now)
      if (!finished) {
        frame = requestAnimationFrame(tick)
      }
    }

    const observer = new ResizeObserver(() => {
      canvas.width = Math.round(canvas.clientWidth * devicePixelRatio)
      canvas.height = Math.round(canvas.clientHeight * devicePixelRatio)
      draw(performance.now())
    })
    observer.observe(canvas)
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [brandColor, continuous])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '1em', height: '1em', display: 'block', ...style }}
      {...props}
    />
  )
}
