import { ComponentProps, useEffect, useRef } from 'react'

const LOGO_PATH =
  'M444 222C444 163.122 420.611 106.655 378.978 65.0223C337.345 23.3892 280.878 0 222 0C163.122 0 106.655 23.3892 65.0223 65.0223C23.3892 106.655 0 163.122 0 222C0 280.878 23.3892 337.345 65.0223 378.978C106.655 420.611 163.122 444 222 444C280.878 444 337.345 420.611 378.978 378.978C420.611 337.345 444 280.878 444 222ZM298.96 222C298.96 203.342 295.285 184.866 288.145 167.628C281.005 150.39 270.539 134.728 257.346 121.534C244.152 108.341 228.49 97.8754 211.252 90.7352C194.014 83.595 175.538 79.92 156.88 79.92C138.222 79.92 119.746 83.595 102.508 90.7352C85.2704 97.8754 69.6076 108.341 56.4143 121.534C43.2209 134.728 32.7554 150.39 25.6152 167.628C18.475 184.866 14.8 203.342 14.8 222C14.8 240.658 18.475 259.134 25.6152 276.372C32.7554 293.61 43.2209 309.272 56.4143 322.466C69.6076 335.659 85.2704 346.125 102.508 353.265C119.746 360.405 138.222 364.08 156.88 364.08C175.538 364.08 194.014 360.405 211.252 353.265C228.49 346.125 244.152 335.659 257.346 322.466C270.539 309.272 281.005 293.61 288.145 276.372C295.285 259.134 298.96 240.658 298.96 222Z'

const SIZE = 444
const GRID = 11
const RADIUS = 4.2
const STAGGER = 0.55
const FLIGHT = 1.15
const FADE_START = 1.55
const FADE_END = 2.2

type Particle = {
  startX: number
  startY: number
  controlX: number
  controlY: number
  homeX: number
  homeY: number
  delay: number
  angle: number
  phaseX: number
  phaseY: number
  phaseAlpha: number
  speed: number
}

function createRandom(seed: number) {
  let state = seed
  return function random() {
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function easeInOutCubic(value: number) {
  return value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2
}

function smoothstep(from: number, to: number, value: number) {
  const progress = Math.min(Math.max((value - from) / (to - from), 0), 1)
  return progress * progress * (3 - 2 * progress)
}

function createParticles(path: Path2D) {
  const random = createRandom(444)
  const context = document.createElement('canvas').getContext('2d')
  if (!context) throw new Error('Canvas 2D context is not available')
  const particles: Particle[] = []
  for (let y = GRID / 2; y < SIZE; y += GRID) {
    for (let x = GRID / 2; x < SIZE; x += GRID) {
      const homeX = x + (random() - 0.5) * GRID * 0.8
      const homeY = y + (random() - 0.5) * GRID * 0.8
      if (!context.isPointInPath(path, homeX, homeY, 'evenodd')) continue
      const startX = random() * SIZE
      const startY = random() * SIZE
      const bend = (random() - 0.5) * 0.9
      particles.push({
        startX,
        startY,
        controlX: (startX + homeX) / 2 - (homeY - startY) * bend,
        controlY: (startY + homeY) / 2 + (homeX - startX) * bend,
        homeX,
        homeY,
        delay: random() * STAGGER,
        angle: Math.atan2(homeY - SIZE / 2, homeX - SIZE / 2),
        phaseX: random() * Math.PI * 2,
        phaseY: random() * Math.PI * 2,
        phaseAlpha: random() * Math.PI * 2,
        speed: 0.7 + random() * 0.6,
      })
    }
  }
  return particles
}

export function OiPerLogoParticles({
  brandColor,
  continuous,
  style,
  ...props
}: ComponentProps<'canvas'> & { brandColor?: string; continuous?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const path = new Path2D(LOGO_PATH)
    const particles = createParticles(path)
    const color = brandColor ?? 'white'
    const startTime = performance.now()
    let frame = 0

    function draw(now: number) {
      if (!canvas || !context) return
      const time = (now - startTime) / 1000
      const scale = canvas.width / SIZE
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.setTransform(scale, 0, 0, scale, 0, 0)
      context.fillStyle = color

      if (!continuous && time >= FADE_END) {
        context.globalAlpha = 1
        context.fill(path, 'evenodd')
        return
      }

      const fade = continuous ? 0 : smoothstep(FADE_START, FADE_END, time)
      const appear = smoothstep(0, 0.3, time)

      for (const particle of particles) {
        const flight = Math.min(
          Math.max((time - particle.delay) / FLIGHT, 0),
          1
        )
        const progress = easeInOutCubic(flight)
        const inverse = 1 - progress
        let x =
          inverse * inverse * particle.startX +
          2 * inverse * progress * particle.controlX +
          progress * progress * particle.homeX
        let y =
          inverse * inverse * particle.startY +
          2 * inverse * progress * particle.controlY +
          progress * progress * particle.homeY
        let radius = RADIUS
        let alpha = appear
        if (continuous) {
          const settle = smoothstep(
            particle.delay + FLIGHT,
            particle.delay + FLIGHT + 0.8,
            time
          )
          const drift = time * particle.speed
          x += Math.sin(drift * 1.3 + particle.phaseX) * 3.2 * settle
          y += Math.cos(drift * 1.1 + particle.phaseY) * 3.2 * settle
          radius *=
            1 + Math.sin(time * 2.4 - particle.angle * 2) * 0.22 * settle
          alpha *=
            1 -
            (0.5 + 0.5 * Math.sin(drift * 3 + particle.phaseAlpha)) *
              0.45 *
              settle
        }
        context.globalAlpha = alpha * (1 - fade)
        context.beginPath()
        context.arc(x, y, radius, 0, Math.PI * 2)
        context.fill()
      }

      if (fade > 0) {
        context.globalAlpha = fade
        context.fill(path, 'evenodd')
      }
    }

    function tick(now: number) {
      draw(now)
      if (continuous || (now - startTime) / 1000 < FADE_END) {
        frame = requestAnimationFrame(tick)
      }
    }

    const observer = new ResizeObserver(() => {
      if (!canvas) return
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
  }, [brandColor, continuous])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '1em', height: '1em', display: 'block', ...style }}
      {...props}
    />
  )
}
