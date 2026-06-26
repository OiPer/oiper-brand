import { SVGProps } from 'react'

export function OiPerLogo({
  brandColor,
  ...props
}: SVGProps<SVGSVGElement> & { brandColor?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="1em"
      width="1em"
      fill="none"
      {...props}
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        fill={brandColor || '#FFFFFF'}
        d="M444 222a222 222 0 1 0-443.999-.001A222 222 0 0 0 444 222Zm-145.04 0a142.086 142.086 0 0 0-41.614-100.466A142.091 142.091 0 0 0 156.88 79.92 142.082 142.082 0 0 0 14.8 222a142.082 142.082 0 0 0 142.08 142.08 142.086 142.086 0 0 0 100.466-41.614A142.088 142.088 0 0 0 298.96 222Z"
      />
    </svg>
  )
}

export function OiPerLogoTray({
  brandColor,
  ...props
}: SVGProps<SVGSVGElement> & { brandColor?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="1em"
      width="1em"
      fill="none"
      {...props}
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        fill={brandColor || '#FFFFFF'}
        d="M478 256a222 222 0 1 0-443.999-.001A222 222 0 0 0 478 256Zm-145.04 0a142.086 142.086 0 0 0-41.614-100.466A142.088 142.088 0 0 0 190.88 113.92a142.086 142.086 0 0 0-100.466 41.614 142.085 142.085 0 0 0-30.799 154.838 142.085 142.085 0 0 0 76.893 76.893 142.086 142.086 0 0 0 154.838-30.799A142.088 142.088 0 0 0 332.96 256Z"
      />
    </svg>
  )
}

export function OiPerLogoBackground({
  backgroundColor,
  brandColor,
  ...props
}: SVGProps<SVGSVGElement> & {
  backgroundColor?: string
  brandColor?: string
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="1em"
      width="1em"
      fill="none"
      {...props}
    >
      <path
        fill={backgroundColor || '#282828'}
        d="M374.154 0H137.846C61.716 0 0 61.716 0 137.846v236.308C0 450.284 61.716 512 137.846 512h236.308C450.284 512 512 450.284 512 374.154V137.846C512 61.716 450.284 0 374.154 0Z"
      />
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        fill={brandColor || '#FFFFFF'}
        d="M478 256a222 222 0 1 0-443.999-.001A222 222 0 0 0 478 256Zm-145.04 0a142.086 142.086 0 0 0-41.614-100.466A142.088 142.088 0 0 0 190.88 113.92a142.086 142.086 0 0 0-100.466 41.614 142.085 142.085 0 0 0-30.799 154.838 142.085 142.085 0 0 0 76.893 76.893 142.086 142.086 0 0 0 154.838-30.799A142.088 142.088 0 0 0 332.96 256Z"
      />
    </svg>
  )
}
