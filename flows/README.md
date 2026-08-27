# Flows

Playwright flows that record a screen in action, for sharing a video instead
of a static link — through Slack, in a PR, wherever a live deployed URL
doesn't reach.

This directory is empty on `main`, same convention as `src/screens/`: `main`
is the harness, flows are built on a `feat/` branch alongside the screen they
demonstrate, and there is nothing here to clean up before merging back.

Centralized here rather than one flow file per screen, because a flow can
walk across multiple screens — a screen never has to know it's being
recorded, and a flow isn't limited to the screen it starts on.

```bash
yarn record my-flow
```

runs `flows/my-flow.flow.mjs` through `scripts/record-flow.mjs` and writes a
`.webm` to `exports/my-flow/`. `exports/` is gitignored — recordings are
share artifacts, never source, and never get committed.

## Writing a flow

One file per flow. It needs exactly two exports:

```js
export const meta = {
  path: '/my-screen'   // where the recording starts
}

export default async function run(page) {
  // ordinary Playwright Page API — fill, click, waitFor, etc.
}
```

`record-flow.mjs` boots the dev server, opens `meta.path`, calls `run(page)`,
and saves the video when it returns. There is no bespoke flow DSL — whatever
Playwright's `Page`/`Locator` API can do belongs directly in `run`. Prefer
`getByRole` / `getByLabel` / `getByText` to find things the way a user would;
reach for `data-testid` only when a control has no accessible name or role
worth targeting.

`yarn record <name> --viewport=WIDTHxHEIGHT` overrides the default 1440×900
capture size.

## Recording goes through the Screencast API, not plain video capture

`record-flow.mjs` records with `page.screencast`, Playwright's own API for
this (added in 1.59), not context-level `recordVideo`. This matters because
`page.screencast` comes with narration built in — a recording doesn't have to
be hand-slowed to be watchable, Playwright already ships the primitives for
that. Two things were tried and rejected before landing here, worth knowing
so nobody re-discovers them the hard way:

- **Monkey-patching `Locator.prototype.click`/`fill`** to add a manual
  highlight-and-pause before each action. It worked, but `Locator.clear()` is
  implemented internally as `fill('')` — patching `fill` and then calling
  `this.clear()` from inside that patch recurses forever. If you ever do need
  to intercept a Locator method, clear via the *original* captured method,
  never via another Locator method that might call back into your patch.
- **Passing `slowMo` to `chromium.launch()`** alongside a per-character typing
  delay. `slowMo` throttles *every* low-level input event — mousemoves,
  individual keydown/keyup pairs — so it stacks multiplicatively with
  character-by-character typing and turns a few seconds of flow into several
  minutes. Don't combine the two; pace typing with `pressSequentially`'s own
  `delay` option instead and leave `slowMo` off entirely.

## The Screencast API, with real defaults

`record-flow.mjs` calls `page.screencast.showActions({ cursor: 'pointer' })`
once, before running the flow. From then on every action narrates itself: a
cursor animates from the previous action's point to the next one, and a
label names the action (`Fill "..."`, `Click`). Its real defaults — confirmed
against Playwright's own API reference, not guessed — are `duration: 500`,
`position: 'top-right'`, `fontSize: 24`. `--action-duration=` overrides the
hold time; `--action-duration=0` disables self-pacing for a quick sanity
check.

The full method surface, for reference:

| Method | What it does |
| --- | --- |
| `screencast.start({ path, size, quality, onFrame })` → `Disposable` | Starts recording. `path` writes a file; `onFrame` streams JPEG frames; both can be combined. |
| `screencast.stop()` | Stops and finalizes the video. |
| `screencast.showActions({ cursor, duration, fontSize, position })` → `Disposable` | Auto-narrates every subsequent action with a cursor + label. |
| `screencast.showChapter(title, { description, duration })` | Centered, blurred-backdrop title card. **Blocks the calling code** until `duration` elapses (default 2000ms), then auto-removes. Use it to mark a new section. |
| `screencast.showOverlay(html, { duration })` → `Disposable` (if no `duration`) | Arbitrary HTML injected over the page, `pointer-events: none` so it never blocks a subsequent click or fill. Stays until `duration` elapses or `.dispose()` is called. |
| `screencast.showOverlays()` / `hideOverlays()` | Show/hide all current overlays without removing them. |
| `screencast.hideActions()` | Removes the `showActions` decoration state entirely — not a toggle, re-enabling needs another `showActions()` call. |

