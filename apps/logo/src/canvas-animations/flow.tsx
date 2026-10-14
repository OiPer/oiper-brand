import { ComponentProps, useEffect, useRef } from 'react'

const LOGO_PATH =
  'M444 222C444 163.122 420.611 106.655 378.978 65.0223C337.345 23.3892 280.878 0 222 0C163.122 0 106.655 23.3892 65.0223 65.0223C23.3892 106.655 0 163.122 0 222C0 280.878 23.3892 337.345 65.0223 378.978C106.655 420.611 163.122 444 222 444C280.878 444 337.345 420.611 378.978 378.978C420.611 337.345 444 280.878 444 222ZM298.96 222C298.96 203.342 295.285 184.866 288.145 167.628C281.005 150.39 270.539 134.728 257.346 121.534C244.152 108.341 228.49 97.8754 211.252 90.7352C194.014 83.595 175.538 79.92 156.88 79.92C138.222 79.92 119.746 83.595 102.508 90.7352C85.2704 97.8754 69.6076 108.341 56.4143 121.534C43.2209 134.728 32.7554 150.39 25.6152 167.628C18.475 184.866 14.8 203.342 14.8 222C14.8 240.658 18.475 259.134 25.6152 276.372C32.7554 293.61 43.2209 309.272 56.4143 322.466C69.6076 335.659 85.2704 346.125 102.508 353.265C119.746 360.405 138.222 364.08 156.88 364.08C175.538 364.08 194.014 360.405 211.252 353.265C228.49 346.125 244.152 335.659 257.346 322.466C270.539 309.272 281.005 293.61 288.145 276.372C295.285 259.134 298.96 240.658 298.96 222Z'

const STEP = 1 / 60
const DURATION = 2.4
const TRAIL = 40
const LEVELS = 6

const WAVES = [
  [0.017, 0.011, 0.6, 0, 70],
  [-0.008, 0.023, -0.45, 2.1, 55],
  [0.029, -0.024, 0.8, 4.2, 35],
]

type Particle = {
  x: number
  y: number
  age: number
  life: number
  trail: number[]
}

