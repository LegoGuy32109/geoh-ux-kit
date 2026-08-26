import { Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from './kit/AppShell.tsx'
import { Coverage } from './kit/Coverage.tsx'
import { NotFound } from './kit/NotFound.tsx'
import { SCREENS } from './kit/screens.ts'
import { PersonaProvider } from './kit/usePersona.tsx'

/**
 * The shell wraps the whole route tree rather than each screen, so navigating
 * between screens does not remount the sidebar — its expanded groups and scroll
 * position survive, the way they do in the real app.
 */
const Shell = () => {
  const { pathname } = useLocation()
  const title = SCREENS.find((screen) => screen.path === pathname)?.title ?? 'GeoH UX Kit'

  return (
    <AppShell title={title}>
      <Routes>
        <Route path='/' element={<Coverage />} />
        {SCREENS.map((screen) => (
          <Route key={screen.path} path={screen.path} element={<screen.Component />} />
        ))}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </AppShell>
  )
}

export const App = () => (
  <PersonaProvider>
    <Shell />
  </PersonaProvider>
)
