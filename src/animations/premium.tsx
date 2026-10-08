import { ComponentProps, useId } from 'react'

const STYLES = `
  @keyframes oiper-logo-premium-shine {
    0% { transform: translate(-444px, -444px); }
    40%, 100% { transform: translate(444px, 444px); }
  }
  @keyframes oiper-logo-premium-sparkle {
    0%, 14%, 32%, 100% { opacity: 0; }
    20% { opacity: 1; }
  }
  .oiper-logo-premium-shine {
    transform: translate(-444px, -444px);
    animation: oiper-logo-premium-shine 3.5s ease-in-out forwards;
  }
  .oiper-logo-premium-sparkle {
    opacity: 0;
    animation: oiper-logo-premium-sparkle 3.5s ease-in-out forwards;
  }
  [data-continuous] .oiper-logo-premium-shine,
  [data-continuous] .oiper-logo-premium-sparkle {
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
`

export function OiPerLogoPremium({
  continuous,
  ...props
}: ComponentProps<'svg'> & { continuous?: boolean }) {
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
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset="0.25" stopColor="#f5c451" />
          <stop offset="0.5" stopColor="#c98a1e" />
          <stop offset="0.7" stopColor="#f7d27a" />
          <stop offset="1" stopColor="#a8701c" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0.3" stopColor="#fffbeb" stopOpacity="0" />
          <stop offset="0.42" stopColor="#fffbeb" stopOpacity="0.5" />
          <stop offset="0.48" stopColor="#fffbeb" stopOpacity="0.1" />
          <stop offset="0.52" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.56" stopColor="#fffbeb" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M444 222C444 163.122 420.611 106.655 378.978 65.0223C337.345 23.3892 280.878 0 222 0C163.122 0 106.655 23.3892 65.0223 65.0223C23.3892 106.655 0 163.122 0 222C0 280.878 23.3892 337.345 65.0223 378.978C106.655 420.611 163.122 444 222 444C280.878 444 337.345 420.611 378.978 378.978C420.611 337.345 444 280.878 444 222ZM298.96 222C298.96 203.342 295.285 184.866 288.145 167.628C281.005 150.39 270.539 134.728 257.346 121.534C244.152 108.341 228.49 97.8754 211.252 90.7352C194.014 83.595 175.538 79.92 156.88 79.92C138.222 79.92 119.746 83.595 102.508 90.7352C85.2704 97.8754 69.6076 108.341 56.4143 121.534C43.2209 134.728 32.7554 150.39 25.6152 167.628C18.475 184.866 14.8 203.342 14.8 222C14.8 240.658 18.475 259.134 25.6152 276.372C32.7554 293.61 43.2209 309.272 56.4143 322.466C69.6076 335.659 85.2704 346.125 102.508 353.265C119.746 360.405 138.222 364.08 156.88 364.08C175.538 364.08 194.014 360.405 211.252 353.265C228.49 346.125 244.152 335.659 257.346 322.466C270.539 309.272 281.005 293.61 288.145 276.372C295.285 259.134 298.96 240.658 298.96 222Z"
          />
        </clipPath>
      </defs>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M444 222C444 163.122 420.611 106.655 378.978 65.0223C337.345 23.3892 280.878 0 222 0C163.122 0 106.655 23.3892 65.0223 65.0223C23.3892 106.655 0 163.122 0 222C0 280.878 23.3892 337.345 65.0223 378.978C106.655 420.611 163.122 444 222 444C280.878 444 337.345 420.611 378.978 378.978C420.611 337.345 444 280.878 444 222ZM298.96 222C298.96 203.342 295.285 184.866 288.145 167.628C281.005 150.39 270.539 134.728 257.346 121.534C244.152 108.341 228.49 97.8754 211.252 90.7352C194.014 83.595 175.538 79.92 156.88 79.92C138.222 79.92 119.746 83.595 102.508 90.7352C85.2704 97.8754 69.6076 108.341 56.4143 121.534C43.2209 134.728 32.7554 150.39 25.6152 167.628C18.475 184.866 14.8 203.342 14.8 222C14.8 240.658 18.475 259.134 25.6152 276.372C32.7554 293.61 43.2209 309.272 56.4143 322.466C69.6076 335.659 85.2704 346.125 102.508 353.265C119.746 360.405 138.222 364.08 156.88 364.08C175.538 364.08 194.014 360.405 211.252 353.265C228.49 346.125 244.152 335.659 257.346 322.466C270.539 309.272 281.005 293.61 288.145 276.372C295.285 259.134 298.96 240.658 298.96 222Z"
        fill={`url(#${id}-gold)`}
      />
      <g clipPath={`url(#${id}-clip)`}>
        <rect
          className="oiper-logo-premium-shine"
          width="444"
          height="444"
          fill={`url(#${id}-shine)`}
        />
      </g>
      <path
        className="oiper-logo-premium-sparkle"
        d="M379 5Q384 60 439 65Q384 70 379 125Q374 70 319 65Q374 60 379 5Z"
        fill="#fffbeb"
      />
    </svg>
  )
}
