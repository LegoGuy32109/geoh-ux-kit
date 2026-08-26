import { Link } from 'react-router-dom'
import { SCREENS } from './screens.ts'

const CARD_HEADING = {
  margin: '0 0 12px',
  fontSize: 'var(--web-text-size-extra-large)',
  color: 'var(--web-bold-color)'
} as const

/**
 * Landing page.
 *
 * Deliberately plain — the sidebar is the real index of what exists. On `main`
 * there are no screens at all, so this is the first thing a designer reads;
 * it should tell them where prototypes live rather than just report an empty
 * list.
 */
export const Home = () => (
  <>
    {SCREENS.length > 0 && (
      <div
        className='card'
        style={{
          marginBottom: 24,
          maxWidth: 680
        }}
      >
        <h2 style={CARD_HEADING}>Mocked screens</h2>
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
      </div>
    )}

    <div className='notice'>
      <h2 className='notice__title'>{SCREENS.length === 0 ? 'No screens on this branch' : 'Adding a screen'}</h2>

      {SCREENS.length === 0 && (
        <p
          style={{
            marginTop: 0
          }}
        >
          That is expected on <code>main</code> — it is the harness everyone branches from. The sidebar around this page is the real GeoH navigation, and it is
          already yours. Prototypes live on <code>feat/</code> branches, each with its own URL.
        </p>
      )}

      <p
        style={
          SCREENS.length === 0
            ? undefined
            : {
                marginTop: 0
              }
        }
      >
        Start one:
      </p>
      <pre>{'git switch -c feat/my-idea\nyarn new:screen /my-idea SuperAdmin TbSparkles'}</pre>

      <p>
        That writes a single file in <code>src/screens/</code>. Point <code>meta.nav</code> at a group and an icon and the row appears in the sidebar:
      </p>
      <pre>
        {`export const meta = {
  path: '/my-idea',
  title: 'My Idea',
  nav: { parent: 'SuperAdmin', icon: 'TbSparkles' }
}`}
      </pre>

      <p
        style={{
          marginBottom: 0
        }}
      >
        Push the branch and it deploys to its own link. Nothing else to edit.
      </p>
    </div>
  </>
)
