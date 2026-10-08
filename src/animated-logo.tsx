import { ComponentProps, useId } from 'react'

const OIPER_LOGO_PATH =
  'M444 222C444 163.122 420.611 106.655 378.978 65.0223C337.345 23.3892 280.878 0 222 0C163.122 0 106.655 23.3892 65.0223 65.0223C23.3892 106.655 0 163.122 0 222C0 280.878 23.3892 337.345 65.0223 378.978C106.655 420.611 163.122 444 222 444C280.878 444 337.345 420.611 378.978 378.978C420.611 337.345 444 280.878 444 222ZM298.96 222C298.96 203.342 295.285 184.866 288.145 167.628C281.005 150.39 270.539 134.728 257.346 121.534C244.152 108.341 228.49 97.8754 211.252 90.7352C194.014 83.595 175.538 79.92 156.88 79.92C138.222 79.92 119.746 83.595 102.508 90.7352C85.2704 97.8754 69.6076 108.341 56.4143 121.534C43.2209 134.728 32.7554 150.39 25.6152 167.628C18.475 184.866 14.8 203.342 14.8 222C14.8 240.658 18.475 259.134 25.6152 276.372C32.7554 293.61 43.2209 309.272 56.4143 322.466C69.6076 335.659 85.2704 346.125 102.508 353.265C119.746 360.405 138.222 364.08 156.88 364.08C175.538 364.08 194.014 360.405 211.252 353.265C228.49 346.125 244.152 335.659 257.346 322.466C270.539 309.272 281.005 293.61 288.145 276.372C295.285 259.134 298.96 240.658 298.96 222Z'

const OIPER_ANIMATED_LOGO_STYLES = `
  @keyframes oiper-animated-logo-draw {
    to { stroke-dashoffset: 0; }
  }
  @keyframes oiper-animated-logo-fade-out {
    to { opacity: 0; }
  }
  @keyframes oiper-animated-logo-fade-in {
    to { opacity: 1; }
  }
  @keyframes oiper-animated-logo-shine {
    0% { transform: translate(-444px, -444px); }
    40%, 100% { transform: translate(444px, 444px); }
  }
  @keyframes oiper-animated-logo-wipe {
    to { transform: translateX(488px); }
  }
  @keyframes oiper-animated-logo-trace {
    to { stroke-dashoffset: 0; }
  }
  @keyframes oiper-animated-logo-trace-reverse {
    to { stroke-dashoffset: 2; }
  }

  .oiper-animated-logo-draw-stroke {
    stroke-width: 24;
    stroke-linecap: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation:
      oiper-animated-logo-draw 1.2s cubic-bezier(0.65, 0, 0.35, 1) forwards,
      oiper-animated-logo-fade-out 0.4s ease-out 1.5s forwards;
  }
  .oiper-animated-logo-draw-stroke-inner {
    animation-delay: 0.25s, 1.5s;
  }
  .oiper-animated-logo-draw-fill {
    opacity: 0;
    animation: oiper-animated-logo-fade-in 0.5s ease-out 1.1s forwards;
  }

  .oiper-animated-logo-shine {
    transform: translate(-444px, -444px);
    animation: oiper-animated-logo-shine 3s ease-in-out infinite;
  }

  .oiper-animated-logo-wipe {
    animation: oiper-animated-logo-wipe 1s cubic-bezier(0.65, 0, 0.35, 1) forwards;
  }

  .oiper-animated-logo-trace {
    stroke-width: 16;
    stroke-linecap: round;
    stroke-dasharray: 0.25 0.75;
    stroke-dashoffset: 1;
    animation: oiper-animated-logo-trace 1.6s linear infinite;
  }
  .oiper-animated-logo-trace-inner {
    animation-name: oiper-animated-logo-trace-reverse;
  }
`

export function OiPerAnimatedLogo({
  variant,
  brandColor,
  ...props
}: ComponentProps<'svg'> & {
  variant: 'draw' | 'shine' | 'wipe' | 'trace'
  brandColor?: string
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const color = brandColor ?? 'white'

  return (
    <svg
      fill="none"
      width="1em"
      height="1em"
      viewBox="0 0 444 444"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <style>{OIPER_ANIMATED_LOGO_STYLES}</style>

      {variant === 'draw' && (
        <>
          <circle
            className="oiper-animated-logo-draw-stroke"
            cx="222"
            cy="222"
            r="222"
            stroke={color}
            pathLength="1"
          />
          <circle
            className="oiper-animated-logo-draw-stroke oiper-animated-logo-draw-stroke-inner"
            cx="156.88"
            cy="222"
            r="142.08"
            stroke={color}
            pathLength="1"
          />
          <path
            className="oiper-animated-logo-draw-fill"
            fillRule="evenodd"
            clipRule="evenodd"
            d={OIPER_LOGO_PATH}
            fill={color}
          />
        </>
      )}

      {variant === 'shine' && (
        <>
          <defs>
            <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0.35" stopColor={color} stopOpacity="0" />
              <stop offset="0.5" stopColor={color} stopOpacity="1" />
              <stop offset="0.65" stopColor={color} stopOpacity="0" />
            </linearGradient>
            <clipPath id={`${id}-clip`}>
              <path fillRule="evenodd" clipRule="evenodd" d={OIPER_LOGO_PATH} />
            </clipPath>
          </defs>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={OIPER_LOGO_PATH}
            fill={color}
            opacity="0.5"
          />
          <g clipPath={`url(#${id}-clip)`}>
            <rect
              className="oiper-animated-logo-shine"
              width="444"
              height="444"
              fill={`url(#${id}-shine)`}
            />
          </g>
        </>
      )}

      {variant === 'wipe' && (
        <>
          <defs>
            <linearGradient id={`${id}-wipe`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0.45" stopColor="white" />
              <stop offset="0.5" stopColor="black" />
            </linearGradient>
            <mask id={`${id}-mask`}>
              <rect
                className="oiper-animated-logo-wipe"
                x="-444"
                width="888"
                height="444"
                fill={`url(#${id}-wipe)`}
              />
            </mask>
          </defs>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={OIPER_LOGO_PATH}
            fill={color}
            mask={`url(#${id}-mask)`}
          />
        </>
      )}

      {variant === 'trace' && (
        <>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={OIPER_LOGO_PATH}
            fill={color}
            opacity="0.2"
          />
          <circle
            className="oiper-animated-logo-trace"
            cx="222"
            cy="222"
            r="222"
            stroke={color}
            pathLength="1"
          />
          <circle
            className="oiper-animated-logo-trace oiper-animated-logo-trace-inner"
            cx="156.88"
            cy="222"
            r="142.08"
            stroke={color}
            pathLength="1"
          />
        </>
      )}
    </svg>
  )
}
