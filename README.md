# GeoH UX Kit

A prototyping harness for GeoH product and UX work.

Mock a portal screen, get a shareable link, hand developers something more precise
than a Figma frame. No API, no auth, no external services.

```bash
npm install
npm run dev
```

## What you get for free

The **real GeoH navigation**, transcribed from the portal's own nav data —
13 groups, 54 entries, with permission gating, active-route highlighting, the
collapsed icon rail, and the tablet/phone overlay behaviour. Plus a toolbar,
a "Viewing as" persona switcher, and routing.

The sidebar always shows the *whole* portal. Rows you haven't mocked are greyed
out; each screen you build lights its row up. Coverage is visible in the chrome
instead of tracked in a spreadsheet.

## Adding a screen

```bash
npm run new:screen /clients/view
```

Creates one file in `src/screens/`. A default export plus a `meta` export is the
entire contract — no router to edit, no registry to update.

## Sharing

Every view is a URL, including the persona:

```
/broadcast-studio?as=executive-approver
```

## Commands

| | |
|---|---|
| `npm run dev` | dev server |
| `npm run check` | types + guardrails |
| `npm run new:screen <path>` | scaffold a screen |
| `npm run gen:tokens ~/Work/geoh` | regenerate design tokens from geoh |

## Design tokens

`src/kit/tokens.css` is generated from geoh's `apps/web/src/theme.ts` — 258 tokens,
the actual production values. Use `var(--web-primary-color)`, never `#2699FB`.
`npm run check` enforces this.

Contributors: read [CLAUDE.md](./CLAUDE.md).
