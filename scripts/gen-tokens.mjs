#!/usr/bin/env node
/**
 * Regenerate src/kit/tokens.css from geoh's apps/web/src/theme.ts.
 *
 * This is a SNAPSHOT tool, not a build step. The kit has no dependency on a
 * geoh checkout — tokens.css is committed. Run this by hand when the real
 * theme changes, review the diff, commit it.
 *
 *   node scripts/gen-tokens.mjs ~/Work/geoh
 *
 * theme.ts is a flat object literal of `key: value` pairs, so it is parsed
 * with a regex rather than executed. If that ever stops being true this will
 * report the lines it could not read instead of silently dropping them.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const geohRoot = process.argv[2] ?? resolve(process.env.HOME, 'Work/geoh')
const themePath = resolve(geohRoot, 'apps/web/src/theme.ts')

const source = readFileSync(themePath, 'utf8')

/** `webPrimaryColor` -> `--web-primary-color` */
const toCssVar = (key) => `--${key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`

const entries = []
const skipped = []

for (const rawLine of source.split('\n')) {
  const line = rawLine.trim()
  if (!line || line.startsWith('//') || line.startsWith('export') || line === '}') continue

  // key: 'value', | key: 123, — trailing comma and trailing comment both optional
  const match = line.match(/^([A-Za-z][A-Za-z0-9]*)\s*:\s*(.+?),?\s*(?:\/\/.*)?$/)
  if (!match) {
    skipped.push(line)
    continue
  }

  const [, key, rawValue] = match
  const quoted = rawValue.match(/^'(.*)'$/)
  // Bare numbers in theme.ts are pixel counts (heights, widths, icon sizes).
  const value = quoted ? quoted[1] : /^\d+$/.test(rawValue) ? `${rawValue}px` : null

  if (value === null) {
    skipped.push(line)
    continue
  }

  entries.push([
    toCssVar(key),
    value,
    key
  ])
}

const body = entries.map(([cssVar, value]) => `  ${cssVar}: ${value};`).join('\n')

const out = `/*
 * GENERATED FILE — do not edit by hand.
 *
 * Snapshot of geoh's apps/web/src/theme.ts, taken $(date).
 * Regenerate with:  node scripts/gen-tokens.mjs <path-to-geoh>
 *
 * Naming: theme.ts \`webPrimaryColor\` becomes \`--web-primary-color\`.
 * Bare numbers in theme.ts are pixel counts and are emitted with a px unit.
 *
 * ${entries.length} tokens.
 */

:root {
${body}
}
`.replace('$(date)', new Date().toISOString().slice(0, 10))

writeFileSync(resolve(import.meta.dirname, '../src/kit/tokens.css'), out)

console.log(`wrote ${entries.length} tokens from ${themePath}`)
if (skipped.length) {
  console.warn(`\n${skipped.length} line(s) could not be parsed and were skipped:`)
  for (const line of skipped) console.warn(`  ${line}`)
}
