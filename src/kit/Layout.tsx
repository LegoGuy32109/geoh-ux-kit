import { useState, type ReactNode } from 'react'
import { IoMdArrowBack } from 'react-icons/io'
import { RealtimeSidebar, type RealtimeTab } from './RealtimeSidebar.tsx'
import { Sidebar } from './Sidebar.tsx'
import { LogoBar, MobileHeader, OptionsBar, SearchBar, UserBar } from './TopBar.tsx'
import { useLayout } from './useLayout.ts'
import { usePersona } from './usePersona.tsx'

/**
 * The chrome. Screens render inside `.page-body` and never touch any of this.
 *
 * The grid, its five columns, and the collapse rules come from geoh's
 * LayoutStyles.ts — see shell.css. Panes do not animate their width; they move
 * between a wide column and a fixed rail column, which is why the layout stays
 * pixel-stable while collapsing.
 */
export const Layout = ({ title, children }: { title: string; children: ReactNode }) => {
  const layout = useLayout()
  const { persona, setPersona } = usePersona()
  const [realtimeTab, setRealtimeTab] = useState<RealtimeTab>('events')
  // Only used below the Max breakpoint, where groups toggle on click rather
  // than opening because their route went active.
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  const className = [
    'layout',
    layout.sidebarCollapsed ? 'layout--sidebar-collapsed' : '',
    layout.realtimeCollapsed ? 'layout--realtime-collapsed' : ''
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className}>
      <LogoBar className='layout__logo' layout={layout} />
      <MobileHeader className='layout__mobile' persona={persona} onPersonaChange={setPersona} />
      <SearchBar className='layout__search' />
      <OptionsBar className='layout__options' persona={persona} onPersonaChange={setPersona} />
      <UserBar className='layout__user' persona={persona} />

      <Sidebar
        className='layout__sidebar'
        persona={persona}
        layout={layout}
        openKey={openGroup}
        onToggleGroup={(key) => setOpenGroup((current) => (current === key ? null : key))}
      />

      <div className='layout__content'>
        <div className='page-toolbar'>
          <span className='page-toolbar__back'>
            <IoMdArrowBack size={21} />
          </span>
          <h1 className='page-toolbar__title'>{title}</h1>
        </div>
        <div className='page-body'>{children}</div>
      </div>

      {layout.skrimVisible && <div className='layout__skrim' onClick={layout.dismiss} />}

      <RealtimeSidebar className='layout__realtime' layout={layout} tab={realtimeTab} onTabChange={setRealtimeTab} />
    </div>
  )
}
