import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Home } from './kit/Home.tsx'
import { Layout } from './kit/Layout.tsx'
import { NotFound } from './kit/NotFound.tsx'
import { SCREENS } from './kit/screens.ts'
import { PersonaProvider } from './kit/usePersona.tsx'

/**
 * The chrome wraps the whole route tree rather than each screen, so moving
 * between screens does not remount the sidebar — its scroll position and open
 * group survive, as they do in the real app.
 */
const Shell = () => {
  const { pathname } = useLocation()
  const title = SCREENS.find((screen) => screen.path === pathname)?.title ?? 'GeoH UX Kit'

  useEffect(() => {
    document.title = `${title} · GeoH UX Kit`
  }, [title])

  return (
    <Layout title={title}>
      <Routes>
        <Route path='/' element={<Home />} />
        {SCREENS.map((screen) => (
          <Route key={screen.path} path={screen.path} element={<screen.Component />} />
        ))}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export const App = () => (
  <PersonaProvider>
    <Shell />
  </PersonaProvider>
)
