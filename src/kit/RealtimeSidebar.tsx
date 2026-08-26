import { BiMessageSquareDetail } from 'react-icons/bi'
import { CgChevronDoubleLeft, CgChevronDoubleRight } from 'react-icons/cg'
import { HiOutlineBell } from 'react-icons/hi'
import { RiHistoryLine } from 'react-icons/ri'
import type { LayoutState } from './useLayout.ts'

const ICON_MEDIUM = 21

export type RealtimeTab = 'activity' | 'messaging' | 'events'

/**
 * The right-hand rail. Rebuilt from geoh's RealtimeSidebar.
 *
 * Collapsed it is a 60px column: the toggle stacked over three badge buttons.
 * Expanded the toolbar turns horizontal and a panel opens beneath it. The
 * counts are fixture values — this is chrome for a prototype, not a live feed.
 */
const TABS: Array<{ key: RealtimeTab; icon: typeof RiHistoryLine; count: number; color: string; label: string }> = [
  { key: 'activity', icon: RiHistoryLine, count: 8, color: 'var(--web-primary-color)', label: 'Activity' },
  { key: 'messaging', icon: BiMessageSquareDetail, count: 2, color: 'var(--web-error-color)', label: 'Messages' },
  { key: 'events', icon: HiOutlineBell, count: 1, color: 'var(--web-midnight-blue-color)', label: 'Notifications' }
]

export type RealtimeSidebarProps = {
  className?: string
  layout: LayoutState
  tab: RealtimeTab
  onTabChange: (tab: RealtimeTab) => void
}

export const RealtimeSidebar = ({ className, layout, tab, onTabChange }: RealtimeSidebarProps) => {
  const collapsed = layout.realtimeCollapsed

  return (
    <div className={`${className ?? ''} realtime${collapsed ? ' realtime--collapsed' : ''}`} data-testid='realtime'>
      <div className='realtime__toolbar'>
        <button type='button' className='realtime__toggle' onClick={layout.toggleRealtime} aria-label='Toggle panel'>
          {collapsed ? <CgChevronDoubleLeft size={ICON_MEDIUM} /> : <CgChevronDoubleRight size={ICON_MEDIUM} />}
        </button>

        {TABS.map((item) => {
          const active = !collapsed && tab === item.key
          return (
            <button
              type='button'
              key={item.key}
              className={`realtime__tab${active ? ' realtime__tab--active' : ''}`}
              title={item.label}
              onClick={() => {
                onTabChange(item.key)
                if (collapsed) layout.toggleRealtime()
              }}
            >
              <item.icon size={ICON_MEDIUM} />
              {item.count > 0 && (
                <span className='realtime__badge' style={{ background: item.color }}>
                  {item.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {!collapsed && (
        <div className='realtime__panel'>
          <div className='realtime__empty'>{TABS.find((item) => item.key === tab)?.label} panel</div>
        </div>
      )}
    </div>
  )
}
