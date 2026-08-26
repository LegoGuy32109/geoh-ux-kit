import { useState } from 'react'
import { MdExpandLess, MdExpandMore } from 'react-icons/md'
import { Link, useLocation } from 'react-router-dom'
import { ACTION_ICON, NAV_ICONS } from './icons.ts'
import { isActive, isGroupActive, visibleNav } from './nav.ts'
import { isMocked } from './screens.ts'
import type { NavItem, Persona } from './types.ts'

const ICON_SIZE = 23
const SUB_ICON_SIZE = 19

type RowProps = {
  item: NavItem
  collapsed: boolean
  depth: 0 | 1
  onNavigate: () => void
}

/**
 * One nav row.
 *
 * Rows whose `to` has no screen behind it render as text rather than a link.
 * That is deliberate: the sidebar shows the ENTIRE real app from day one, and
 * each screen someone mocks lights its row up. Progress toward "every page
 * mocked" is visible in the chrome instead of tracked in a spreadsheet.
 */
const NavRow = ({ item, collapsed, depth, onNavigate }: RowProps) => {
  const { pathname } = useLocation()
  const Icon = NAV_ICONS[item.icon]
  const active = isActive(item, pathname)
  const mocked = isMocked(item.to)
  const label = collapsed ? (item.labelShort ?? item.label) : item.label

  const classes = [
    'nav-row',
    depth === 1 ? 'nav-row--sub' : '',
    active ? 'nav-row--active' : '',
    mocked ? '' : 'nav-row--unmocked'
  ]
    .filter(Boolean)
    .join(' ')

  const body = (
    <>
      <span className='nav-row__icon'>{Icon && <Icon size={depth === 1 ? SUB_ICON_SIZE : ICON_SIZE} />}</span>
      <span className='nav-row__label'>{label}</span>
      {item.action !== undefined && (
        <span
          className='nav-row__action'
          title={item.action.tooltip}
          // The quick-action sits inside the row's link, so stop the click from
          // also navigating to the row's own destination.
          onClick={(event) => event.preventDefault()}
        >
          <ACTION_ICON size={16} />
        </span>
      )}
    </>
  )

  if (!mocked || item.to === undefined) {
    return (
      <div className={classes} title={collapsed ? item.label : `Not mocked yet — ${item.label}`}>
        {body}
      </div>
    )
  }

  return (
    <Link to={item.to} className={classes} onClick={onNavigate} title={collapsed ? item.label : undefined}>
      {body}
    </Link>
  )
}

const NavGroup = ({ group, collapsed, onNavigate }: { group: NavItem; collapsed: boolean; onNavigate: () => void }) => {
  const { pathname } = useLocation()
  const Icon = NAV_ICONS[group.icon]
  const [open, setOpen] = useState(() => isGroupActive(group, pathname))

  if (group.items === undefined) {
    return <NavRow item={group} collapsed={collapsed} depth={0} onNavigate={onNavigate} />
  }

  const active = isGroupActive(group, pathname)
  const label = collapsed ? (group.labelShort ?? group.label) : group.label

  return (
    <>
      <button
        type='button'
        className={`nav-row${active ? ' nav-row--active' : ''}`}
        onClick={() => setOpen((current) => !current)}
        title={collapsed ? group.label : undefined}
        aria-expanded={open}
      >
        <span className='nav-row__icon'>{Icon && <Icon size={ICON_SIZE} />}</span>
        <span className='nav-row__label'>{label}</span>
        <span className='nav-row__chevron'>{open ? <MdExpandLess size={18} /> : <MdExpandMore size={18} />}</span>
      </button>
      {open &&
        group.items.map((child) => (
          <NavRow key={child.key} item={child} collapsed={collapsed} depth={1} onNavigate={onNavigate} />
        ))}
    </>
  )
}

export type SidebarProps = {
  persona: Persona
  collapsed: boolean
  /** Below desktop the sidebar floats over the content instead of sitting beside it. */
  overlay: boolean
  hidden: boolean
  onNavigate: () => void
}

export const Sidebar = ({ persona, collapsed, overlay, hidden, onNavigate }: SidebarProps) => {
  const classes = [
    'sidebar',
    collapsed ? 'sidebar--collapsed' : '',
    overlay ? 'sidebar--overlay' : '',
    hidden ? 'sidebar--hidden' : ''
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <nav className={classes} data-testid='sidebar'>
      <div className='sidebar__header'>
        <span className='sidebar__logo'>
          <span className='sidebar__logo-glyph'>◆</span>
          {!collapsed && 'GeoH'}
        </span>
      </div>

      <div className='sidebar__org'>
        <div className='sidebar__org-name'>{persona.organization}</div>
        {persona.group !== undefined && <div className='sidebar__org-group'>{persona.group}</div>}
      </div>

      <div className='sidebar__scroll'>
        {visibleNav(persona).map((group) => (
          <NavGroup key={group.key} group={group} collapsed={collapsed} onNavigate={onNavigate} />
        ))}
      </div>
    </nav>
  )
}
