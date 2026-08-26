# GeoH UX Kit

A prototyping harness for GeoH product/UX work. Designers mock portal screens here,
share a public link, and hand developers something more precise than a Figma frame.

**It is a prototype, not the app.** No API, no auth, no external services. Data is
fixture data in the screen file. Nothing here ships.

## The one thing to understand

The **app chrome is not your problem**. The sidebar, toolbar, persona switcher,
routing, and responsive behaviour are all provided. They render the *real* GeoH
navigation, transcribed from the portal.

Your job is only ever the content of one screen.

## Adding a screen

```
yarn new:screen /clients/view
```

That is the whole workflow. It creates one file in `src/screens/`:

```tsx
export const meta = { path: '/clients/view', title: 'Client Profile' }

export default function ViewClient() {
  return <h1 className='page-title'>Client Profile</h1>
}
```

A default export plus `meta` registers the route. There is no router file to edit
and no registry to update — `src/kit/screens.ts` discovers the file. One place to
change means no second place to forget.

If `meta.path` matches a `to` in `nav.json`, the real sidebar row becomes a live
link automatically. If it doesn't (a feature the portal doesn't have yet), the
screen still works and appears under "New routes" on the home page.

## Rules

`yarn check` enforces these. Each one exists because its absence cost the
Broadcast Studio prototype real time.

**No literal colors.** Use `var(--web-…)` tokens from `src/kit/tokens.css`.
That file is generated from geoh's `apps/web/src/theme.ts`, so a token is the
actual production value, and a theme change is one regenerate away. The old
prototype accumulated 501 hardcoded hex values and a design-token file nothing
read.

**No `!important`.** If a style won't apply, the markup is wrong — fix the markup.
The old prototype's `globals.css` held 41 `!important` rules fighting Figma-generated
DOM through `:has()` selectors, and none of them survived a re-export.

**No `document.querySelector` / `textContent =`.** Render it. The old prototype
mutated nav label text directly from a `useEffect` because the sidebar was exported
markup with no prop to change. Here the sidebar takes props; `labelShort` in
`nav.json` already handles the collapsed rail.

**Never hand-edit `src/kit/tokens.css`.** It is generated. Run
`yarn gen:tokens ~/Work/geoh` and commit the diff.

**Put tunable numbers in named constants** at the top of the file, not inline.
Animation timings, delays, widths. When someone says "hold that a bit longer",
that should be a one-line edit, not a hunt.

## Layout

```
src/
  kit/           the chrome. you should rarely need to change this.
    nav.json       hand-maintained snapshot of geoh's SidebarMap
    tokens.css     GENERATED from geoh's theme.ts
    AppShell.tsx   sidebar + toolbar + content
    screens.ts     route discovery
    personas.ts    who you can view as
  screens/       one file per mocked screen. this is where you work.
scripts/
  gen-tokens.mjs      regenerate tokens.css from a geoh checkout
  new-screen.mjs      scaffold a screen
  check-guardrails.mjs
```

## Personas

The toolbar has a "Viewing as" switcher. It writes `?as=<key>` to the URL, so any
perspective is a shareable link. Personas live in `src/kit/personas.ts` — adding
one is a few lines there.

Personas gate the sidebar using the same permission/feature/level logic as the
real app (`src/kit/nav.ts`), so a Scheduler genuinely sees a Scheduler's nav.

In a screen, branch with `usePersona()`:

```tsx
const { persona, can } = usePersona()
if (can('AuthorizationView')) { … }
```

Keep one screen with branches rather than two near-identical screens.

## Keeping the snapshots current

`nav.json` and `tokens.css` are snapshots of geoh, taken 2026-08-26 against
`@geoh/portal` 10.37.222. They are committed on purpose — this repo does not
depend on a geoh checkout, and prototypes stay reproducible.

- **tokens**: `yarn gen:tokens ~/Work/geoh`, review the diff, commit.
- **nav**: diff `apps/web/src/behaviors/useSidebarBehavior.ts` against `nav.json`
  and transcribe the delta by hand. The header comment in `nav.json` records
  exactly which fields were dropped and why.

## Before you finish

Run `yarn check` (types + guardrails). If you changed anything visual, look at it
at 1440, 800, and 390 wide — the shell behaves differently at each.
