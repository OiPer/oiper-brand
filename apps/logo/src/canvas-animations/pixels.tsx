import { ComponentProps, useEffect, useRef } from 'react'

const LOGO_PATH =
  'M444 222C444 163.122 420.611 106.655 378.978 65.0223C337.345 23.3892 280.878 0 222 0C163.122 0 106.655 23.3892 65.0223 65.0223C23.3892 106.655 0 163.122 0 222C0 280.878 23.3892 337.345 65.0223 378.978C106.655 420.611 163.122 444 222 444C280.878 444 337.345 420.611 378.978 378.978C420.611 337.345 444 280.878 444 222ZM298.96 222C298.96 203.342 295.285 184.866 288.145 167.628C281.005 150.39 270.539 134.728 257.346 121.534C244.152 108.341 228.49 97.8754 211.252 90.7352C194.014 83.595 175.538 79.92 156.88 79.92C138.222 79.92 119.746 83.595 102.508 90.7352C85.2704 97.8754 69.6076 108.341 56.4143 121.534C43.2209 134.728 32.7554 150.39 25.6152 167.628C18.475 184.866 14.8 203.342 14.8 222C14.8 240.658 18.475 259.134 25.6152 276.372C32.7554 293.61 43.2209 309.272 56.4143 322.466C69.6076 335.659 85.2704 346.125 102.508 353.265C119.746 360.405 138.222 364.08 156.88 364.08C175.538 364.08 194.014 360.405 211.252 353.265C228.49 346.125 244.152 335.659 257.346 322.466C270.539 309.272 281.005 293.61 288.145 276.372C295.285 259.134 298.96 240.658 298.96 222Z'

const SIZE = 444
const GRIDS = [4, 8, 16, 32, 64]
const SAMPLES = 3
const DURATION = 2.2
const DISSOLVE = 0.65
const LOOP = 2.6
const BAND = 0.32
const FLICKER = 0.1
const FLICKER_RATE = 24

function hash(x: number, y: number, z: number) {
  let value = Math.imul(x, 374761393) + Math.imul(y, 668265263)
  value = (value + Math.imul(z, 2246822519)) | 0
  value = Math.imul(value ^ (value >>> 13), 1274126177)
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296
}

function bayer(x: number, y: number, grid: number) {
  const bits = Math.min(3, Math.log2(grid))
  let value = 0
  for (let bit = 0; bit < bits; bit++) {
    const xBit = (x >> bit) & 1
    const yBit = (y >> bit) & 1
    value += (((xBit ^ yBit) << 1) | yBit) * 4 ** (bits - 1 - bit)
  }
  return (value + 0.5) / 4 ** bits
}

function createMasks(context: CanvasRenderingContext2D, path: Path2D) {
  context.setTransform(1, 0, 0, 1, 0, 0)
  return GRIDS.map((grid) => {
    const cell = SIZE / grid
    const mask = new Uint8Array(grid * grid)
    for (let row = 0; row < grid; row++) {
      for (let column = 0; column < grid; column++) {
        let hits = 0
        for (let sy = 0; sy < SAMPLES; sy++) {
          for (let sx = 0; sx < SAMPLES; sx++) {
            const x = (column + (sx + 0.5) / SAMPLES) * cell
            const y = (row + (sy + 0.5) / SAMPLES) * cell
            if (context.isPointInPath(path, x, y, 'evenodd')) hits++
          }
        }
        mask[row * grid + column] = hits * 2 >= SAMPLES * SAMPLES ? 1 : 0
      }
    }
    return mask
  })
}

function easeInOut(value: number) {
  return value * value * (3 - 2 * value)
}

export function OiPerLogoPixels({
  brandColor,
  continuous,
  style,
  ...props
}: ComponentProps<'canvas'> & { brandColor?: string; continuous?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const element = canvasRef.current
    if (!element) return
    const canvas: HTMLCanvasElement = element
    const renderingContext = canvas.getContext('2d')
    if (!renderingContext) throw new Error('Canvas 2D context is not available')
    const context: CanvasRenderingContext2D = renderingContext
    const path = new Path2D(LOGO_PATH)
    const masks = createMasks(context, path)
    const color = brandColor ?? 'white'
    const start = performance.now()
    let time = 0
    let frame = 0

    function passes(
      value: number,
      column: number,
      row: number,
      level: number,
      step: number
    ) {
      const threshold = bayer(column, row, GRIDS[level])
      if (value > 0 && value < 1 && Math.abs(threshold - value) < FLICKER) {
        return hash(column, row, step + level * 977) < 0.5
      }
      return threshold < value
    }

    function draw() {
      const width = canvas.width
      const height = canvas.height
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.clearRect(0, 0, width, height)
      context.fillStyle = color
      const finished = !continuous && time >= DURATION
      if (finished) {
        context.setTransform(width / SIZE, 0, 0, height / SIZE, 0, 0)
        context.fill(path, 'evenodd')
        return
      }
      const levels = Math.max(
        2,
        GRIDS.filter((grid) => grid <= Math.min(width, height) / 2).length
      )
      const step = Math.floor(time * FLICKER_RATE)
      const stage = DURATION / (levels + 1)
      const stageIndex = Math.floor(time / stage)
      const globalProgress =
        stageIndex -
        1 +
        easeInOut(Math.min(1, (time - stageIndex * stage) / (stage * DISSOLVE)))
      const sweep = ((time % LOOP) / LOOP) * 1.5 - 0.25
      const pixels = new Path2D()
      const solid = new Path2D()

      function progressAt(column: number, row: number, grid: number) {
        if (!continuous) return globalProgress
        const position = (column + row + 1) / (2 * grid)
        const depth = Math.max(0, 1 - Math.abs(position - sweep) / BAND)
        return 1 + (levels - 1) * (1 - easeInOut(depth))
      }

      function visit(level: number, column: number, row: number) {
        const grid = GRIDS[level]
        const progress = progressAt(column, row, grid)
        if (level === 0 && !passes(progress + 1, column, row, 0, step)) return
        const left = Math.round((column * width) / grid)
        const top = Math.round((row * height) / grid)
        const right = Math.round(((column + 1) * width) / grid)
        const bottom = Math.round(((row + 1) * height) / grid)
        if (passes(progress - level, column, row, level, step + 1)) {
          if (level === levels - 1) {
            solid.rect(left, top, right - left, bottom - top)
            return
          }
          visit(level + 1, column * 2, row * 2)
          visit(level + 1, column * 2 + 1, row * 2)
          visit(level + 1, column * 2, row * 2 + 1)
          visit(level + 1, column * 2 + 1, row * 2 + 1)
          return
        }
        if (masks[level][row * grid + column]) {
          pixels.rect(left, top, right - left, bottom - top)
        }
      }

      for (let row = 0; row < GRIDS[0]; row++) {
        for (let column = 0; column < GRIDS[0]; column++) {
          visit(0, column, row)
        }
      }
      context.fill(pixels)
      context.save()
      context.setTransform(width / SIZE, 0, 0, height / SIZE, 0, 0)
      context.clip(path, 'evenodd')
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.fill(solid)
      context.restore()
    }

    function tick(now: number) {
      time = (now - start) / 1000
      draw()
      if (continuous || time < DURATION) frame = requestAnimationFrame(tick)
    }

    const observer = new ResizeObserver(() => {
      canvas.width = Math.round(canvas.clientWidth * devicePixelRatio)
      canvas.height = Math.round(canvas.clientHeight * devicePixelRatio)
      draw()
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
