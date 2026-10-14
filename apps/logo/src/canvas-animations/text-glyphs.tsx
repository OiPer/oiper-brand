import { ComponentProps, useEffect, useRef } from 'react'

const RING =
  'M444 222C444 163.122 420.611 106.655 378.978 65.0223C337.345 23.3892 280.878 0 222 0C163.122 0 106.655 23.3892 65.0223 65.0223C23.3892 106.655 0 163.122 0 222C0 280.878 23.3892 337.345 65.0223 378.978C106.655 420.611 163.122 444 222 444C280.878 444 337.345 420.611 378.978 378.978C420.611 337.345 444 280.878 444 222ZM298.96 222C298.96 203.342 295.285 184.866 288.145 167.628C281.005 150.39 270.539 134.728 257.346 121.534C244.152 108.341 228.49 97.8754 211.252 90.7352C194.014 83.595 175.538 79.92 156.88 79.92C138.222 79.92 119.746 83.595 102.508 90.7352C85.2704 97.8754 69.6076 108.341 56.4143 121.534C43.2209 134.728 32.7554 150.39 25.6152 167.628C18.475 184.866 14.8 203.342 14.8 222C14.8 240.658 18.475 259.134 25.6152 276.372C32.7554 293.61 43.2209 309.272 56.4143 322.466C69.6076 335.659 85.2704 346.125 102.508 353.265C119.746 360.405 138.222 364.08 156.88 364.08C175.538 364.08 194.014 360.405 211.252 353.265C228.49 346.125 244.152 335.659 257.346 322.466C270.539 309.272 281.005 293.61 288.145 276.372C295.285 259.134 298.96 240.658 298.96 222Z'
