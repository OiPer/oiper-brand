import { ComponentProps, useId } from 'react'

const STYLES = `
  @keyframes oiper-logo-wipe {
    to { transform: translateX(488px); }
  }
  .oiper-logo-wipe {
    animation: oiper-logo-wipe 1s cubic-bezier(0.65, 0, 0.35, 1) forwards;
  }
  [data-continuous] .oiper-logo-wipe {
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
`

export function OiPerLogoWipe({
  brandColor,
  continuous,
  ...props
}: ComponentProps<'svg'> & { brandColor?: string; continuous?: boolean }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')

  return (
    <svg
      fill="none"
      width="1em"
      height="1em"
      viewBox="0 0 444 444"
      xmlns="http://www.w3.org/2000/svg"
      data-continuous={continuous ? '' : undefined}
      {...props}
    >
      <style>{STYLES}</style>
      <defs>
        <linearGradient id={`${id}-wipe`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.637" stopColor="white" />
          <stop offset="0.667" stopColor="black" />
        </linearGradient>
        <mask id={`${id}-mask`}>
          <rect
            className="oiper-logo-wipe"
            x="-888"
            width="1332"
            height="444"
            fill={`url(#${id}-wipe)`}
          />
        </mask>
      </defs>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M444 222C444 163.122 420.611 106.655 378.978 65.0223C337.345 23.3892 280.878 0 222 0C163.122 0 106.655 23.3892 65.0223 65.0223C23.3892 106.655 0 163.122 0 222C0 280.878 23.3892 337.345 65.0223 378.978C106.655 420.611 163.122 444 222 444C280.878 444 337.345 420.611 378.978 378.978C420.611 337.345 444 280.878 444 222ZM298.96 222C298.96 203.342 295.285 184.866 288.145 167.628C281.005 150.39 270.539 134.728 257.346 121.534C244.152 108.341 228.49 97.8754 211.252 90.7352C194.014 83.595 175.538 79.92 156.88 79.92C138.222 79.92 119.746 83.595 102.508 90.7352C85.2704 97.8754 69.6076 108.341 56.4143 121.534C43.2209 134.728 32.7554 150.39 25.6152 167.628C18.475 184.866 14.8 203.342 14.8 222C14.8 240.658 18.475 259.134 25.6152 276.372C32.7554 293.61 43.2209 309.272 56.4143 322.466C69.6076 335.659 85.2704 346.125 102.508 353.265C119.746 360.405 138.222 364.08 156.88 364.08C175.538 364.08 194.014 360.405 211.252 353.265C228.49 346.125 244.152 335.659 257.346 322.466C270.539 309.272 281.005 293.61 288.145 276.372C295.285 259.134 298.96 240.658 298.96 222Z"
        fill={brandColor ?? 'white'}
        mask={`url(#${id}-mask)`}
      />
    </svg>
  )
}
