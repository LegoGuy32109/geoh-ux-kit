# GeoH UX Kit

A prototyping harness for GeoH product/UX work. Mock a screen, share a public
link, hand developers something more precise than a Figma frame.

**It is a prototype, not the app.** No API, no auth, no external services. Data
is fixture data in the screen file. Nothing here ships.

## The one thing to understand

The **app chrome is not your problem**. The sidebar, top bar, right-hand rail,
routing, and responsive behaviour are all provided, and they are rebuilt from
geoh's own layout source — not approximated:

| Kit | Rebuilt from |
|---|---|
| `shell.css` grid | `pages/Layout/styles/LayoutStyles.ts` |
| nav row states | `pages/Layout/styles/SidebarLinkStyles.ts` |
| right rail | `pages/Layout/RealtimeSidebar.tsx` + its styles |
| breakpoints & collapse rules | `behaviors/layout/useLayoutBehavior.ts` |
| `nav.json` | `behaviors/useSidebarBehavior.ts` (`SidebarMap`) |
| `tokens.css` | `apps/web/src/theme.ts` (generated) |

Your job is only ever the content of one screen.

## Adding a screen

```
git switch -c feat/my-idea
yarn new:screen /my-idea SuperAdmin TbSparkles
```

That writes one file in `src/screens/`:

```tsx
export const meta = {
  path: '/my-idea',
  title: 'My Idea',
  nav: { parent: 'SuperAdmin', icon: 'TbSparkles' }
}

export default function MyIdea() { … }
```

**`meta.nav` is the point of the kit.** Name a parent group and an icon and the
row appears in the sidebar, in the right place, with that icon. Click it, you
are on the page. There is no nav file to edit and no router to register with.

`main` has no screens at all — it is the harness. Build on a `feat/` branch.

- `parent` — a group `key` from `nav.json` (`SuperAdmin`, `Scheduling`,
  `Billing`, `Clients`, `AgencyManagement`, …). Omit for a top-level row.
- `icon` — a name from `src/kit/icons.ts`. Add imports there to widen the palette.
- `after` — put the row after this sibling's `key`. Defaults to the end.

If the path is **already** a `to` in `nav.json` (`/clients`, `/payroll`), leave
`meta.nav` off — the real row links to your screen by itself.

Rows with no screen behind them stay in the sidebar and look exactly as they do
in the portal; clicking one lands on a page naming the command that builds it.

## Tooling

Yarn 4, pinned by the `packageManager` field and resolved through Corepack, so
there is no yarn binary in the repo. `corepack enable` once per machine, then
`yarn install`.

Biome does lint and format — no ESLint, no Prettier. `biome.json` carries geoh's
conventions: single quotes, no semicolons, 2-space indent, 160-column lines,
no trailing commas. `yarn fix` applies them; `yarn check` runs types, Biome and
the guardrails together.

Toolchain matches geoh. Package versions deliberately do not: this repo tracks
current releases (React 19, React Router 7, Vite 8, TypeScript 7) rather than
geoh's pins. A prototype has no reason to inherit an older runtime, and nothing
here is imported by the portal.

## Breakpoints

geoh's, exactly — `BreakpointUtilities` in `@geoh/presentation`:

| | width | sidebar | right rail |
|---|---|---|---|
| **Max** | ≥ 1025 | expanded, pinned; toggles to a 70px rail | collapsed to a 60px rail |
| **Mid** | 641–1024 | 70px rail; opening it floats over a scrim | 60px rail |
| **Min** | ≤ 640 | hidden; opening it floats over a scrim | hidden |

Panes never animate their width. They move between a wide grid column and a
fixed rail column, which is why nothing shifts by a pixel while collapsing.

Groups open because their route went active, not because you clicked — clicking
a group header navigates to its first mocked child. Below Max there is no hover
affordance, so headers toggle and show a chevron instead. Both are geoh's
behaviour, not an invention.

## Branches and deployment

Work on a `feat/` branch. Pushing one publishes it to its own URL under
`/geoh-ux-kit/feat/<name>/`, listed on the site's landing page; deleting the
branch removes it. `main` publishes to `/geoh-ux-kit/main/`.

