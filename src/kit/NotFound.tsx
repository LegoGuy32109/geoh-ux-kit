import { useLocation } from 'react-router-dom'
import { allNavDestinations } from './nav.ts'

/**
 * Reached when a nav row points somewhere no screen exists yet. Rather than a
 * dead end, it names the command that builds it.
 */
export const NotFound = () => {
  const { pathname } = useLocation()
  const navEntry = allNavDestinations().find((item) => item.to === pathname)

  return (
    <div className='notice'>
      <h2 className='notice__title'>{navEntry === undefined ? 'No screen here' : `${navEntry.label} isn't mocked yet`}</h2>
      <p>
        Nothing in <code>src/screens/</code> claims <code>{pathname}</code>.
      </p>
      <p
        style={{
          marginBottom: 0
        }}
      >
        Build it with <code>yarn new:screen {pathname}</code>
        {navEntry !== undefined && ' — the title and icon come from the nav entry automatically.'}
      </p>
    </div>
  )
}
