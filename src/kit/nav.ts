import navFile from './nav.json'
import { SCREENS, isMocked } from './screens.ts'
import type { NavFile, NavItem } from './types.ts'

const NAV = navFile as NavFile

/** Insert `entry` into `siblings`, after the item keyed `after` when given. */
const insert = (siblings: Array<NavItem>, entry: NavItem, after: string | undefined): Array<NavItem> => {
  const index = after === undefined ? -1 : siblings.findIndex((item) => item.key === after)
  if (index === -1)
    return [
      ...siblings,
      entry
    ]
  return [
    ...siblings.slice(0, index + 1),
    entry,
    ...siblings.slice(index + 1)
  ]
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
  let items: Array<NavItem> = NAV.items.map((group) => ({
    ...group,
    items: group.items && [
      ...group.items
    ]
  }))

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
      throw new Error(`${screen.file}: meta.nav.parent '${parent}' is not a nav group. Available groups: ${known}`)
    }
    group.items = insert(group.items ?? [], entry, after)
  }

  return items
}

/**
 * The nav tree.
 *
 * Everything is shown. geoh filters this by permission, level and feature
 * flag; reproducing that needs an identity to filter against, which `main`
 * deliberately does not have. A role-aware branch can add it back — the gates
 * are still recorded on every entry in nav.json.
 */
export const visibleNav = (): Array<NavItem> => mergedNav()

/** Every path this item should light up for. */
export const routesFor = (item: NavItem): Array<string> =>
  item.routes ??
  (item.to === undefined
    ? []
    : [
        item.to
      ])

/**
 * Active when the path equals one of the item's routes or sits beneath it. The
 * `/` guard stops `/claims/payments` from also lighting `/claims/payment-batch`.
 */
export const isActive = (item: NavItem, pathname: string): boolean => routesFor(item).some((route) => pathname === route || pathname.startsWith(`${route}/`))

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
    .flatMap((group) => [
      group,
      ...(group.items ?? [])
    ])
    .filter((item) => item.to !== undefined)
