#!/usr/bin/env node
/**
 * The rules in CLAUDE.md, enforced.
 *
 * A convention nothing checks is a convention that erodes. Each rule here
 * exists because its absence produced a specific, expensive mess in the
 * Broadcast Studio prototype — the reason is in the message, so whoever trips
 * the rule learns why rather than just working around it.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const srcDir = resolve(root, 'src')

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })

const files = walk(srcDir).filter((file) => /\.(tsx?|css)$/.test(file))

const problems = []
const report = (file, line, rule, detail) =>
  problems.push({ file: relative(root, file), line, rule, detail })

for (const file of files) {
  // tokens.css is generated from geoh's theme and is the one place literal
  // colors are allowed — it is where they come from.
  const isTokens = file.endsWith('kit/tokens.css')
  const lines = readFileSync(file, 'utf8').split('\n')

  lines.forEach((text, index) => {
    const line = index + 1
    if (text.trimStart().startsWith('*') || text.trimStart().startsWith('//')) return

    if (!isTokens) {
      const hex = text.match(/#[0-9a-fA-F]{3,8}\b/)
      if (hex) {
        report(file, line, 'no-literal-colors', `${hex[0]} — use a var(--web-…) token from tokens.css instead. Literal hex is why the old prototype had 501 of them and no working theme.`)
      }
    }

    if (text.includes('!important')) {
      report(file, line, 'no-important', 'Restyle the component instead. `!important` chains are how the old prototype ended up with 41 of them fighting generated markup.')
    }

    // main.tsx's `getElementById('root')` is React's mount point — the one DOM
    // read with no alternative. Everything else must go through props or state.
    const isMountLookup = file.endsWith('src/main.tsx') && text.includes("getElementById('root')")

    if (!isMountLookup && /document\.(querySelector|getElementById|getElementsBy)/.test(text)) {
      report(file, line, 'no-dom-surgery', 'Reach for props or state. Direct DOM reads/writes against React are unmaintainable — the old prototype rewrote nav labels this way.')
    }

    if (/\.(textContent|innerHTML)\s*=/.test(text)) {
      report(file, line, 'no-dom-surgery', 'Render this instead of assigning to the DOM node.')
    }
  })
}

// Every screen must declare a `meta` with a path, or it silently never routes.
for (const file of files.filter((f) => f.includes('/screens/') && f.endsWith('.tsx'))) {
  const source = readFileSync(file, 'utf8')
  if (!/export const meta\s*=/.test(source)) {
    report(file, 1, 'screen-needs-meta', "Add `export const meta = { path: '/…', title: '…' }` — that is what registers the route.")
  }
  if (!/export default/.test(source)) {
    report(file, 1, 'screen-needs-default-export', 'Add a default-exported component.')
  }
}

if (problems.length === 0) {
  console.log(`guardrails: ${files.length} files checked, all clear`)
  process.exit(0)
}

console.error(`guardrails: ${problems.length} problem(s)\n`)
for (const { file, line, rule, detail } of problems) {
  console.error(`  ${file}:${line}  [${rule}]`)
  console.error(`    ${detail}\n`)
}
process.exit(1)
