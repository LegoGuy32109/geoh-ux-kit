import { MdMenu, MdSearch } from 'react-icons/md'
import { PERSONAS } from './personas.ts'
import type { LayoutState } from './useLayout.ts'
import type { Persona } from './types.ts'

const ICON_MEDIUM = 21

/** Left cell of the header row — spans the sidebar's width and holds the drawer toggle. */
export const LogoBar = ({ className, layout }: { className?: string; layout: LayoutState }) => (
  <div className={`${className ?? ''} logo-bar`}>
    {!layout.sidebarCollapsed && (
      <span className='logo-bar__mark'>
        GE<span className='logo-bar__mark-dot'>◉</span>H
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
 * "Viewing as" — the shape the Broadcast Studio prototype settled on after
 * trying two separate URLs. Writes `?as=` so a perspective stays linkable.
 */
export const PersonaSwitch = ({
  persona,
  onPersonaChange,
  compact
}: {
  persona: Persona
  onPersonaChange: (key: string) => void
  compact?: boolean
}) => (
  <div className={`segmented${compact === true ? ' segmented--compact' : ''}`}>
    {PERSONAS.map((option) => (
      <button
        type='button'
        key={option.key}
        className={`segmented__option${option.key === persona.key ? ' segmented__option--active' : ''}`}
        onClick={() => onPersonaChange(option.key)}
      >
        {compact === true ? option.compactName : option.shortName}
      </button>
    ))}
  </div>
)

export const OptionsBar = ({
  className,
  persona,
  onPersonaChange
}: {
  className?: string
  persona: Persona
  onPersonaChange: (key: string) => void
}) => (
  <div className={`${className ?? ''} options-bar`}>
    <PersonaSwitch persona={persona} onPersonaChange={onPersonaChange} />
  </div>
)

export const UserBar = ({ className, persona }: { className?: string; persona: Persona }) => (
  <div className={`${className ?? ''} user-bar`}>
    <span className='avatar' style={{ background: persona.avatarColor, width: 36, height: 36, fontSize: 13 }}>
      {persona.initials}
    </span>
  </div>
)

/**
 * Shown instead of the search bar at the Min breakpoint. The `options` column
 * collapses at that width, so the persona switch moves in here rather than
 * disappearing — a reviewer on a phone still needs both perspectives.
 */
export const MobileHeader = ({
  className,
  persona,
  onPersonaChange
}: {
  className?: string
  persona: Persona
  onPersonaChange: (key: string) => void
}) => (
  <div className={`${className ?? ''} mobile-header`}>
    <MdSearch size={ICON_MEDIUM} color='var(--web-icon-dark-color)' />
    <span className='mobile-header__spacer' />
    <PersonaSwitch persona={persona} onPersonaChange={onPersonaChange} compact />
  </div>
)
