import { Link } from 'react-router-dom'
import { allNavDestinations } from './nav.ts'
import { MOCKED_PATHS, SCREENS } from './screens.ts'

/**
 * Landing page: what this prototype covers, and what it doesn't.
 *
 * The goal is mocking every page in the portal. That is a long road, so the
 * progress is the front door — a reviewer opening the link sees the real nav
 * with the mocked screens lit up, and this page says exactly where things stand.
 */
export const Coverage = () => {
  const destinations = allNavDestinations()
  const covered = destinations.filter((item) => MOCKED_PATHS.has(item.to as string))
  const percent = destinations.length === 0 ? 0 : Math.round((covered.length / destinations.length) * 100)

  // Screens on paths the sidebar doesn't know about — new routes that don't
  // exist in the real app yet, which is exactly what Broadcast Studio was.
  const navPaths = new Set(destinations.map((item) => item.to))
  const newRoutes = SCREENS.filter((screen) => !navPaths.has(screen.path))

  return (
    <>
      <h1 className='page-title'>GeoH UX Kit</h1>
      <p className='page-subtitle'>
        {covered.length} of {destinations.length} portal pages mocked ({percent}%). The sidebar shows the whole real
        app — greyed rows are not built yet.
      </p>

      {newRoutes.length > 0 && (
        <div className='card' style={{ marginBottom: 24 }}>
          <h2 style={{ margin: '0 0 12px', fontSize: 'var(--web-text-size-extra-large)' }}>New routes</h2>
          <p style={{ margin: '0 0 12px', color: 'var(--web-text-color-light)' }}>
            Screens for features that don't exist in the portal yet.
          </p>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {newRoutes.map((screen) => (
              <li key={screen.path} style={{ marginBottom: 6 }}>
                <Link to={screen.path} style={{ color: 'var(--web-primary-color)', fontWeight: 600 }}>
                  {screen.title}
                </Link>
                {screen.description !== undefined && (
                  <span style={{ color: 'var(--web-text-color-light)' }}> — {screen.description}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className='card'>
        <h2 style={{ margin: '0 0 12px', fontSize: 'var(--web-text-size-extra-large)' }}>Mocked portal pages</h2>
        {covered.length === 0 ? (
          <p style={{ margin: 0, color: 'var(--web-text-color-light)' }}>None yet.</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {covered.map((item) => (
              <li key={item.key} style={{ marginBottom: 6 }}>
                <Link to={item.to as string} style={{ color: 'var(--web-primary-color)', fontWeight: 600 }}>
                  {item.label}
                </Link>
                <span style={{ color: 'var(--web-text-color-light)' }}> — {item.to}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
