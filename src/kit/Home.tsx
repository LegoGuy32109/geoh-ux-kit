import { Link } from 'react-router-dom'
import { SCREENS } from './screens.ts'

/**
 * Landing page. Deliberately plain — the sidebar is the real index, and this
 * just says what is built and how to add the next one.
 */
export const Home = () => (
  <>
    <div
      className='card'
      style={{
        marginBottom: 24,
        maxWidth: 680
      }}
    >
      <h2
        style={{
          margin: '0 0 12px',
          fontSize: 'var(--web-text-size-extra-large)',
          color: 'var(--web-bold-color)'
        }}
      >
        Mocked screens
      </h2>
      {SCREENS.length === 0 ? (
        <p
          style={{
            margin: 0,
            color: 'var(--web-text-color-light)'
          }}
        >
          None yet.
        </p>
      ) : (
        <ul
          style={{
            margin: 0,
            paddingLeft: 18
          }}
        >
          {SCREENS.map((screen) => (
            <li
              key={screen.path}
              style={{
                marginBottom: 6
              }}
            >
              <Link
                to={screen.path}
                style={{
                  color: 'var(--web-primary-color)',
                  fontWeight: 600
                }}
              >
                {screen.title}
              </Link>
              <span
                style={{
                  color: 'var(--web-text-color-light)'
                }}
              >
                {' '}
                — {screen.path}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>

    <div className='notice'>
      <h2 className='notice__title'>Adding a screen</h2>
      <p
        style={{
          marginTop: 0
        }}
      >
        Run <code>yarn new:screen /my-feature</code>, then point <code>meta.nav</code> at a group and an icon:
      </p>
      <pre>
        {`export const meta = {
  path: '/broadcast-studio',
  title: 'Broadcast Studio',
  nav: { parent: 'SuperAdmin', icon: 'GrAnnounce', after: 'CompanyList' }
}`}
      </pre>
      <p
        style={{
          marginBottom: 0
        }}
      >
        The row appears under that group with that icon. Nothing else to edit.
      </p>
    </div>
  </>
)
