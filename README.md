# GeoH UX Kit

A prototyping harness for GeoH product and UX work.

Mock a screen, get a shareable link, hand developers something more precise than
a Figma frame. No API, no auth, no external services.

```bash
npm install
npm run dev
```

## What you get for free

The **real GeoH chrome** — sidebar, top bar, right-hand rail — rebuilt from the
portal's own layout source rather than redrawn: geoh's five-column grid, its
nav-row states, its three breakpoints, and the full navigation tree (13 groups,
54 entries) with permission gating and active-route highlighting.

## Adding a screen

```bash
npm run new:screen /broadcast-studio SuperAdmin GrAnnounce
```

One file in `src/screens/`:

```tsx
export const meta = {
  path: '/broadcast-studio',
  title: 'Broadcast Studio',
  nav: { parent: 'SuperAdmin', icon: 'GrAnnounce', after: 'CompanyList' }
}

export default function BroadcastStudio() { … }
```

Point `meta.nav` at a group and an icon and the row appears there. Click the
megaphone, you're on the page. No nav file to edit, no router to register with.

## Sharing

Every view is a URL, persona included:

```
/broadcast-studio?as=executive-approver
```

## Commands

| | |
|---|---|
| `npm run dev` | dev server |
| `npm run check` | types + guardrails |
| `npm run new:screen <path> [group] [icon]` | scaffold a screen |
| `npm run gen:tokens ~/Work/geoh` | regenerate design tokens from geoh |

Contributors: read [CLAUDE.md](./CLAUDE.md).
