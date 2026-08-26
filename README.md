# GeoH UX Kit

A prototyping harness for GeoH product and UX work.

Mock a screen, get a shareable link, hand developers something more precise than
a Figma frame. No API, no auth, no external services.

```bash
corepack enable   # once per machine — pins yarn to the version in package.json
yarn install
yarn dev
```

## What you get for free

The **real GeoH chrome** — sidebar, top bar, right-hand rail — rebuilt from the
portal's own layout source rather than redrawn: geoh's five-column grid, its
nav-row states, its three breakpoints, and the full navigation tree (13 groups,
54 entries) with permission gating and active-route highlighting.

## Adding a screen

```bash
yarn new:screen /my-idea SuperAdmin TbSparkles
```

One file in `src/screens/`:

```tsx
export const meta = {
  path: '/my-idea',
  title: 'My Idea',
  nav: { parent: 'SuperAdmin', icon: 'TbSparkles' }
}

export default function MyIdea() { … }
```

Point `meta.nav` at a group and an icon and the row appears there. Click it,
you're on the page. No nav file to edit, no router to register with.

`main` ships no screens on purpose — it is the harness. Prototypes live on
`feat/` branches.

## Prototypes and branches

Every branch deploys to its own URL, so several designers can each have a live
prototype in this one repo at the same time.

| branch | lands at |
|---|---|
| `main` | `/geoh-ux-kit/main/` |
| `feat/broadcast-studio` | `/geoh-ux-kit/feat/broadcast-studio/` |

```bash
git switch -c feat/my-idea
# ...build a screen...
git push -u origin feat/my-idea
```

Pushing publishes it, and the landing page lists every live prototype
automatically. Deleting the branch removes its deployment.

## Sharing

Every view is a URL, so any screen in a prototype is a link you can paste:

```
/geoh-ux-kit/feat/my-idea/my-idea
```

## Commands

| | |
|---|---|
| `yarn dev` | dev server |
| `yarn check` | types + guardrails |
| `yarn new:screen <path> [group] [icon]` | scaffold a screen |
| `yarn gen:tokens ~/Work/geoh` | regenerate design tokens from geoh |
| `yarn fix` | apply Biome's formatting and safe lint fixes |

## Tooling

Yarn 4 (Corepack-pinned, `node_modules` linker) and Biome for lint + format —
the same toolchain geoh uses, with its formatting conventions: single quotes,
no semicolons, 2-space indent, 160-column lines.

Package versions are current rather than matched to geoh's, so this repo runs
React 19, React Router 7, Vite 8 and TypeScript 7.

Contributors: read [CLAUDE.md](./CLAUDE.md).
