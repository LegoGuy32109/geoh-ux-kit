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
  /**
   * Extra paths that should light this item as active, beyond `to`.
   * Defaults to `[to]`. Matches geoh's `routes` field.
   */
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
}

export type NavFile = {
  $comment?: Array<string>
  items: Array<NavItem>
}

/** Who is viewing. Drives nav gating and the avatar in the toolbar. */
export type Persona = {
  key: string
  name: string
  /** Shown under the persona name in the switcher — their job, in plain words. */
  title: string
  initials: string
  avatarColor: string
  organization: string
  group?: string
  level: 'SuperAdmin' | 'Admin' | 'Staff'
  /** `'*'` grants everything. */
  permissions: Array<string> | '*'
  features: Array<string> | '*'
}
