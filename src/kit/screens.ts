import type { ComponentType } from 'react'

/**
 * Every screen this prototype mocks.
 *
 * A screen is one file in `src/screens/`. It default-exports a component and
 * named-exports `meta` with the geoh route path it stands in for:
 *
 *   export const meta = { path: '/broadcast-studio', title: 'Broadcast Studio' }
 *   export default function BroadcastStudio() { ... }
 *
 * That is the whole contract. Dropping the file in registers the route — there
 * is no second place to edit, so there is no second place to forget.
 *
 * Paths should match `to` values in nav.json wherever one exists, so the real
 * nav entry becomes a live link. A screen on a path nav.json doesn't know about
 * still works; it just isn't reachable from the sidebar.
 */
export type ScreenMeta = {
  /** geoh route this screen stands in for. Must start with '/'. */
  path: string
  /** Shown in the toolbar and the browser tab. */
  title: string
  /** Optional one-liner shown on the coverage page. */
  description?: string
}

export type Screen = ScreenMeta & {
  Component: ComponentType
  /** Source file, so the coverage page can tell you what to open. */
  file: string
}

type ScreenModule = {
  default: ComponentType
  meta?: ScreenMeta
}

const modules = import.meta.glob<ScreenModule>('../screens/**/*.tsx', { eager: true })

export const SCREENS: Array<Screen> = Object.entries(modules)
  .map(([file, module]) => {
    if (module.meta === undefined) {
      throw new Error(
        `${file} is in src/screens/ but exports no \`meta\`. Add:\n` +
          `  export const meta = { path: '/some/path', title: 'Some Title' }`
      )
    }
    if (!module.meta.path.startsWith('/')) {
      throw new Error(`${file} has meta.path '${module.meta.path}' — paths must start with '/'.`)
    }
    return { ...module.meta, Component: module.default, file: file.replace('../', 'src/') }
  })
  .sort((a, b) => a.path.localeCompare(b.path))

const duplicates = SCREENS.map((s) => s.path).filter((path, i, all) => all.indexOf(path) !== i)
if (duplicates.length > 0) {
  throw new Error(`Two screens claim the same path: ${[...new Set(duplicates)].join(', ')}`)
}

export const MOCKED_PATHS = new Set(SCREENS.map((s) => s.path))
export const isMocked = (path: string | undefined): boolean => path !== undefined && MOCKED_PATHS.has(path)
