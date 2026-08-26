import { useEffect, useState } from 'react'

/**
 * geoh's breakpoints, from BreakpointUtilities in @geoh/presentation.
 * Min 0-640 · Mid 641-1024 · Max 1025+
 */
export type Breakpoint = 'min' | 'mid' | 'max'

export const BREAKPOINTS = {
  min: { max: 640 },
  mid: { min: 641, max: 1024 },
  max: { min: 1025 }
} as const

const currentBreakpoint = (): Breakpoint => {
  const width = window.innerWidth
  if (width <= BREAKPOINTS.min.max) return 'min'
  if (width <= BREAKPOINTS.mid.max) return 'mid'
  return 'max'
}

/** Re-renders only when the breakpoint BAND changes, not on every resize pixel — same as geoh's useWindowBreakpoints. */
export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState(currentBreakpoint)

  useEffect(() => {
    const onResize = () => {
      const next = currentBreakpoint()
      setBreakpoint((previous) => (previous === next ? previous : next))
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return breakpoint
}

export type LayoutState = {
  breakpoint: Breakpoint
  isMobile: boolean
  sidebarCollapsed: boolean
  realtimeCollapsed: boolean
  /** True when a floating pane is covering the content and needs a scrim behind it. */
  skrimVisible: boolean
  toggleSidebar: () => void
  toggleRealtime: () => void
  dismiss: () => void
}

/**
 * Port of geoh's useLayoutBehavior collapse rules.
 *
 * Crossing a breakpoint resets both panes to that band's default: expanded
 * sidebar on Max, collapsed everywhere else, realtime always collapsed. The
 * real app does this in a `switch (breakpoint.type)` effect, and it is why the
 * chrome never ends up in a state that only makes sense at another width.
 */
export const useLayout = (): LayoutState => {
  const breakpoint = useBreakpoint()
  const [sidebarVisible, setSidebarVisible] = useState(() => currentBreakpoint() === 'max')
  const [realtimeVisible, setRealtimeVisible] = useState(false)

  useEffect(() => {
    setSidebarVisible(breakpoint === 'max')
    setRealtimeVisible(false)
  }, [breakpoint])

  const isMobile = breakpoint === 'min' || breakpoint === 'mid'

  return {
    breakpoint,
    isMobile,
    sidebarCollapsed: !sidebarVisible,
    realtimeCollapsed: !realtimeVisible,
    // Below Max the panes float over the content, so an open one needs a scrim.
    skrimVisible: isMobile && (sidebarVisible || realtimeVisible),
    toggleSidebar: () => setSidebarVisible((current) => !current),
    toggleRealtime: () => setRealtimeVisible((current) => !current),
    dismiss: () => {
      if (!isMobile) return
      setSidebarVisible(false)
      setRealtimeVisible(false)
    }
  }
}
