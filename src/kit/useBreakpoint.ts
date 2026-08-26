import { useEffect, useState } from 'react'

/**
 * geoh's real breakpoints, from BreakpointType in @geoh/presentation.
 * Phrased as min-width and negated so JS and CSS agree at fractional widths —
 * a `max-width: 1023px` query does not fire at 1023.5px but `not (min-width: 1024px)` does.
 */
export const TABLET_UP = '(min-width: 640px)'
export const DESKTOP_UP = '(min-width: 1024px)'

const useBelow = (query: string): boolean => {
  const [below, setBelow] = useState(() => !window.matchMedia(query).matches)

  useEffect(() => {
    const list = window.matchMedia(query)
    const onChange = (event: MediaQueryListEvent) => setBelow(!event.matches)
    setBelow(!list.matches)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [query])

  return below
}

/** Under 640px. The sidebar becomes an overlay and the toolbar collapses. */
export const useIsPhone = (): boolean => useBelow(TABLET_UP)

/** Under 1024px — phone or tablet. Both are too narrow for a pinned sidebar. */
export const useIsBelowDesktop = (): boolean => useBelow(DESKTOP_UP)
