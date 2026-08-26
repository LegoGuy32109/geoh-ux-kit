import type { ComponentType } from 'react'
import type { ScreenNav } from './types.ts'

/**
 * Every screen this prototype mocks.
 *
 * A screen is one file in `src/screens/`. It default-exports a component and
 * named-exports `meta`:
 *
 *   export const meta = {
 *     path: '/broadcast-studio',
 *     title: 'Broadcast Studio',
 *     nav: { parent: 'SuperAdmin', icon: 'GrAnnounce', after: 'CompanyList' }
 *   }
 *
 * `nav` is what puts the row in the sidebar — pick a parent group and an icon
 * and it appears there. Drop the file in, click the icon, you are on the page.
 * Leave `nav` off and the screen is reachable by URL only; that is right when
 * the path already exists in nav.json, since the real row then links to it.
 */
export type ScreenMeta = {
  /** geoh route this screen stands in for. Must start with '/'. */
  path: string
  /** Shown in the page toolbar and the browser tab. */
  title: string
  /** Where this screen sits in the sidebar. Omit if nav.json already has the path. */
  nav?: ScreenNav
}

export type Screen = ScreenMeta & {
  Component: ComponentType
  /** Source file, so tooling can point at what to open. */
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
