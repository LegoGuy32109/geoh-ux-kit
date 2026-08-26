import { FiUser } from 'react-icons/fi'
import { HiOutlineUsers } from 'react-icons/hi'
import { MdOutlineCalendarToday, MdOutlineErrorOutline, MdOutlineSearch } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { usePersona } from '../kit/usePersona.tsx'

/**
 * A feature the portal does not have yet.
 *
 * `meta.nav` is the whole nav story: name a parent group and an icon, and the
 * row appears under Super Administrator with a megaphone. No nav.json edit.
 */
export const meta = {
  path: '/broadcast-studio',
  title: 'Broadcast Studio',
  nav: {
    parent: 'SuperAdmin',
    icon: 'GrAnnounce',
    after: 'CompanyList'
  }
}

type Message = {
  id: string
  subject: string
  author: string
  dates: string
  /** Renders the amber warning glyph beside the date range. */
  dateWarning?: boolean
  tag?: string
  recipients?: number
}

type Column = {
  key: string
  label: string
  color: string
  messages: Array<Message>
}

const COLUMNS: Array<Column> = [
  {
    key: 'drafts',
    label: 'DRAFTS',
    color: 'var(--web-text-color-light)',
    messages: [
      { id: 'd1', subject: 'Q3 Training Reminder', author: 'John Doe', dates: 'Aug 1, 2026 – Aug 8, 2026', recipients: 1750 },
      {
        id: 'd2',
        subject: 'System Outage Alert Draft',
        author: 'John Doe',
        dates: 'Aug 5, 2026 – Until stopped',
        tag: 'Emergency',
        recipients: 1200
      }
    ]
  },
  {
    key: 'pending',
    label: 'PENDING APPROVAL',
    color: 'var(--web-warning-text-color)',
    messages: [
      {
        id: 'p1',
        subject: 'Client Portal Maintenance',
        author: 'Marcus Chen',
        dates: 'Aug 28, 2026 – Aug 29, 2026',
        dateWarning: true,
        tag: 'Emergency',
        recipients: 892
      },
      {
        id: 'p2',
        subject: 'Service Outage — East Coast Region',
        author: 'Marcus Chen',
        dates: 'Aug 30, 2026 – Aug 30, 2026',
        dateWarning: true,
        recipients: 4300
      },
      { id: 'p3', subject: 'Holiday Closure Notice', author: 'Priya Nair', dates: 'Sep 9, 2026 – Sep 16, 2026', recipients: 3150 },
      {
        id: 'p4',
        subject: 'New Mobile App Release',
        author: 'John Doe',
        dates: 'Sep 13, 2026 – Sep 27, 2026',
        tag: 'New Release',
        recipients: 575
      },
      {
        id: 'p5',
        subject: 'Payroll System Maintenance Window',
        author: 'Priya Nair',
        dates: 'Sep 16, 2026 – Sep 17, 2026',
        tag: 'Emergency',
        recipients: 295
      },
      { id: 'p6', subject: 'Fall Enrollment Campaign Kickoff', author: 'Elena Rodriguez', dates: 'Sep 20, 2026 – Oct 4, 2026', recipients: 2100 },
      { id: 'p7', subject: 'Updated Privacy Policy', author: 'Elena Rodriguez', dates: 'Oct 1, 2026 – Until stopped', recipients: 5200 }
    ]
  },
  {
    key: 'approved',
    label: 'APPROVED',
    color: 'var(--web-success-text-color)',
    messages: [
      { id: 'a1', subject: 'New Wellness Program Rollout', author: 'John Doe', dates: 'Aug 20, 2026 – Until stopped', recipients: 530 }
    ]
  }
]

const MessageCard = ({ message }: { message: Message }) => (
  <div
    style={{
      background: 'var(--web-light-background-color)',
      border: '1px solid var(--web-light-border-color)',
      borderRadius: 4,
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <span
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: 'var(--web-text-size-small)',
          fontWeight: 700,
          color: 'var(--web-text-color-dark)'
        }}
      >
        {message.subject}
      </span>
      <BsThreeDotsVertical size={15} color='var(--web-icon-light-color)' />
    </div>

    <span style={metaRow}>
      <FiUser size={13} />
      {message.author}
    </span>

    <span style={metaRow}>
      <MdOutlineCalendarToday size={13} />
      {message.dates}
      {message.dateWarning === true && <MdOutlineErrorOutline size={14} color='var(--web-error-color)' />}
    </span>

    {message.tag !== undefined && (
      <span
        style={{
          alignSelf: 'flex-start',
          padding: '3px 8px',
          borderRadius: 3,
          fontSize: 'var(--web-text-size-extra-small)',
          color: 'var(--web-text-color-regular)',
          background: 'var(--web-disabled-dark-background-color)'
        }}
      >
        {message.tag}
      </span>
    )}

    {message.recipients !== undefined && (
      <span style={{ ...metaRow, color: 'var(--web-bold-color)', fontWeight: 600 }}>
        <HiOutlineUsers size={13} />
        {message.recipients} Recipients
      </span>
    )}
  </div>
)

const metaRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  fontSize: 'var(--web-text-size-extra-small)',
  color: 'var(--web-text-color-light)'
}

export default function BroadcastStudio() {
  const { persona } = usePersona()
  // The approver only reviews what is waiting on them.
  const columns = persona.key === 'executive-approver' ? COLUMNS.filter((column) => column.key === 'pending') : COLUMNS

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: 280,
            height: 38,
            padding: '0 12px',
            border: '1px solid var(--web-light-border-color)',
            borderRadius: 4,
            background: 'var(--web-light-background-color)',
            color: 'var(--web-text-color-light)',
            fontSize: 'var(--web-text-size-small)'
          }}
        >
          <MdOutlineSearch size={18} />
          Search by keywords…
        </span>

        <button type='button' style={secondaryAction}>
          <RiDeleteBin6Line size={16} />
          SHOW DISCARDED
        </button>

        {persona.key !== 'executive-approver' && (
          <button type='button' style={primaryAction}>
            + NEW MESSAGE
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', overflowX: 'auto', paddingBottom: 8 }}>
        {columns.map((column) => (
          <div key={column.key} style={{ flex: '1 0 300px', minWidth: 300, maxWidth: 420 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 'var(--web-text-size-small)', fontWeight: 700, letterSpacing: '0.04em', color: column.color }}>
                {column.label}
              </span>
              <span style={{ flex: 1 }} />
              <span style={{ fontSize: 'var(--web-text-size-extra-small)', color: 'var(--web-text-color-light)' }}>
                {column.messages.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {column.messages.map((message) => (
                <MessageCard key={message.id} message={message} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

const secondaryAction: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  height: 38,
  padding: '0 4px',
  fontSize: 'var(--web-text-size-small)',
  fontWeight: 600,
  letterSpacing: '0.03em',
  color: 'var(--web-text-color-regular)'
}

const primaryAction: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  height: 38,
  padding: '0 18px',
  borderRadius: 4,
  background: 'var(--web-primary-color)',
  color: 'var(--web-text-inverse-color)',
  fontSize: 'var(--web-text-size-small)',
  fontWeight: 600,
  letterSpacing: '0.03em'
}
