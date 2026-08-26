import type { ReactNode } from 'react'
import { usePersona } from '../kit/usePersona.tsx'

/**
 * Stands in for the real portal's Clients > View Clients page.
 *
 * The common case: a path that already exists in nav.json, so mocking it lights
 * up the sidebar row with no nav edit at all.
 */
export const meta = {
  path: '/clients',
  title: 'Clients',
  description: 'Client roster with status and assigned manager'
}

const CLIENTS = [
  { id: 'c1', name: 'Alvarez, Rosa', status: 'Active', manager: 'Devon Brooks', authorizations: 2 },
  { id: 'c2', name: 'Chen, Wei', status: 'Active', manager: 'Devon Brooks', authorizations: 1 },
  { id: 'c3', name: 'Okafor, Ada', status: 'Pending', manager: 'Maria Alvarez', authorizations: 0 },
  { id: 'c4', name: 'Petrov, Ilya', status: 'Active', manager: 'Maria Alvarez', authorizations: 3 },
  { id: 'c5', name: 'Sowande, Tunde', status: 'Discharged', manager: 'Devon Brooks', authorizations: 0 }
]

const STATUS_COLOR: Record<string, string> = {
  Active: 'var(--web-success-text-color)',
  Pending: 'var(--web-warning-text-color)',
  Discharged: 'var(--web-text-color-light)'
}

const Th = ({ children }: { children: ReactNode }) => (
  <th
    style={{
      textAlign: 'left',
      padding: '0 16px',
      height: 'var(--web-table-header-height)',
      fontSize: 'var(--web-text-size-small)',
      color: 'var(--web-table-header-text-color)',
      borderBottom: '1px solid var(--web-light-border-color)'
    }}
  >
    {children}
  </th>
)

const Td = ({ children }: { children: ReactNode }) => (
  <td style={{ padding: '14px 16px', fontSize: 'var(--web-text-size-small)' }}>{children}</td>
)

export default function ClientList() {
  const { can } = usePersona()

  return (
    <>
      <h1 className='page-title'>Clients</h1>
      <p className='page-subtitle'>{CLIENTS.length} clients</p>

      <div className='card' style={{ padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--web-table-header-color)' }}>
              <Th>Name</Th>
              <Th>Status</Th>
              <Th>Client Manager</Th>
              <Th>Authorizations</Th>
            </tr>
          </thead>
          <tbody>
            {CLIENTS.map((client, index) => (
              <tr
                key={client.id}
                style={{
                  background: index % 2 === 1 ? 'var(--web-table-alternate-cell-background-color)' : undefined,
                  borderTop: '1px solid var(--web-light-border-color)'
                }}
              >
                <Td>
                  <span style={{ fontWeight: 600, color: 'var(--web-bold-color)' }}>{client.name}</span>
                </Td>
                <Td>
                  <span style={{ color: STATUS_COLOR[client.status], fontWeight: 600 }}>{client.status}</span>
                </Td>
                <Td>{client.manager}</Td>
                {/* Persona-gated cell — the Scheduler sees counts, the Biller does not. */}
                <Td>{can('AuthorizationView') ? client.authorizations : '—'}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
