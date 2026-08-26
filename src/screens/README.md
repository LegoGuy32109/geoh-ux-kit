# Screens

One file per mocked screen. This directory is empty on `main` on purpose —
`main` is the harness, and prototypes live on `feat/` branches.

```bash
git switch -c feat/my-idea
yarn new:screen /my-idea SuperAdmin TbSparkles
```

That writes one file here:

```tsx
export const meta = {
  path: '/my-idea',
  title: 'My Idea',
  nav: { parent: 'SuperAdmin', icon: 'TbSparkles' }
}

export default function MyIdea() {
  return <div className='card'>…</div>
}
```

A default export plus `meta` registers the route; `meta.nav` puts the row in
the sidebar. Nothing else to edit.

Push the branch and it deploys to its own URL. See the repo README.
