/**
 * The GeoH wordmark.
 *
 * Copied verbatim from geoh's `apps/web/src/components/global/Svg/LogoFlat.tsx`
 * — same viewBox, same paths, same three brand colors. Kept as its own file so
 * refreshing it is a straight copy from that source rather than a redraw.
 *
 * The colors are literal here on purpose: they are the mark's own palette, not
 * theme tokens, and they must not drift with the UI theme. This is the one file
 * the no-literal-colors rule exempts, the same way tokens.css is exempt.
 */
export type LogoProps = {
  width?: number | string
  height?: number | string
  className?: string
}

export const Logo = ({ width, height, className }: LogoProps) => (
  <svg x='0px' y='0px' width={width} height={height} viewBox='0 0 90.13 34.39' className={className} role='img' aria-label='GeoH'>
    <path
      fill='#58595B'
      d='M10.6,16.12v-3.04l8.95-0.02v9.58c-1.37,1.34-2.79,2.34-4.25,3.01s-2.97,1.01-4.52,1.01
      c-2.06,0-3.9-0.52-5.52-1.55s-2.9-2.54-3.84-4.52C0.47,18.62,0,16.24,0,13.46c0-2.81,0.47-5.27,1.42-7.35s2.19-3.63,3.73-4.62
      C6.69,0.5,8.5,0,10.6,0c1.55,0,2.9,0.29,4.06,0.86s2.12,1.39,2.87,2.44s1.31,2.5,1.69,4.34L16.7,8.49
      c-0.34-1.45-0.77-2.54-1.28-3.26s-1.2-1.29-2.04-1.7s-1.79-0.62-2.85-0.62c-1.54,0-2.86,0.37-3.96,1.12
      c-1.11,0.75-2,1.9-2.67,3.47C3.22,9.08,2.88,11,2.88,13.26c0,3.45,0.72,6.03,2.16,7.75c1.44,1.72,3.32,2.58,5.63,2.58
      c1.1,0,2.23-0.26,3.38-0.79s2.07-1.15,2.75-1.88v-4.8H10.6z'
    />
    <path fill='#58595B' d='M26.38,26.23V0.46h15.28V3.5H29.17v7.88h11.69v3.04H29.17v8.77h12.97v3.04H26.38z' />
    <path fill='#58595B' d='M73.55,26.31V0.54h2.79v10.58h10.99V0.54h2.79v25.77h-2.79V14.16H76.35v12.15H73.55z' />
    <path
      fill='#58595B'
      d='M51.85,20.77l0.09-0.09c-2.27-2.86-4.19-5.97-4.19-8.24c0-5.26,4.21-9.55,9.4-9.55c5.18,0,9.4,4.28,9.4,9.56
    c0,1.02-0.38,2.2-1.02,3.46l0.21,0.15l2.06,1.54c0.94-1.78,1.55-3.55,1.55-5.15c0-6.84-5.48-12.39-12.19-12.39
    c-6.73,0-12.19,5.57-12.19,12.39c0,3.14,2.35,6.95,4.92,10.18L51.85,20.77z'
    />
    <path
      fill='#92CD00'
      d='M57.06,30.2l-0.93-0.84c-0.07-0.06-1.76-1.61-3.83-3.87l2.04-1.93c1.07,1.17,2.03,2.14,2.71,2.8
    c1.41-1.37,4.16-4.19,6.34-7.2l2.25,1.67c-3.22,4.47-7.48,8.37-7.66,8.54L57.06,30.2z'
    />
    <ellipse fill='#BCBEC0' fillRule='evenodd' clipRule='evenodd' cx='57.35' cy='33.4' rx='6.19' ry='0.98' />
    <path fill='#58595B' d='M56.27,15.17v-2.7h1.8v2.7h2.25v-3.6h1.35l-4.5-4.05l-4.5,4.05h1.35v3.6H56.27z' />
  </svg>
)
