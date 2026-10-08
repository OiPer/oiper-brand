import { ComponentProps, useId } from 'react'

const STYLES = `
  @keyframes oiper-logo-dissolve-0 {
    0% { opacity: 0; transform: scale(0); }
    14% { opacity: 1; transform: scale(0.3); }
    62% { opacity: 1; transform: scale(0.3); }
    90%, 100% { opacity: 1; transform: scale(1); }
  }
  @keyframes oiper-logo-dissolve-1 {
    0%, 6% { opacity: 0; transform: scale(0); }
    20% { opacity: 1; transform: scale(0.3); }
    62% { opacity: 1; transform: scale(0.3); }
    90%, 100% { opacity: 1; transform: scale(1); }
  }
  @keyframes oiper-logo-dissolve-2 {
    0%, 12% { opacity: 0; transform: scale(0); }
    26% { opacity: 1; transform: scale(0.3); }
    62% { opacity: 1; transform: scale(0.3); }
    90%, 100% { opacity: 1; transform: scale(1); }
  }
  @keyframes oiper-logo-dissolve-3 {
    0%, 18% { opacity: 0; transform: scale(0); }
    32% { opacity: 1; transform: scale(0.3); }
    62% { opacity: 1; transform: scale(0.3); }
    90%, 100% { opacity: 1; transform: scale(1); }
  }
  @keyframes oiper-logo-dissolve-4 {
    0%, 24% { opacity: 0; transform: scale(0); }
    38% { opacity: 1; transform: scale(0.3); }
    62% { opacity: 1; transform: scale(0.3); }
    90%, 100% { opacity: 1; transform: scale(1); }
  }
  @keyframes oiper-logo-dissolve-5 {
    0%, 30% { opacity: 0; transform: scale(0); }
    44% { opacity: 1; transform: scale(0.3); }
    62% { opacity: 1; transform: scale(0.3); }
    90%, 100% { opacity: 1; transform: scale(1); }
  }
  @keyframes oiper-logo-dissolve-6 {
    0%, 36% { opacity: 0; transform: scale(0); }
    50% { opacity: 1; transform: scale(0.3); }
    62% { opacity: 1; transform: scale(0.3); }
    90%, 100% { opacity: 1; transform: scale(1); }
  }
  @keyframes oiper-logo-dissolve-7 {
    0%, 42% { opacity: 0; transform: scale(0); }
    56% { opacity: 1; transform: scale(0.3); }
    62% { opacity: 1; transform: scale(0.3); }
    90%, 100% { opacity: 1; transform: scale(1); }
  }
  .oiper-logo-dissolve-dot {
    opacity: 0;
    transform: scale(0);
    transform-box: fill-box;
    transform-origin: center;
    animation-duration: 2.4s;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
  }
  .oiper-logo-dissolve-dot-0 { animation-name: oiper-logo-dissolve-0; }
  .oiper-logo-dissolve-dot-1 { animation-name: oiper-logo-dissolve-1; }
  .oiper-logo-dissolve-dot-2 { animation-name: oiper-logo-dissolve-2; }
  .oiper-logo-dissolve-dot-3 { animation-name: oiper-logo-dissolve-3; }
  .oiper-logo-dissolve-dot-4 { animation-name: oiper-logo-dissolve-4; }
  .oiper-logo-dissolve-dot-5 { animation-name: oiper-logo-dissolve-5; }
  .oiper-logo-dissolve-dot-6 { animation-name: oiper-logo-dissolve-6; }
  .oiper-logo-dissolve-dot-7 { animation-name: oiper-logo-dissolve-7; }
  [data-continuous] .oiper-logo-dissolve-dot {
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
`

const DOTS = Array.from({ length: 100 }, (_, index) => {
  const row = Math.floor(index / 10)
  const column = index % 10
  return {
    cx: 22.2 + column * 44.4,
    cy: 22.2 + row * 44.4,
    group: ((index * 73) % 101) % 8,
  }
})

export function OiPerLogoDissolve({
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
        <mask id={`${id}-mask`}>
          {DOTS.map(({ cx, cy, group }) => (
            <circle
              key={`${cx}-${cy}`}
              className={`oiper-logo-dissolve-dot oiper-logo-dissolve-dot-${group}`}
              cx={cx}
              cy={cy}
              r="32"
              fill="white"
            />
          ))}
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