One field exists in the installed package's type definitions but nowhere
else: an `annotate` option on `screencast.start()` itself, shaped like
`showActions`'s options. It was tried directly — passed to `start()` with no
`showActions()` call at all — and produced no visible effect anywhere in the
recording. Treat it as dead/unimplemented in the currently installed version,
not as a documented shortcut.

**Durations are always a hardwired number you choose — nothing in the API
scales a hold time to how long the text takes to read.** `showChapter`'s
`duration` holds for the same length regardless of whether the title is two
words or twenty; same for `showActions`'s per-action `duration`. If a
recording needs longer holds for longer text, compute that yourself (e.g.
`Math.max(600, text.length * 40)`) and pass the result as the `duration` or a
`page.waitForTimeout(...)` — Playwright will not infer it.

## The hero-script pattern, for a recording meant to be shared

`showActions` alone is the quick path: write ordinary
`page.getByLabel('Name').fill('Ada')` and Playwright narrates the click/fill
automatically. That's a fine sanity-check recording. For a recording that's
actually going in a Slack message or a PR, Playwright's own bundled recording
guidance recommends going further:

- **Type, don't set.** `fill()` still sets the value in a single frame under
  the hood — only the label narrates it. Use
  `locator.pressSequentially(text, { delay: 60 })` instead, so the characters
  actually appear one at a time.
- **Point at the real element, not a guessed position.** Call
  `await locator.boundingBox()` and build a `showOverlay(html)` callout from
  those coordinates — positioned relative to where the element actually is,
  not a hardcoded pixel guess. `showActions` can only ever label the thing it
  just interacted with; it can't explain *why* something matters or point at
  something the flow isn't currently touching. `showOverlay` is for that.
- **Dispose what you show.** Call `.dispose()` on a sticky `showOverlay` (one
  with no `duration`) once its moment has passed, and on the `showActions`
  handle once the flow is done narrating — don't rely on page/context
  teardown to clean up decoration state that's still conceptually "on."

## A general pitfall worth knowing, unrelated to recording specifically

Building a multi-step flow (a wizard, a tab sequence) surfaced a real React
footgun that has nothing to do with Playwright and is easy to hit again: if a
button swaps between `type="button"` and `type="submit"` at the same position
in a conditional render (e.g. "Next" becomes "Submit" on the last step) and
the two states don't have distinct `key`s, React reuses the same DOM node and
mutates its `type` attribute in place rather than replacing it. The browser's
native click default-action reads the element's *current* type when it
evaluates what to do — which by then has already been mutated to `submit` —
so the very click that reveals the Submit button can also fire the form
submission early. Give the two button states distinct `key`s
(`key="next"` / `key="submit"`) so React remounts instead of mutating, and
this doesn't happen.

## `playwright-cli`, for poking at a screen without writing a flow

`@playwright/cli` is a devDependency here specifically so it's available
without a separate global install. Run it through yarn:

```bash
yarn playwright-cli open <url>            # start a session
yarn playwright-cli snapshot              # get element refs for the current page
yarn playwright-cli highlight <ref>       # persistent highlight + locator tooltip, until --hide
yarn playwright-cli highlight --hide      # clear it
yarn playwright-cli video-start [file]    # the CLI-level equivalent of screencast.start()
yarn playwright-cli video-chapter <title> # ...of showChapter()
yarn playwright-cli video-show-actions    # ...of showActions()
yarn playwright-cli show                  # live dashboard: session grid + full remote control
yarn playwright-cli show --annotate       # same dashboard, a "UI review / design feedback" mode
```

(A global `playwright-cli` install may instead route these through a
`playwright-cli cli <command>` shape — check `playwright-cli --help` for
whichever binary is actually on `PATH` before assuming the form above.)

Two things found while trying these against a local dev server:

- The CLI defaults to launching the `chrome` **channel**, which errors
  (`Chromium distribution 'chrome' is not found`) in an environment without a
  real Google Chrome install. Point it at a config file with
  `{ "browser": { "browserName": "chromium", "launchOptions": { "executablePath": "/path/to/chromium" } } }`
  via `--config` to use a bundled or system Chromium instead.
- `show --annotate` needs an actual display to render its dashboard window —
  it did not bind a port or produce output over a headless-only connection,
  so its behavior could not be visually confirmed in that kind of
  environment. Treat it as a workstation/local tool, not something to script
  headlessly.

The defaults and patterns above are confirmed against Playwright's own API
reference and its bundled CLI recording guide — check those directly
(`playwright.dev`, or `playwright-cli --help`) for anything not covered here.
