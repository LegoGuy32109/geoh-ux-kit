import navFile from './nav.json'
import { SCREENS, isMocked } from './screens.ts'
import type { Gate, NavFile, NavItem, Persona } from './types.ts'

const NAV = navFile as NavFile

/** Levels are ordered — holding a higher one satisfies a lower requirement. */
const LEVEL_RANK: Record<string, number> = { Staff: 0, Admin: 1, SuperAdmin: 2 }

const asList = (gate: Gate | undefined): Array<string> =>
  gate === undefined ? [] : Array.isArray(gate) ? gate : [gate]

/** `'*'` grants everything; otherwise ANY required key is enough — matching geoh's hasPermission/hasAnyFeature. */
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
 * Two rules carried over deliberately, because they are what make the nav feel
 * right rather than merely complete: a group whose children ALL filter out
 * disappears even if the group's own gates pass, and `featureOrPermission`
 * inverts the default AND for the one item (Schedule) whose feature flag
 * restricts rather than grants.
 */
const passes = (item: NavItem, persona: Persona): boolean => {
  const feature = granted(persona.features, item.feature)
  const permission = granted(persona.permissions, item.permission)
  const level = hasLevel(persona, item.level)

  if (item.enforce === 'featureOrPermission') return !feature || permission
  return feature && permission && level
}

/** Insert `entry` into `siblings`, after the item keyed `after` when given. */
const insert = (siblings: Array<NavItem>, entry: NavItem, after: string | undefined): Array<NavItem> => {
  const index = after === undefined ? -1 : siblings.findIndex((item) => item.key === after)
  if (index === -1) return [...siblings, entry]
  return [...siblings.slice(0, index + 1), entry, ...siblings.slice(index + 1)]
}

/**
 * nav.json plus every row contributed by a screen's `meta.nav`.
 *
 * Screen-declared rows are merged in rather than written into nav.json, so
 * nav.json stays a clean snapshot of the real portal and prototype-only
 * features never drift into it.
 */
const mergedNav = (): Array<NavItem> => {
  // Deep-ish clone so screen-declared rows never mutate the imported JSON.
  let items: Array<NavItem> = NAV.items.map((group) => ({ ...group, items: group.items && [...group.items] }))

  for (const screen of SCREENS) {
    if (screen.nav === undefined) continue
    const { parent, label, labelShort, icon, after, permission, level, feature } = screen.nav

    const entry: NavItem = {
      key: `screen:${screen.path}`,
      label: label ?? screen.title,
      labelShort: labelShort ?? (label ?? screen.title).split(' ')[0],
      icon,
      to: screen.path,
      permission,
      level,
      feature,
      fromScreen: true
    }

    if (parent === undefined) {
      items = insert(items, entry, after)
      continue
    }

    const group = items.find((item) => item.key === parent)
    if (group === undefined) {
      const known = items.map((item) => item.key).join(', ')
      throw new Error(
        `${screen.file}: meta.nav.parent '${parent}' is not a nav group. Available groups: ${known}`
      )
    }
    group.items = insert(group.items ?? [], entry, after)
  }

  return items
}

/** The nav tree this persona can see. */
export const visibleNav = (persona: Persona): Array<NavItem> =>
  mergedNav().flatMap((group) => {
    if (group.items === undefined) return passes(group, persona) ? [group] : []

    const items = group.items.filter((child) => passes(child, persona))
    if (items.length === 0) return []
    return passes(group, persona) ? [{ ...group, items }] : []
  })

/** Every path this item should light up for. */
export const routesFor = (item: NavItem): Array<string> =>
  item.routes ?? (item.to === undefined ? [] : [item.to])

/**
 * Active when the path equals one of the item's routes or sits beneath it. The
 * `/` guard stops `/claims/payments` from also lighting `/claims/payment-batch`.
 */
export const isActive = (item: NavItem, pathname: string): boolean =>
  routesFor(item).some((route) => pathname === route || pathname.startsWith(`${route}/`))

export const isGroupActive = (group: NavItem, pathname: string): boolean =>
  isActive(group, pathname) || (group.items ?? []).some((child) => isActive(child, pathname))

/**
 * Where clicking a group header should go. geoh sends you to the group's first
 * child; we prefer the first child that is actually mocked, so a group whose
 * only built screen is third in the list still lands somewhere real.
 */
export const groupTarget = (group: NavItem): string | undefined => {
  const children = group.items ?? []
  return children.find((child) => isMocked(child.to))?.to ?? children[0]?.to
}

/** Every nav destination, flattened. */
export const allNavDestinations = (): Array<NavItem> =>
  mergedNav()
    .flatMap((group) => [group, ...(group.items ?? [])])
    .filter((item) => item.to !== undefined)
