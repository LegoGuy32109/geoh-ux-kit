import { useEffect, useRef, useState } from 'react'
import { MdMenu, MdNotificationsNone, MdSearch } from 'react-icons/md'
import { usePersona } from './usePersona.tsx'
import type { Persona } from './types.ts'

const Avatar = ({ persona, size = 32 }: { persona: Persona; size?: number }) => (
  <span
    className='avatar'
    style={{ background: persona.avatarColor, width: size, height: size }}
    aria-hidden='true'
  >
    {persona.initials}
  </span>
)

/**
 * "Viewing as" switcher.
 *
 * Lives in the chrome rather than in any one screen, so every prototype gets it
 * for free and reviewers learn it once. Writes `?as=` to the URL, which is what
 * makes a given perspective linkable.
 */
const PersonaSwitcher = () => {
  const { persona, personas, setPersona } = usePersona()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current !== null && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button type='button' className='persona' onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <Avatar persona={persona} />
        <span className='persona__name'>{persona.name}</span>
      </button>

      {open && (
        <div className='persona-menu'>
          <div className='persona-menu__heading'>Viewing as</div>
          {personas.map((option) => (
            <button
              type='button'
              key={option.key}
              className={`persona-menu__option${option.key === persona.key ? ' persona-menu__option--active' : ''}`}
              onClick={() => {
                setPersona(option.key)
                setOpen(false)
              }}
            >
              <Avatar persona={option} size={28} />
              <span>
                <span className='persona-menu__option-name'>{option.name}</span>
                <br />
                <span className='persona-menu__option-title'>{option.title}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export type ToolbarProps = {
  title: string
  onHamburgerClick: () => void
  compact: boolean
}

export const Toolbar = ({ title, onHamburgerClick, compact }: ToolbarProps) => (
  <header className='toolbar'>
    <button type='button' className='toolbar__hamburger' onClick={onHamburgerClick} aria-label='Toggle navigation'>
      <MdMenu size={24} />
    </button>

    <span className='toolbar__title'>{title}</span>
    <span className='toolbar__spacer' />

    {!compact && (
      <span className='toolbar__search'>
        <MdSearch size={18} />
        Search
      </span>
    )}

    <button type='button' className='toolbar__icon-button' aria-label='Notifications'>
      <MdNotificationsNone size={22} />
    </button>

    <PersonaSwitcher />
  </header>
)
