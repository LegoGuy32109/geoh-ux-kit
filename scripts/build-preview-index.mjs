#!/usr/bin/env node
/**
 * Write the landing page that lists every live prototype.
 *
 *   node scripts/build-preview-index.mjs <gh-pages-checkout>
 *
 * Called by the Pages workflow after a deployment lands. It reads the state of
 * the gh-pages tree rather than being told what exists, so the listing is
 * always whatever is actually deployed — a branch removed by the cleanup job
 * disappears from here without anyone maintaining a manifest.
 */
import { readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(process.argv[2] ?? 'gh-pages')

/** A deployment is any directory holding an index.html, one or two levels deep. */
const findDeployments = () => {
  const found = []

  for (const entry of readdirSync(root)) {
    if (entry.startsWith('.') || entry === 'index.html') continue
    const path = join(root, entry)
    if (!statSync(path).isDirectory()) continue

    if (
      statSync(join(path, 'index.html'), {
        throwIfNoEntry: false
      })?.isFile()
    ) {
      found.push(entry)
      continue
    }

    // A branch like `feat/whatever` nests one level further.
    for (const child of readdirSync(path)) {
      const childPath = join(path, child)
      if (!statSync(childPath).isDirectory()) continue
      if (
        statSync(join(childPath, 'index.html'), {
          throwIfNoEntry: false
        })?.isFile()
      ) {
        found.push(`${entry}/${child}`)
      }
    }
  }

  return found.sort()
}

const deployments = findDeployments()

// main first, then the feature branches alphabetically.
deployments.sort((a, b) => (a === 'main' ? -1 : b === 'main' ? 1 : a.localeCompare(b)))

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const describe = (slug) => {
  if (slug === 'main') return 'The shared baseline everyone branches from.'
  return `Branch <code>${escapeHtml(slug)}</code>`
}

const rows = deployments
  .map(
    (slug) => `      <li>
        <a href='./${escapeHtml(slug)}/'>${escapeHtml(slug === 'main' ? 'main' : slug.replace(/^feat\//, ''))}</a>
        <span>${describe(slug)}</span>
      </li>`
  )
  .join('\n')

const html = `<!doctype html>
<html lang='en'>
  <head>
    <meta charset='utf-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <title>GeoH UX Kit — prototypes</title>
    <link rel='preconnect' href='https://fonts.googleapis.com' />
    <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin />
    <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap' />
    <style>
      :root {
        --bg: #f8f8f8;
        --card: #ffffff;
        --border: #e5e5e5;
        --text: #334d6e;
        --muted: #8b8b8b;
        --link: #2699fb;
        --bold: #27496d;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 48px 24px;
        background: var(--bg);
        color: var(--text);
        font-family: 'Montserrat', system-ui, sans-serif;
        font-size: 14px;
        -webkit-font-smoothing: antialiased;
      }
      main { max-width: 640px; margin: 0 auto; }
      h1 { margin: 0 0 4px; font-size: 28px; color: var(--bold); }
      .sub { margin: 0 0 32px; color: var(--muted); }
      ul { list-style: none; margin: 0; padding: 0; }
      li {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 16px 20px;
        margin-bottom: 12px;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 4px;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px -1px rgb(0 0 0 / 10%);
      }
      a { color: var(--link); font-weight: 600; font-size: 16px; text-decoration: none; }
      a:hover { text-decoration: underline; }
      span { color: var(--muted); font-size: 12px; }
      code { font-family: ui-monospace, monospace; background: #f2f2f2; padding: 1px 5px; border-radius: 3px; }
      .empty { padding: 20px; background: var(--card); border: 1px solid var(--border); border-radius: 4px; color: var(--muted); }
      footer { margin-top: 32px; color: var(--muted); font-size: 12px; line-height: 1.6; }
    </style>
  </head>
  <body>
    <main>
      <h1>GeoH UX Kit</h1>
      <p class='sub'>Live prototypes. Every branch gets its own.</p>
${deployments.length === 0 ? "      <p class='empty'>Nothing deployed yet.</p>" : `      <ul>\n${rows}\n      </ul>`}
      <footer>
        Push a branch named <code>feat/&lt;something&gt;</code> and it appears here on its own URL.
        Delete the branch and it disappears.
      </footer>
    </main>
  </body>
</html>
`

writeFileSync(join(root, 'index.html'), html)
console.log(`index lists ${deployments.length} deployment(s): ${deployments.join(', ') || '(none)'}`)
