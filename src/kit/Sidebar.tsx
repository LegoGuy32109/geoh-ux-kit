import { CgChevronDoubleDown, CgChevronDoubleUp } from 'react-icons/cg'
import { MdArrowDropDown, MdInfoOutline } from 'react-icons/md'
import { Link, useLocation } from 'react-router-dom'
import { ACTION_ICON, NAV_ICONS } from './icons.ts'
import { groupTarget, isActive, isGroupActive, visibleNav } from './nav.ts'
import type { LayoutState } from './useLayout.ts'
import type { NavItem, Persona } from './types.ts'

/** theme.webIconSizeLarge / webIconSizeMedium. */
const ICON_LARGE = 23
const ICON_MEDIUM = 21

type RowProps = {
  item: NavItem
  collapsed: boolean
  /** Children of an open group get the submenu treatment. */
  submenu?: boolean
  active: boolean
  /** Rendered as a button rather than a link (group headers on mobile). */
  onClick?: () => void
  to?: string
  actionIcon?: typeof ACTION_ICON
  onNavigate?: () => void
}

const NavRow = ({ item, collapsed, submenu, active, onClick, to, actionIcon, onNavigate }: RowProps) => {
  const Icon = NAV_ICONS[item.icon]
  const ActionIcon = actionIcon ?? ACTION_ICON
  const label = collapsed ? (item.labelShort ?? item.label) : item.label

  // Every row that has a destination is a real link, whether or not a screen
  // exists behind it — so the sidebar reads exactly like the portal's. Rows
  // with no screen land on NotFound, which names the command that builds one.
  const className = [
    'nav-row',
    submenu ? 'nav-row--submenu' : '',
    active ? 'nav-row--active' : ''
  ]
    .filter(Boolean)
    .join(' ')

  const body = (
    <>
      <span className='nav-row__icon'>{Icon && <Icon size={submenu ? ICON_MEDIUM : ICON_LARGE} />}</span>
      <span className='nav-row__text'>{label}</span>
      {(item.action !== undefined || actionIcon !== undefined) && (
        <span
          className='nav-row__action'
          title={item.action?.tooltip}
          // Sits inside the row's link, so stop the click from also navigating.
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
          }}
        >
          <ActionIcon size={18} />
        </span>
      )}
    </>
  )

  const title = collapsed ? item.label : undefined

  if (onClick !== undefined) {
    return (
      <button type='button' className={className} onClick={onClick} title={title}>
        {body}
      </button>
    )
  }

  if (to === undefined) {
    return (
      <div className={className} title={title}>
        {body}
      </div>
    )
  }

  return (
    <Link to={to} className={className} onClick={onNavigate} title={title}>
      {body}
    </Link>
  )
}

/**
 * A group and its children.
 *
 * geoh expands a group when its route is active, not on a click — clicking the
 * header navigates to the group's first child, which makes it active, which
 * opens it. On Min/Mid there is no hover affordance, so the header toggles
 * instead and gets a chevron. Both behaviours are reproduced here.
 */
const NavGroup = ({
  group,
  layout,
  openKey,
  onToggle,
  onNavigate
}: {
  group: NavItem
  layout: LayoutState
  openKey: string | null
  onToggle: (key: string) => void
  onNavigate: () => void
}) => {
  const { pathname } = useLocation()
  const collapsed = layout.sidebarCollapsed

  if (group.items === undefined) {
    return <NavRow item={group} to={group.to} collapsed={collapsed} active={isActive(group, pathname)} onNavigate={onNavigate} />
  }

  const routeActive = isGroupActive(group, pathname)
  const open = layout.isMobile ? openKey === group.key : routeActive

  return (
    <div className={open ? 'nav-group nav-group--open' : 'nav-group'}>
      <NavRow
        item={
          open && !collapsed
            ? {
                ...group,
                action: undefined
              }
            : group
        }
        collapsed={collapsed}
        active={routeActive && (collapsed || (layout.isMobile && !open))}
        to={layout.isMobile ? undefined : groupTarget(group)}
        onClick={layout.isMobile ? () => onToggle(group.key) : undefined}
        actionIcon={layout.isMobile ? (open ? CgChevronDoubleUp : CgChevronDoubleDown) : undefined}
        onNavigate={onNavigate}
      />
      {open &&
        group.items.map((child) => (
          <NavRow key={child.key} item={child} to={child.to} collapsed={collapsed} submenu active={isActive(child, pathname)} onNavigate={onNavigate} />
        ))}
    </div>
  )
}

export type SidebarProps = {
  className?: string
  persona: Persona
  layout: LayoutState
  openKey: string | null
  onToggleGroup: (key: string) => void
}

export const Sidebar = ({ className, persona, layout, openKey, onToggleGroup }: SidebarProps) => {
  const collapsed = layout.sidebarCollapsed
  // Following a link on a floating sidebar should close it — otherwise it
  // covers the screen the reviewer just asked to see.
  const onNavigate = () => layout.dismiss()

  return (
    <div className={`${className ?? ''} sidebar${collapsed ? ' sidebar--collapsed' : ''}`} data-testid='sidebar'>
      <div className='org'>
        <span
          className='avatar org__avatar'
          style={{
            background: persona.avatarColor
          }}
        >
          {persona.initials}
        </span>
        <span className='org__text'>
          <span className='org__agency'>{persona.organization}</span>
          <br />
          <span className='org__user'>{persona.name}</span>
        </span>
        <span className='org__caret'>
          <MdArrowDropDown size={ICON_MEDIUM} />
        </span>
      </div>

      <div className='group-switch'>
        <span>
          <span className='group-switch__label'>Group: </span>
          <span className='group-switch__value'>{persona.group}</span>
        </span>
        <span className='group-switch__caret'>
          <MdArrowDropDown size={ICON_MEDIUM} />
        </span>
      </div>

      <div className='sidebar__scroll'>
        {visibleNav(persona).map((group) => (
          <NavGroup key={group.key} group={group} layout={layout} openKey={openKey} onToggle={onToggleGroup} onNavigate={onNavigate} />
        ))}

        {/* geoh pins a Help link to the bottom of the nav list. */}
        <NavRow
          item={{
            key: 'help',
            label: 'Help',
            icon: 'MdSupportAgent'
          }}
          collapsed={collapsed}
          active={false}
        />
      </div>

      <div className='sidebar__version'>
        <span>Version: prototype</span>
        <MdInfoOutline size={ICON_MEDIUM} />
      </div>
    </div>
  )
}