const LETTERS = [
  'M679.419 398.818C654.815 398.818 633.25 393.463 614.724 382.754C596.488 371.755 582.304 356.27 572.173 336.298C562.042 316.037 556.976 292.592 556.976 265.964C556.976 227.468 564.502 193.603 579.554 164.369C594.606 135.136 614.724 112.704 639.907 97.074C665.091 81.1547 692.59 73.195 722.405 73.195C736.878 73.195 747.588 75.3658 754.535 79.7075C761.482 83.7596 764.956 90.2721 764.956 99.2448C764.956 102.429 764.666 105.323 764.087 107.928C763.508 110.244 762.64 112.849 761.482 115.743C757.719 114.875 753.377 114.151 748.456 113.572C743.535 112.704 739.338 112.27 735.865 112.27C712.997 112.27 692.156 118.637 673.341 131.373C654.815 144.108 640.052 162.054 629.053 185.209C618.342 208.075 612.987 234.414 612.987 264.227C612.987 298.381 619.934 324.286 633.829 341.942C648.012 359.598 667.117 368.426 691.143 368.426C707.063 368.426 723.128 363.216 739.338 352.796C755.838 342.087 769.877 327.181 781.455 308.078C793.323 288.685 800.849 266.687 804.033 242.085C786.666 234.27 774.219 224.429 766.693 212.562C759.456 200.405 755.838 186.801 755.838 171.75C755.838 157.567 759.89 145.845 767.995 136.583C776.1 127.031 786.231 122.255 798.389 122.255C813.152 122.255 824.73 128.913 833.125 142.227C841.519 155.252 845.716 173.342 845.716 196.497C845.716 234.125 838.48 268.424 824.006 299.394C809.823 330.075 789.994 354.388 764.522 372.334C739.338 389.99 710.971 398.818 679.419 398.818Z',
  'M919.242 398.818C909.4 398.818 902.019 396.357 897.098 391.437C892.177 386.516 889.716 378.701 889.716 367.992C889.716 356.125 892.466 334.996 897.966 304.604C903.755 274.213 913.452 228.481 927.057 167.409L907.953 145.7C914.9 140.201 922.86 135.859 931.833 132.675C941.096 129.202 949.491 127.465 957.017 127.465C965.701 127.465 971.779 129.347 975.253 133.11C979.016 136.583 980.897 142.661 980.897 151.344C980.897 152.792 980.029 157.133 978.292 164.369C976.845 171.605 974.963 179.71 972.648 188.683C963.674 225.442 956.148 258.728 950.07 288.54C944.28 318.353 941.386 343.534 941.386 364.085C941.386 375.083 943.991 382.754 949.201 387.095C939.649 394.91 929.662 398.818 919.242 398.818ZM957.885 90.5615C948.622 90.5615 941.241 88.3907 935.741 84.0491C930.241 79.418 927.491 73.3397 927.491 65.8142C927.491 60.0254 929.083 54.6707 932.267 49.7502C935.741 44.8296 940.372 40.9222 946.162 38.0277C951.951 34.8439 958.609 33.252 966.135 33.252C975.687 33.252 983.068 35.5675 988.279 40.1986C993.779 44.5402 996.528 50.3291 996.528 57.5651C996.528 66.8273 992.91 74.6422 985.674 81.01C978.437 87.3777 969.174 90.5615 957.885 90.5615Z',
  'M1160.37 298.526C1143.29 298.526 1127.8 296.21 1113.91 291.579C1100.3 286.948 1087.57 280.002 1075.7 270.74L1091.33 250.334C1097.99 255.254 1105.66 259.017 1114.34 261.622C1123.31 263.938 1132.58 265.095 1142.13 265.095C1160.95 265.095 1177.3 261.333 1191.19 253.807C1205.09 245.992 1215.65 235.428 1222.89 222.113C1230.42 208.799 1234.18 193.603 1234.18 176.526C1234.18 156.554 1228.97 140.201 1218.55 127.465C1208.42 114.441 1192.06 107.928 1169.48 107.928C1158.48 107.928 1147.2 110.533 1135.62 115.743C1124.33 120.664 1111.88 128.189 1098.28 138.32V120.085C1109.28 109.375 1118.97 100.837 1127.37 94.4691C1135.76 88.1013 1145.75 83.0361 1157.33 79.2733C1168.91 75.2211 1182.37 73.195 1197.71 73.195C1216.81 73.195 1233.31 77.6814 1247.21 86.6541C1261.1 95.6268 1271.52 107.494 1278.47 122.256C1285.7 137.017 1289.32 153.081 1289.32 170.448C1289.32 193.314 1284.55 214.443 1274.99 233.836C1265.44 253.228 1250.97 268.858 1231.57 280.725C1212.47 292.592 1188.73 298.526 1160.37 298.526ZM1071.36 398.818C1060.65 398.818 1052.83 396.068 1047.91 390.569C1042.99 385.069 1040.53 376.096 1040.53 363.65C1040.53 346.863 1042.84 321.392 1047.48 287.238C1052.11 253.084 1060.94 196.353 1073.96 117.046L1060.5 90.5616C1079.9 78.405 1097.12 72.3267 1112.17 72.3267C1124.91 72.3267 1131.28 79.9969 1131.28 95.3374C1131.28 97.9424 1129.97 107.349 1127.37 123.558C1124.76 139.477 1121.87 157.278 1118.68 176.96C1110.29 229.928 1104.07 269.292 1100.01 295.053C1096.25 320.813 1094.37 338.903 1094.37 349.323C1094.37 357.717 1095.24 365.098 1096.97 371.465C1098.71 377.833 1101.32 383.188 1104.79 387.53C1093.5 395.055 1082.36 398.818 1071.36 398.818Z',
  'M1423.45 398.818C1392.77 398.818 1368.74 389.411 1351.37 370.597C1334.01 351.783 1325.32 325.878 1325.32 292.882C1325.32 261.622 1332.12 233.401 1345.73 208.22C1359.33 183.038 1378.15 163.356 1402.18 149.174C1426.2 134.702 1452.98 127.465 1482.5 127.465C1505.37 127.465 1523.17 132.965 1535.91 143.964C1548.93 154.962 1555.45 170.158 1555.45 189.551C1555.45 210.101 1548.06 227.757 1533.3 242.519C1518.54 256.991 1496.97 268.134 1468.61 275.949C1440.53 283.475 1406.52 287.238 1366.57 287.238L1371.78 262.925C1414.91 263.214 1448.34 256.846 1472.08 243.821C1496.11 230.507 1508.12 211.983 1508.12 188.248C1508.12 178.118 1505.08 170.013 1499 163.935C1492.92 157.857 1484.96 154.818 1475.12 154.818C1458.04 154.818 1442.12 161.186 1427.36 173.921C1412.6 186.367 1400.87 203.444 1392.19 225.152C1383.5 246.571 1379.16 270.016 1379.16 295.487C1379.16 318.642 1383.5 336.877 1392.19 350.191C1400.87 363.216 1412.74 369.729 1427.79 369.729C1446.61 369.729 1461.95 363.795 1473.82 351.928C1485.69 340.061 1492.2 324.286 1493.36 304.604C1504.65 304.604 1513.33 306.775 1519.41 311.117C1525.49 315.169 1528.53 321.681 1528.53 330.654C1528.53 342.232 1523.89 353.375 1514.63 364.085C1505.37 374.505 1492.63 382.898 1476.42 389.266C1460.5 395.634 1442.84 398.818 1423.45 398.818Z',
  'M1628.97 398.818C1619.13 398.818 1611.75 395.779 1606.83 389.7C1601.91 383.911 1599.45 374.939 1599.45 362.782C1599.45 350.915 1603.35 324.865 1611.17 284.633C1619.27 244.111 1627.96 206.194 1637.22 170.882L1618.12 149.174C1625.93 142.806 1633.46 137.885 1640.69 134.412C1648.22 130.649 1655.02 128.768 1661.1 128.768C1669.21 128.768 1675.14 131.084 1678.9 135.715C1682.67 140.056 1684.55 145.7 1684.55 152.647C1684.55 161.62 1682.96 171.461 1679.77 182.17C1676.88 192.59 1672.54 204.891 1666.75 219.074L1671.09 221.245C1680.06 199.826 1689.18 182.17 1698.44 168.277C1708 154.384 1717.55 144.108 1727.1 137.451C1736.94 130.505 1746.78 127.031 1756.63 127.031C1766.18 127.031 1773.27 129.202 1777.9 133.544C1782.82 137.596 1785.28 143.964 1785.28 152.647C1785.28 162.199 1781.52 169.869 1773.99 175.658C1766.47 181.446 1756.63 184.341 1744.47 184.341C1729.13 184.341 1714.22 193.024 1699.75 210.391C1685.27 227.757 1673.55 250.334 1664.58 278.12C1655.6 305.907 1651.12 334.562 1651.12 364.085C1651.12 374.794 1652.85 382.32 1656.33 386.661C1647.64 394.766 1638.52 398.818 1628.97 398.818Z',
]
const WIDTH = 1786
const HEIGHT = 444
const GLYPHS = '01<>/\\|+*=-:;%$#@&?!ABCDEFHKMNRSXZ'
const DENSE = '#@%&$8BMWNQ0'
const INTRO = 0.35
const MERGE_START = 2.05
const MERGE_DURATION = 0.35
const SOLID_START = 3
const DURATION = 3.2
const PERIOD = 3.6
const FLASH = 0.09