`.github/workflows/pages.yml` owns this. Each run writes only into its own
subdirectory of the `gh-pages` branch, so deployments never clobber each other,
and the landing page is regenerated from whatever is actually on that branch
rather than from a manifest anyone has to maintain.

Two things the build depends on that are easy to break:

- `vite.config.ts` reads `BASE_PATH`, which the workflow sets per branch. Assets
  and the router's basename both come from it, so hardcoding `base` breaks every
  deployment except the root one.
- The app uses real paths, so deep links have no file behind them. The workflow
  copies each build's `index.html` to `404.html`, which is what makes
  `/feat/x/broadcast-studio` work. Those links load with a 404 status by design.

## Rules

`yarn check` enforces these. Each exists because its absence cost the
Broadcast Studio prototype real time.

**No literal colors.** Use `var(--web-…)` tokens from `src/kit/tokens.css`,
generated from geoh's `theme.ts`, so a token is the real production value. The
old prototype accumulated 501 hardcoded hex values and a token file nothing read.

**No `!important`.** If a style won't apply, the markup is wrong. The old
prototype's `globals.css` held 41 of them fighting generated DOM through
`:has()`, and none survived a re-export.

**No `document.querySelector` / `textContent =`.** Render it. The old prototype
rewrote nav label text from a `useEffect` because the sidebar was exported markup
with no prop to change. Here `labelShort` in `nav.json` handles the rail.

**Qualify `.layout__*` display rules with `.layout`.** Grid-placement rules and
component rules both use one class, so `.layout__search { display: none }` inside
a media query silently loses to a later `.search-bar { display: flex }` — media
queries add no specificity. This shipped two wrong-breakpoint bugs before the
check existed.

**Never hand-edit `src/kit/tokens.css`.** Run `yarn gen:tokens ~/Work/geoh`
and commit the diff. The generator pipes its own output through Biome, so what
it writes is already formatted and re-running it produces no diff.

**Put tunable numbers in named constants** at the top of the file. When someone
says "hold that a bit longer", that should be a one-line edit, not a hunt.

## Layout

```
src/
  kit/           the chrome. you should rarely need to change this.
    nav.json       hand-maintained snapshot of geoh's SidebarMap
    tokens.css     GENERATED from geoh's theme.ts
    shell.css      the grid + every chrome style
    Layout.tsx     assembles the grid areas
    Sidebar.tsx  RealtimeSidebar.tsx  TopBar.tsx
    nav.ts         gating, active-route matching, meta.nav merge
    screens.ts     route discovery
    useLayout.ts   breakpoints + collapse rules
    user.ts        the one fixed identity
  screens/       one file per mocked screen. empty on main; this is where you work.
```

## No roles on main

There is one fixed user (`src/kit/user.ts`), no role switcher, and no
permission gating: the nav shows every entry, and a screen never has to think
about who is looking at it.

The gates are still in the data. `nav.json` carries the real `permission`,
`level` and `feature` keys from geoh's SidebarMap for all 54 entries, and
`NavItem` still types them — `visibleNav()` just doesn't read them. A branch
that wants role-aware nav has everything it needs and only has to write the
filter and an identity to filter against.

## Keeping the snapshots current

`nav.json` and `tokens.css` are snapshots of geoh, taken 2026-08-26 against
`@geoh/portal` 10.37.222, committed on purpose so this repo never needs a geoh
checkout.

- **tokens**: `yarn gen:tokens ~/Work/geoh`, review the diff, commit.
- **nav**: diff `apps/web/src/behaviors/useSidebarBehavior.ts` against `nav.json`
  and transcribe the delta, then `yarn fix`. The header comment in `nav.json`
  records which fields were dropped and why.

Both files are formatted by Biome like everything else — there are no
formatter exclusions in this repo.

## Before you finish

Run `yarn check`. If you changed anything visual, look at it at 1600, 958,
and 390 wide — the chrome behaves differently in each band.
