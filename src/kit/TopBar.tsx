import { MdArrowDropDown, MdMenu, MdSearch } from 'react-icons/md'
import { Logo } from './Logo.tsx'
import type { LayoutState } from './useLayout.ts'
import { USER } from './user.ts'

const ICON_MEDIUM = 21

/** Left cell of the header row — spans the sidebar's width and holds the drawer toggle. */
export const LogoBar = ({ className, layout }: { className?: string; layout: LayoutState }) => (
  <div className={`${className ?? ''} logo-bar`}>
    {!layout.sidebarCollapsed && (
      <span className='logo-bar__mark'>
        <Logo />
      </span>
    )}
    <button type='button' className='logo-bar__drawer' onClick={layout.toggleSidebar} aria-label='Toggle navigation'>
      <MdMenu size={24} />
    </button>
  </div>
)

export const SearchBar = ({ className }: { className?: string }) => (
  <div className={`${className ?? ''} search-bar`}>
    <MdSearch size={ICON_MEDIUM} />
    <span className='search-bar__text'>Search Everything (Ctrl + F / Cmd + F)…</span>
  </div>
)

/**
 * Header avatar. Round, with the dropdown caret geoh hangs off its bottom-right
 * corner — the affordance that says the user menu opens here.
 */
export const UserBar = ({ className }: { className?: string }) => (
  <div className={`${className ?? ''} user-bar`}>
    <span
      className='avatar'
      style={{
        background: USER.avatarColor,
        width: 35,
        height: 35,
        fontSize: 13
      }}
    >
      {USER.initials}
      <span className='avatar__caret'>
        <MdArrowDropDown size={17} />
      </span>
    </span>
  </div>
)

/** Shown instead of the search bar at the Min breakpoint. */
export const MobileHeader = ({ className }: { className?: string }) => (
  <div className={`${className ?? ''} mobile-header`}>
    <MdSearch size={ICON_MEDIUM} color='var(--web-icon-dark-color)' />
  </div>
)