function createRandom(seed: number) {
  let state = seed
  return function random() {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function advance(particle: Particle, time: number) {
  let vx = 0
  let vy = 0
  for (const [kx, ky, speed, phase, amplitude] of WAVES) {
    const c =
      (amplitude *
        Math.cos(kx * particle.x + ky * particle.y + speed * time + phase)) /
      Math.hypot(kx, ky)
    vx += c * ky
    vy -= c * kx
  }
  const ix = particle.x - 156.88
  const ox = particle.x - 222
  const dy = particle.y - 222
  const inner = Math.hypot(ix, dy) + 0.001
  const outer = Math.hypot(ox, dy) + 0.001
  const a = inner - 142.08
  const b = 222 - outer
  const gx = (b * ix) / inner + (a * ox) / outer
  const gy = (b * dy) / inner + (a * dy) / outer
  const g = Math.hypot(gx, gy) + 0.001
  const edge = Math.max(0, (4 * a * b) / (a + b) ** 2)
  vx = vx * edge - (gy / g) * 60
  vy = vy * edge + (gx / g) * 60
  particle.x += vx * STEP
  particle.y += vy * STEP
}

function smoothstep(value: number) {
  const t = Math.min(Math.max(value, 0), 1)
  return t * t * (3 - 2 * t)
}

export function OiPerLogoFlow({
  brandColor,
  continuous,
  style,
  ...props
}: ComponentProps<'canvas'> & { brandColor?: string; continuous?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const color = brandColor ?? 'white'

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) {
      return
    }
    const logo = new Path2D(LOGO_PATH)
    const random = createRandom(20240611)
    const particles: Particle[] = []
    let simTime = 0
    let solid = 0
    let done = false
    let frame = 0
    const start = performance.now()

    function place(particle: Particle) {
      do {
        particle.x = random() * 444
        particle.y = random() * 444
      } while (!ctx!.isPointInPath(logo, particle.x, particle.y, 'evenodd'))
      particle.age = 0
      particle.life = 1.5 + random() * 3
      particle.trail = [particle.x, particle.y]
    }

    for (let i = 0; i < (continuous ? 1100 : 900); i++) {
      const particle: Particle = { x: 0, y: 0, age: 0, life: 0, trail: [] }
      place(particle)
      particle.age = continuous ? 0 : -random() * 0.5
      particles.push(particle)
    }

    function begin() {
      const scale = canvas!.width / 444
      ctx!.save()
      ctx!.setTransform(scale, 0, 0, scale, 0, 0)
      ctx!.clip(logo, 'evenodd')
      ctx!.strokeStyle = color
      ctx!.fillStyle = color
      ctx!.lineCap = 'round'
      ctx!.lineWidth = Math.max(1.5, 0.6 / scale)
    }

    function drawFinal() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      begin()
      ctx!.fill(logo, 'evenodd')
      ctx!.restore()
    }

    function drawOnce(time: number) {
      const ink = new Path2D()
      while (simTime + STEP <= time) {
        simTime += STEP
        for (const particle of particles) {
          particle.age += STEP
          if (particle.age <= 0) {
            continue
          }
          const x = particle.x
          const y = particle.y
          advance(particle, simTime)
          if (ctx!.isPointInPath(logo, particle.x, particle.y, 'evenodd')) {
            ink.moveTo(x, y)
            ink.lineTo(particle.x, particle.y)
          } else {
            place(particle)
          }
        }
      }
      begin()
      ctx!.globalAlpha = 0.3
      ctx!.stroke(ink)
      const target = smoothstep((time - 1.3) / (DURATION - 1.3))
      if (target > solid) {
        ctx!.globalAlpha = (target - solid) / (1 - solid)
        ctx!.fill(logo, 'evenodd')
        solid = target
      }
      ctx!.restore()
    }

    function drawContinuous(time: number) {
      simTime = Math.max(simTime, time - 0.25)
      while (simTime + STEP <= time) {
        simTime += STEP
        for (const particle of particles) {
          particle.age += STEP
          if (particle.age > particle.life) {
            place(particle)
            continue
          }
          advance(particle, simTime)
          if (!ctx!.isPointInPath(logo, particle.x, particle.y, 'evenodd')) {
            particle.life = Math.min(particle.life, particle.age + 0.3)
          }
          particle.trail.push(particle.x, particle.y)
          if (particle.trail.length > TRAIL * 2) {
            particle.trail.splice(0, 2)
          }
        }
      }
      const paths = Array.from({ length: LEVELS }, () => new Path2D())
      for (const particle of particles) {
        const fade = Math.min(
          1,
          particle.age / 0.5,
          (particle.life - particle.age) / 0.3
        )
        const trail = particle.trail
        const count = trail.length / 2
        for (let j = 1; j < count; j++) {
          const alpha = fade * (1 - (count - 1 - j) / TRAIL)
          const level = Math.ceil(alpha * LEVELS) - 1
          if (level < 0) {
            continue
          }
          paths[level].moveTo(trail[j * 2 - 2], trail[j * 2 - 1])
          paths[level].lineTo(trail[j * 2], trail[j * 2 + 1])
        }
      }
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      begin()
      paths.forEach((path, level) => {
        ctx!.globalAlpha = ((level + 1) / LEVELS) * 0.7
        ctx!.stroke(path)
      })
      ctx!.restore()
    }

    function tick(now: number) {
      const time = (now - start) / 1000
      if (continuous) {
        drawContinuous(time)
      } else if (time >= DURATION) {
        done = true
        drawFinal()
        return
      } else {
        drawOnce(time)
      }
      frame = requestAnimationFrame(tick)
    }

    const observer = new ResizeObserver(() => {
      const ratio = window.devicePixelRatio
      canvas.width = Math.round(canvas.clientWidth * ratio)
      canvas.height = Math.round(canvas.clientHeight * ratio)
      if (done) {
        drawFinal()
      }
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
