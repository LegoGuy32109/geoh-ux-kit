import { usePersona } from '../kit/usePersona.tsx'

/**
 * Stands in for a feature that does NOT exist in the portal yet — the case
 * Broadcast Studio was built for.
 *
 * Note what this file does not have to do: no sidebar, no toolbar, no role
 * toggle, no breakpoint handling, no colors of its own. The chrome around it is
 * the real GeoH nav, and the persona switcher in the toolbar drives the branch
 * below. All of that came free from `meta.path` plus a default export.
 */
export const meta = {
  path: '/broadcast-studio',
  title: 'Broadcast Studio',
  description: 'Compose and approve in-app messages'
}

const MESSAGES = [
  { id: 'm1', subject: 'Scheduled maintenance Sunday 2am', status: 'Pending', author: 'John Doe' },
  { id: 'm2', subject: 'New timesheet policy takes effect Oct 1', status: 'Pending', author: 'John Doe' },
  { id: 'm3', subject: 'Holiday payroll cutoff moved up', status: 'Live', author: 'Maria Alvarez' },
  { id: 'm4', subject: 'Reminder: complete annual training', status: 'Draft', author: 'John Doe' }
]

const STATUS_STYLE: Record<string, { color: string; background: string }> = {
  Draft: { color: 'var(--web-text-color-light)', background: 'var(--web-information-background-color)' },
  Pending: { color: 'var(--web-warning-text-color)', background: 'var(--web-warning-background-color)' },
  Live: { color: 'var(--web-success-text-color)', background: 'var(--web-success-background-color)' }
}

export default function BroadcastStudio() {
  const { persona } = usePersona()
  const isApprover = persona.key === 'executive-approver'
  const shown = isApprover ? MESSAGES.filter((message) => message.status === 'Pending') : MESSAGES

  return (
    <>
      <h1 className='page-title'>Broadcast Studio</h1>
      <p className='page-subtitle'>
        {isApprover ? 'Messages awaiting your approval.' : 'Compose messages and send them for approval.'}
      </p>

      <div style={{ display: 'grid', gap: 12, maxWidth: 760 }}>
        {shown.map((message) => {
          const style = STATUS_STYLE[message.status]
          return (
            <div key={message.id} className='card' style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: 'var(--web-bold-color)' }}>{message.subject}</div>
                <div style={{ fontSize: 'var(--web-text-size-extra-small)', color: 'var(--web-text-color-light)' }}>
                  {message.author}
                </div>
              </div>
              <span
                style={{
                  ...style,
                  padding: '3px 10px',
                  borderRadius: 12,
                  fontSize: 'var(--web-text-size-extra-small)',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
              >
                {message.status}
              </span>
            </div>
          )
        })}
      </div>
    </>
  )
}