type Cell = {
  x: number
  y: number
  i: number
  ring: boolean
  xNorm: number
  appear: number
  rate: number
  jitter: number
}

function mulberry32(seed: number) {
  let a = seed
  return function next() {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

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

function ease(value: number) {
  return 1 - Math.pow(1 - value, 3)
}

export function OiPerLogoTextGlyphs({
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
    const tester = document.createElement('canvas').getContext('2d')
    if (!ctx || !tester) return
    const context = ctx
    const probe = tester
    const ring = new Path2D(RING)
    const letters = new Path2D()
    for (const d of LETTERS) letters.addPath(new Path2D(d))
    const color = brandColor ?? 'white'
    const loop = continuous ?? false
    let cells: Cell[] = []
    let cellW = 0
    let cellH = 0
    let frame = 0
    let done = false
    const start = performance.now()

    function layout() {
      const heightPx = canvas!.clientHeight
      if (heightPx === 0) return
      const cellPx = Math.min(5.5, Math.max(3, heightPx * 0.075))
      cellH = (HEIGHT * cellPx) / heightPx
      cellW = cellH * 0.62
      const random = mulberry32(0x0e1fe2)
      const columns = Math.ceil(WIDTH / cellW)
      const rows = Math.ceil(HEIGHT / cellH)
      cells = []
      for (let column = 0; column < columns; column++) {
        for (let row = 0; row < rows; row++) {
          const x = column * cellW
          const y = row * cellH
          const isRing = x + cellW / 2 < 500
          const path = isRing ? ring : letters
          const rule = isRing ? 'evenodd' : 'nonzero'
          let inside = false
          for (let sy = 0; sy <= 3 && !inside; sy++) {
            for (let sx = 0; sx <= 3 && !inside; sx++) {
              inside = probe.isPointInPath(
                path,
                x + (cellW * (sx + 0.5)) / 4,
                y + (cellH * (sy + 0.5)) / 4,
                rule
              )
            }
          }
          const appear = random() * INTRO
          const rate = 0.045 + random() * 0.07
          const jitter = random()
          if (inside) {
            cells.push({
              x,
              y,
              i: column * 131 + row,
              ring: isRing,
              xNorm: (x + cellW / 2) / WIDTH,
              appear,
              rate,
              jitter,
            })
          }
        }
      }
    }

    function drawGlyph(cell: Cell, char: string, alpha: number) {
      context.globalAlpha = alpha
      context.fillText(char, cell.x + cellW / 2, cell.y + cellH * 0.54)
    }

    function drawBlock(cell: Cell, size: number, alpha: number) {
      const w = cellW * size + 0.6
      const h = cellH * size + 0.6
      context.globalAlpha = alpha
      context.fillRect(cell.x + (cellW - w) / 2, cell.y + (cellH - h) / 2, w, h)
    }

    function drawCycling(cell: Cell, t: number) {
      const step = Math.floor(t / cell.rate)
      const pick = hash(cell.i, step)
      drawGlyph(
        cell,
        GLYPHS[Math.floor(pick * GLYPHS.length)],
        0.35 + 0.4 * hash(step, cell.i)
      )
    }

    function drawLocked(cell: Cell, since: number, seed: number) {
      if (since < FLASH) {
        drawBlock(cell, 1, 0.9 - (since / FLASH) * 0.3)
        return
      }
      drawGlyph(cell, DENSE[Math.floor(hash(cell.i, seed) * DENSE.length)], 1)
    }

    function drawOnceCell(cell: Cell, t: number) {
      const appear = clamp01((t - cell.appear) / 0.15)
      if (appear <= 0) return
      const lockT = 0.45 + cell.xNorm * 1.3 + cell.jitter * 0.12
      const mergeT = MERGE_START + cell.xNorm * 0.6 + cell.jitter * 0.1
      const merge = clamp01((t - mergeT) / MERGE_DURATION)
      if (merge > 0) {
        const m = ease(merge)
        drawBlock(cell, 0.55 + 0.45 * m, 0.55 + 0.45 * m)
        if (m < 0.6) {
          drawGlyph(
            cell,
            DENSE[Math.floor(hash(cell.i, 7) * DENSE.length)],
            1 - m / 0.6
          )
        }
        return
      }
      if (t >= lockT) {
        drawLocked(cell, t - lockT, 7)
        return
      }
      context.save()
      context.globalAlpha = appear
      drawCycling(cell, t)
      context.restore()
    }

    function drawLoopCell(cell: Cell, t: number) {
      const appear = clamp01((t - cell.appear) / 0.15)
      if (appear <= 0) return
      const shifted = t - 0.6 - cell.xNorm * PERIOD * 0.5 - cell.jitter * 0.15
      const phase = ((shifted % PERIOD) + PERIOD) % PERIOD
      if (phase < PERIOD * 0.5) {
        drawLocked(cell, phase, Math.floor(shifted / PERIOD))
        return
      }
      drawCycling(cell, t)
    }

    function drawCells(ringPass: boolean, t: number) {
      context.save()
      context.clip(ringPass ? ring : letters, ringPass ? 'evenodd' : 'nonzero')
      for (const cell of cells) {
        if (cell.ring !== ringPass) continue
        if (loop) drawLoopCell(cell, t)
        else drawOnceCell(cell, t)
      }
      context.restore()
    }

    function drawSolid(alpha: number) {
      context.globalAlpha = alpha
      context.fill(ring, 'evenodd')
      context.fill(letters, 'nonzero')
    }

    function draw(t: number) {
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.clearRect(0, 0, canvas!.width, canvas!.height)
      context.setTransform(
        canvas!.width / WIDTH,
        0,
        0,
        canvas!.height / HEIGHT,
        0,
        0
      )
      context.fillStyle = color
      context.globalAlpha = 1
      if (!loop && t >= DURATION) {
        drawSolid(1)
        context.globalAlpha = 1
        return
      }
      context.font = `${cellH * 0.92}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      drawCells(true, t)
      drawCells(false, t)
      if (!loop && t > SOLID_START) {
        drawSolid(ease(clamp01((t - SOLID_START) / (DURATION - SOLID_START))))
      }
      context.globalAlpha = 1
    }

    function tick(now: number) {
      const t = (now - start) / 1000
      draw(t)
      if (!loop && t >= DURATION) {
        done = true
        return
      }
      frame = requestAnimationFrame(tick)
    }

    const observer = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(canvas.clientHeight * dpr)
      layout()
      if (done) draw(DURATION)
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
      ref={ref}
      style={{
        width: `${WIDTH / HEIGHT}em`,
        height: '1em',
        display: 'block',
        ...style,
      }}
      {...props}
    />
  )
}
