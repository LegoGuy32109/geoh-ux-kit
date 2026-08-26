import { useLocation } from 'react-router-dom'
import { allNavDestinations } from './nav.ts'

/**
 * Reached when a nav row points somewhere no screen exists yet. Rather than a
 * dead end, it says exactly which file to create — the next step is the message.
 */
export const NotFound = () => {
  const { pathname } = useLocation()
  const navEntry = allNavDestinations().find((item) => item.to === pathname)
  const suggested = `src/screens/${(navEntry?.key ?? 'NewScreen').replace(/[^A-Za-z0-9]/g, '')}.tsx`

  return (
    <div className='notice'>
      <h2 className='notice__title'>{navEntry === undefined ? 'No screen here' : `${navEntry.label} isn't mocked yet`}</h2>
      <p>
        Nothing in <code>src/screens/</code> claims <code>{pathname}</code>.
      </p>
      <p style={{ marginBottom: 0 }}>
        To build it, run <code>yarn new:screen {pathname}</code>, or create <code>{suggested}</code> with:
      </p>
      <pre
        style={{
          background: 'var(--web-disabled-dark-background-color)',
          padding: 12,
          borderRadius: 4,
          overflowX: 'auto',
          fontSize: 'var(--web-text-size-extra-small)'
        }}
      >
        {`export const meta = {\n  path: '${pathname}',\n  title: '${navEntry?.label ?? 'New Screen'}'\n}\n\nexport default function Screen() {\n  return <h1 className='page-title'>${navEntry?.label ?? 'New Screen'}</h1>\n}`}
      </pre>
    </div>
  )
}
