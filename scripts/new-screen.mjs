#!/usr/bin/env node
/**
 * Scaffold a screen.
 *
 *   yarn new:screen /clients/view
 *   yarn new:screen /broadcast-studio "Broadcast Studio"
 *
 * If the path is already in nav.json, the title and filename are taken from the
 * real nav entry so the mock lines up with the portal automatically.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const [path, titleArg] = process.argv.slice(2)

if (!path?.startsWith('/')) {
  console.error('Usage: yarn new:screen /some/path ["Some Title"]')
  process.exit(1)
}

const root = resolve(import.meta.dirname, '..')
const nav = JSON.parse(readFileSync(resolve(root, 'src/kit/nav.json'), 'utf8'))

const flat = nav.items.flatMap((group) => [group, ...(group.items ?? [])])
const navEntry = flat.find((item) => item.to === path)

const title = titleArg ?? navEntry?.label ?? path.split('/').filter(Boolean).pop()
const name = (navEntry?.key ?? title).replace(/[^A-Za-z0-9]/g, '')
const file = resolve(root, `src/screens/${name}.tsx`)

if (existsSync(file)) {
  console.error(`${file} already exists.`)
  process.exit(1)
}

writeFileSync(
  file,
  `/**
 * ${navEntry ? `Stands in for the portal's ${navEntry.label} page.` : 'New route — no portal page behind this yet.'}
 */
export const meta = {
  path: '${path}',
  title: '${title}'
}

export default function ${name}() {
  return (
    <>
      <h1 className='page-title'>${title}</h1>
      <p className='page-subtitle'>Replace this with the real layout.</p>

      <div className='card'>Content goes here.</div>
    </>
  )
}
`
)

console.log(`created src/screens/${name}.tsx  ->  ${path}`)
if (navEntry === undefined) {
  console.log(`\nNote: ${path} is not in nav.json, so nothing in the sidebar links to it.`)
  console.log('Add an entry there if this should be reachable from the nav.')
}
