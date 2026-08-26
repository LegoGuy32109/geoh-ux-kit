#!/usr/bin/env node
/**
 * Boot the dev server, drive one flow with Playwright, save the video.
 *
 *   yarn record my-flow
 *   yarn record my-flow --viewport=1280x800
 *   yarn record my-flow --action-duration=0   # no self-pacing, full speed
 *
 * Reads flows/<name>.flow.mjs — a `meta.path` (the route to open) and a
 * default-exported `async function run(page)` that drives Playwright's Page
 * API directly. No bespoke DSL: whatever Playwright can do, a flow can do,
 * including narrating itself with `page.screencast.showChapter(...)`.
 *
 * Recording goes through Playwright's own Screencast API (1.59+), not
 * context-level video capture — `showActions` gives every click and fill a
 * real animated cursor and an on-screen action label for free, which is why
 * a flow reads like a fast, silent test but the recording doesn't. See
 * flows/README.md.
 *
 * Output lands at exports/<name>/<name>-<timestamp>.webm. exports/ is
 * gitignored — these are share artifacts, not source.
 */
import { mkdirSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const root = resolve(import.meta.dirname, '..')

const [name, ...rest] = process.argv.slice(2)
if (!name) {
  console.error('Usage: yarn record <flow-name> [--viewport=WIDTHxHEIGHT] [--action-duration=MS]')
  const available = readdirSync(resolve(root, 'flows')).filter((f) => f.endsWith('.flow.mjs'))
  if (available.length > 0) {
    console.error('Available flows:')
    for (const f of available) console.error(`  ${f.replace(/\.flow\.mjs$/, '')}`)
  }
  process.exit(1)
}

const flag = (key, fallback) => {
  const arg = rest.find((a) => a.startsWith(`--${key}=`))
  return arg ? arg.slice(key.length + 3) : fallback
}

const [width, height] = flag('viewport', '1440x900').split('x').map(Number)
// Same default Playwright's own showActions() uses (500ms) — override with
// --action-duration if a recording needs to hold longer per step.
const actionDuration = Number(flag('action-duration', '500'))

const flowFile = resolve(root, `flows/${name}.flow.mjs`)
const { meta, default: run } = await import(flowFile)
if (typeof run !== 'function') {
  console.error(`flows/${name}.flow.mjs must have a default-exported async function run(page)`)
  process.exit(1)
}

const server = await createServer({
  root,
  server: {
    port: 0
  }
})
await server.listen()
const port = server.config.server.port
const baseUrl = `http://localhost:${port}`

const outDir = resolve(root, `exports/${name}`)
mkdirSync(outDir, {
  recursive: true
})
const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
const outPath = resolve(outDir, `${name}-${timestamp}.webm`)

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: {
    width,
    height
  }
})
const page = await context.newPage()

let actions
try {
  await page.goto(`${baseUrl}${meta?.path ?? '/'}`, {
    waitUntil: 'networkidle'
  })
  await page.screencast.start({
    path: outPath,
    size: {
      width,
      height
    }
  })
  actions = await page.screencast.showActions({
    cursor: 'pointer',
    duration: actionDuration
  })
  await run(page)
} finally {
  // Dispose the showActions handle before stopping, per Playwright's own
  // guidance — don't rely on page/context teardown to clean up decoration
  // state that's still live.
  await actions?.dispose().catch(() => {})
  await page.screencast.stop().catch(() => {})
  await context.close()
  await browser.close()
  await server.close()
  console.log(`saved ${outPath.replace(`${root}/`, '')}`)
}
