import { useEffect, useState, type ReactNode } from 'react'
import { Sidebar } from './Sidebar.tsx'
import { Toolbar } from './Toolbar.tsx'
import { DESKTOP_UP, useIsBelowDesktop, useIsPhone } from './useBreakpoint.ts'
import { usePersona } from './usePersona.tsx'

/**
 * The app chrome. Screens render inside it and never touch it.
 *
 * Responsive behaviour matches the real portal:
 *   >= 1024px  sidebar sits beside the content, expanded, collapsible to a rail
 *   640-1023   sidebar floats over the content behind a scrim, closed by default
 *   < 640px    same, but fully hidden when closed rather than showing a rail
 */
export const AppShell = ({ title, children }: { title: string; children: ReactNode }) => {
  const { persona } = usePersona()
  const isPhone = useIsPhone()
  const belowDesktop = useIsBelowDesktop()
  const [collapsed, setCollapsed] = useState(() => !window.matchMedia(DESKTOP_UP).matches)

  // Crossing the desktop boundary — including by dragging the window or
  // switching a device preset in devtools — resets the sidebar to that
  // breakpoint's default. Without this the sidebar keeps whatever state it had
  // at the old size, which is how a prototype ends up looking broken on a
  // reviewer's laptop after someone demoed it on a phone.
  useEffect(() => {
    const list = window.matchMedia(DESKTOP_UP)
    const onChange = (event: MediaQueryListEvent) => setCollapsed(!event.matches)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    document.title = `${title} · GeoH UX Kit`
  }, [title])

  const overlayOpen = belowDesktop && !collapsed

  return (
    <div className='shell'>
      <Sidebar
        persona={persona}
        collapsed={collapsed}
        overlay={belowDesktop}
        hidden={isPhone && collapsed}
        // On a floating sidebar, following a link should close it — otherwise
        // it covers the screen the reviewer just asked to see.
        onNavigate={() => belowDesktop && setCollapsed(true)}
      />

      {overlayOpen && <div className='skrim' onClick={() => setCollapsed(true)} />}

      <div className='shell__main'>
        <Toolbar title={title} compact={isPhone} onHamburgerClick={() => setCollapsed((current) => !current)} />
        <main className='shell__content'>{children}</main>
      </div>
    </div>
  )
}
