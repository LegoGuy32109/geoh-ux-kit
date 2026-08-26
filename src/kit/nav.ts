import navFile from './nav.json'
import type { Gate, NavFile, NavItem, Persona } from './types.ts'

const NAV = navFile as NavFile

/** Levels are ordered — having a higher one satisfies a lower requirement. */
const LEVEL_RANK: Record<string, number> = { Staff: 0, Admin: 1, SuperAdmin: 2 }

const asList = (gate: Gate | undefined): Array<string> =>
  gate === undefined ? [] : Array.isArray(gate) ? gate : [gate]

/** `'*'` grants everything; otherwise ANY of the required keys is enough — matching geoh's hasPermission/hasAnyFeature. */
const granted = (held: Array<string> | '*', required: Gate | undefined): boolean => {
  const needed = asList(required)
  if (needed.length === 0) return true
  if (held === '*') return true
  return needed.some((key) => held.includes(key))
}

const hasLevel = (persona: Persona, required: string | undefined): boolean =>
  required === undefined || (LEVEL_RANK[persona.level] ?? 0) >= (LEVEL_RANK[required] ?? 0)

/**
 * Port of the filter at the bottom of geoh's useSidebarBehavior.
 *
 * Two rules carried over deliberately, because they are what make the real nav
 * feel right rather than merely complete:
 *   - a group whose children are ALL filtered out disappears entirely, even if
 *     the group's own gates pass;
 *   - `enforce: 'featureOrPermission'` inverts the default AND for the one item
 *     that needs it (Schedule), where the feature flag RESTRICTS rather than grants.
 */
const passes = (item: NavItem, persona: Persona): boolean => {
  const feature = granted(persona.features, item.feature)
  const permission = granted(persona.permissions, item.permission)
  const level = hasLevel(persona, item.level)

  if (item.enforce === 'featureOrPermission') return !feature || permission
  return feature && permission && level
}

/** The nav tree this persona can see. */
export const visibleNav = (persona: Persona): Array<NavItem> =>
  NAV.items.flatMap((group) => {
    if (group.items === undefined) return passes(group, persona) ? [group] : []

    const items = group.items.filter((child) => passes(child, persona))
    if (items.length === 0) return []
    return passes(group, persona) ? [{ ...group, items }] : []
  })

/** Every path this item should light up for. */
export const routesFor = (item: NavItem): Array<string> =>
  item.routes ?? (item.to === undefined ? [] : [item.to])

/**
 * Active when the current path equals one of the item's routes, or sits beneath
 * it. The `/` guard stops `/claims/payments` from also lighting `/claims/payment-batch`.
 */
export const isActive = (item: NavItem, pathname: string): boolean =>
  routesFor(item).some((route) => pathname === route || pathname.startsWith(`${route}/`))

export const isGroupActive = (group: NavItem, pathname: string): boolean =>
  isActive(group, pathname) || (group.items ?? []).some((child) => isActive(child, pathname))

/** Every nav destination, flattened — used to report mock coverage. */
export const allNavDestinations = (): Array<NavItem> =>
  NAV.items.flatMap((group) => [group, ...(group.items ?? [])]).filter((item) => item.to !== undefined)
