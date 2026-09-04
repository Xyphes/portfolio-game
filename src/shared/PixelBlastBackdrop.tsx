import type { CSSProperties } from 'react'

type PixelStyle = CSSProperties & {
  '--pixel-delay': string
  '--pixel-drift-x': string
  '--pixel-drift-y': string
  '--pixel-duration': string
  '--pixel-opacity': number
  '--pixel-size': string
  '--pixel-x': string
  '--pixel-y': string
}

const pixels = [
  [91, 13, 7, -1.2, 9.8, -18, 22, 0.42],
  [78, 17, 5, -4.6, 11.2, 14, -20, 0.32],
  [66, 11, 4, -7.1, 10.4, -11, 18, 0.25],
  [54, 19, 6, -2.8, 12.6, 22, 9, 0.22],
  [36, 12, 4, -5.4, 9.2, -14, 16, 0.2],
  [18, 24, 5, -8.2, 13.4, 18, -13, 0.2],
  [8, 42, 7, -3.5, 12.1, 25, 8, 0.3],
  [15, 68, 4, -6.4, 9.6, -12, -20, 0.22],
  [27, 84, 6, -9.1, 12.8, 15, -16, 0.28],
  [43, 91, 5, -2.4, 10.8, -18, -12, 0.2],
  [61, 86, 8, -5.8, 13.1, 24, 13, 0.32],
  [76, 92, 4, -7.6, 9.4, -10, -19, 0.24],
  [92, 76, 6, -3.2, 11.7, -20, 12, 0.36],
  [96, 52, 4, -8.4, 10.1, -15, -18, 0.25],
  [83, 42, 9, -5.1, 14.2, 20, 17, 0.26],
  [72, 33, 5, -1.8, 9.9, -16, 12, 0.3],
  [63, 45, 4, -6.7, 12.4, 11, -15, 0.19],
  [88, 59, 5, -9.5, 11.1, 18, -17, 0.28],
  [70, 69, 7, -4.1, 13.8, -21, 10, 0.24],
  [51, 74, 4, -7.9, 10.6, 14, 19, 0.18],
  [31, 64, 5, -2.1, 11.9, -17, 13, 0.18],
  [22, 47, 4, -6.1, 9.7, 12, -18, 0.2],
  [47, 37, 7, -8.8, 13.6, -19, -9, 0.17],
  [57, 57, 5, -3.9, 10.3, 17, -16, 0.16],
  [3, 14, 5, -4.3, 10.2, 18, 14, 0.3],
  [12, 9, 4, -7.4, 11.5, -12, 20, 0.28],
  [25, 7, 7, -2.6, 12.3, 16, 12, 0.26],
  [42, 6, 4, -8.5, 9.5, -18, 16, 0.24],
  [58, 7, 6, -5.6, 13.2, 21, 11, 0.28],
  [72, 8, 4, -1.7, 10.7, -14, 19, 0.32],
  [84, 7, 8, -6.8, 12.7, 17, 15, 0.34],
  [97, 25, 5, -3.7, 9.9, -20, 12, 0.3],
  [4, 58, 7, -9.2, 13.5, 22, -11, 0.32],
  [6, 82, 4, -2.3, 10.5, 14, -19, 0.26],
  [13, 93, 6, -7.7, 11.8, -16, -13, 0.28],
  [39, 86, 4, -4.8, 9.6, 19, -14, 0.24],
  [89, 94, 7, -1.4, 13.7, -18, -12, 0.34],
  [98, 88, 4, -6.3, 10.9, -16, 18, 0.28],
  [50, 26, 5, -8.9, 12.1, 17, -16, 0.23],
  [75, 24, 6, -3.1, 11.3, -15, 14, 0.3],
] as const

const ANIMATION_SPEED = 0.31
const DRIFT_SCALE = 1.35

export function PixelBlastBackdrop({
  context = 'landing',
}: {
  context?: 'landing' | 'classic' | 'adventure'
}) {
  return (
    <div className={`pixel-blast-backdrop pixel-blast-backdrop--${context}`} aria-hidden="true">
      <span className="pixel-blast-glow" />
      {pixels.map(([x, y, size, delay, duration, driftX, driftY, opacity], index) => {
        const isTriangle = index % 5 === 2
        const style: PixelStyle = {
          '--pixel-delay': `${delay}s`,
          '--pixel-drift-x': `${driftX * DRIFT_SCALE}px`,
          '--pixel-drift-y': `${driftY * DRIFT_SCALE}px`,
          '--pixel-duration': `${(duration * ANIMATION_SPEED).toFixed(2)}s`,
          '--pixel-opacity': isTriangle ? Math.max(opacity, 0.72) : opacity,
          '--pixel-size': `${isTriangle ? Math.max(size * 2.4, 14) : size}px`,
          '--pixel-x': `${x}%`,
          '--pixel-y': `${y}%`,
        }

        const shapeClass = isTriangle ? ' is-triangle' : ''

        return <i className={`pixel-blast-particle${shapeClass}`} key={index} style={style} />
      })}
    </div>
  )
}
