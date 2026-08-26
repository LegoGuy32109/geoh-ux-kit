import type { Persona } from './types.ts'

/**
 * Who a reviewer can view the prototype as, shown as the segmented control in
 * the header. The active persona is in the URL (`?as=<key>`), so any view is
 * linkable and survives a reload — that is what a stakeholder pastes into Slack.
 *
 * Both personas below hold every permission, so the nav is identical for each
 * and screens branch on `persona.key` alone. To make a persona see a smaller
 * nav — a Scheduler, a Biller — give it a lower `level` and a real list of
 * permission/feature keys instead of `'*'`; `nav.ts` gates the sidebar with the
 * same rules the portal uses, so the tree narrows on its own.
 */
export const PERSONAS: Array<Persona> = [
  {
    key: 'super-admin',
    name: 'John Doe',
    shortName: 'Super Admin',
    compactName: 'Admin',
    initials: 'JD',
    avatarColor: 'var(--web-progress-bar-success-background-color)',
    organization: 'GEOH Demonstration',
    group: 'GEOH',
    level: 'SuperAdmin',
    permissions: '*',
    features: '*'
  },
  {
    key: 'executive-approver',
    name: 'Jennifer James',
    shortName: 'Executive Approver',
    compactName: 'Approver',
    initials: 'JJ',
    avatarColor: 'var(--web-wisteria-color)',
    organization: 'GEOH Demonstration',
    group: 'GEOH',
    level: 'SuperAdmin',
    permissions: '*',
    features: '*'
  }
]

export const DEFAULT_PERSONA = PERSONAS[0]

export const findPersona = (key: string | null): Persona => PERSONAS.find((p) => p.key === key) ?? DEFAULT_PERSONA
