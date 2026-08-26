#!/usr/bin/env node
/**
 * Scaffold a screen.
 *
 *   yarn new:screen /broadcast-studio                      new route, top-level nav row
 *   yarn new:screen /broadcast-studio SuperAdmin GrAnnounce  nested under a group, with an icon
 *   yarn new:screen /clients                               path already in nav.json — no nav block needed
 *
 * If the path is already a `to` in nav.json, the real sidebar row links to the
 * new screen on its own, so the generated file gets no `meta.nav`. Otherwise a
 * `meta.nav` block is written and the row appears where you asked for it.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const [path, parent, icon] = process.argv.slice(2)

if (!path?.startsWith('/')) {
  console.error('Usage: yarn new:screen /some/path [ParentGroupKey] [IconName]')
  process.exit(1)
}

const root = resolve(import.meta.dirname, '..')
const nav = JSON.parse(readFileSync(resolve(root, 'src/kit/nav.json'), 'utf8'))
const iconSource = readFileSync(resolve(root, 'src/kit/icons.ts'), 'utf8')

const groups = nav.items
const flat = groups.flatMap((group) => [
  group,
  ...(group.items ?? [])
])
const navEntry = flat.find((item) => item.to === path)

if (parent !== undefined && !groups.some((group) => group.key === parent)) {
  console.error(`'${parent}' is not a nav group. Available:\n  ${groups.map((g) => g.key).join('\n  ')}`)
  process.exit(1)
}

// Icon names live in the NAV_ICONS map; read them rather than importing TS.
const knownIcons = new Set(
  [
    ...iconSource.matchAll(/^\s{2}([A-Z][A-Za-z0-9]+),?$/gm)
  ].map((m) => m[1])
)
if (icon !== undefined && !knownIcons.has(icon)) {
  console.error(`'${icon}' is not in src/kit/icons.ts.`)
  console.error('Add its import + map entry there first, or pick one of:')
  console.error(
    `  ${[
      ...knownIcons
    ]
      .sort()
      .join(', ')}`
  )
  process.exit(1)
}

const title =
  navEntry?.label ??
  path
    .split('/')
    .filter(Boolean)
    .pop()
    .replace(/(^|-)(\w)/g, (_, d, c) => (d ? ' ' : '') + c.toUpperCase())
const name = (navEntry?.key ?? title).replace(/[^A-Za-z0-9]/g, '')
const file = resolve(root, `src/screens/${name}.tsx`)

if (existsSync(file)) {
  console.error(`src/screens/${name}.tsx already exists.`)
  process.exit(1)
}

// A path already in nav.json is reachable from its real row, so adding a
// meta.nav there would duplicate it.
const navBlock =
  navEntry !== undefined ? '' : `,\n  nav: {\n${parent !== undefined ? `    parent: '${parent}',\n` : ''}    icon: '${icon ?? 'TbSparkles'}'\n  }`

writeFileSync(
  file,
  `/**
 * ${navEntry !== undefined ? `Stands in for the portal's ${navEntry.label} page.` : 'New route — no portal page behind this yet.'}
 */
export const meta = {
  path: '${path}',
  title: '${title}'${navBlock}
}

export default function ${name}() {
  return (
    <div className='card'>
      <p style={{ margin: 0 }}>Replace this with the real layout.</p>
    </div>
  )
}
`
)

console.log(`created src/screens/${name}.tsx  ->  ${path}`)
if (navEntry !== undefined) {
  console.log(`The existing "${navEntry.label}" nav row now links here — no meta.nav needed.`)
} else if (parent !== undefined) {
  console.log(`A "${title}" row will appear under ${parent} with the ${icon ?? 'TbSparkles'} icon.`)
} else {
  console.log(`A top-level "${title}" row will appear in the sidebar.`)
  console.log(`Pass a group key second to nest it, e.g. yarn new:screen ${path} SuperAdmin GrAnnounce`)
}
