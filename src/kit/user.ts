/**
 * Who the prototype is signed in as.
 *
 * One fixed identity. It fills the sidebar's org block and the header avatar,
 * and nothing branches on it — `main` has no role switching and no permission
 * gating, so a screen never has to think about who is looking at it.
 *
 * Role-aware prototypes belong on their own branch, where this can grow into a
 * switcher and `nav.ts` can start gating on the `permission` / `level` /
 * `feature` fields that nav.json already carries.
 */
export type User = {
  name: string
  initials: string
  avatarColor: string
  organization: string
  group: string
}

export const USER: User = {
  name: 'John Doe',
  initials: 'JD',
  avatarColor: 'var(--web-progress-bar-success-background-color)',
  organization: 'GEOH Demonstration',
  group: 'GEOH'
}
