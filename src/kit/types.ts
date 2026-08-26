/** Shapes for nav.json. Mirrors geoh's `SidebarItem` (useSidebarBehavior.ts). */

/** A permission/feature gate is either one key or a list; a list means "any of". */
export type Gate = string | Array<string>

export type NavAction = {
  tooltip: string
  to: string
  permission?: Gate
}

export type NavItem = {
  key: string
  label: string
  /** Shown instead of `label` on the collapsed rail. geoh has this field too. */
  labelShort?: string
  icon: string
  to?: string
  /** Extra paths that also light this item as active. Defaults to `[to]`. */
  routes?: Array<string>
  permission?: Gate
  level?: string
  feature?: Gate
  /**
   * Named variant of geoh's `enforce` callback. Default is "all gates must
   * pass"; `featureOrPermission` mirrors Schedule's
   * `(hasFeature, hasPermission) => !hasFeature || hasPermission`.
   */
  enforce?: 'all' | 'featureOrPermission'
  action?: NavAction
  items?: Array<NavItem>
  /** Set on entries contributed by a screen's `meta.nav` rather than nav.json. */
  fromScreen?: boolean
}

export type NavFile = {
  $comment?: Array<string>
  items: Array<NavItem>
}

/**
 * Where a screen puts itself in the sidebar.
 *
 * This is the point of the kit: you name a parent group and an icon, and the
 * nav row appears. No nav.json edit, no second file to keep in sync.
 */
export type ScreenNav = {
  /** `key` of the group to nest under, e.g. 'SuperAdmin'. Omit for a top-level row. */
  parent?: string
  /** Defaults to the screen's `title`. */
  label?: string
  /** Shown on the collapsed rail. Defaults to the first word of the label. */
  labelShort?: string
  /** Name from `src/kit/icons.ts` — e.g. 'GrAnnounce' for the megaphone. */
  icon: string
  /** Place this row after the sibling with this key. Defaults to the end of the group. */
  after?: string
  permission?: Gate
  level?: string
  feature?: Gate
}

/** Who is viewing. Drives nav gating and the avatar in the top bar. */
export type Persona = {
  key: string
  name: string
  /** Short label for the segmented switcher in the top bar. */
  shortName: string
  /** Shorter still, for the mobile header where the column collapses. */
  compactName: string
  initials: string
  avatarColor: string
  organization: string
  group: string
  level: 'SuperAdmin' | 'Admin' | 'Staff'
  /** `'*'` grants everything. */
  permissions: Array<string> | '*'
  features: Array<string> | '*'
}
