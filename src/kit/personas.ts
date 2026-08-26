import type { Persona } from './types.ts'

/**
 * Who a reviewer can view the prototype as.
 *
 * This is the one place role/permission fiction lives. Adding a persona is a
 * few lines here — never a code change in a screen. Screens read the active
 * persona from `usePersona()` and branch on `can(...)`, so a flow that behaves
 * differently for an approver stays one screen, not two.
 *
 * The active persona is in the URL (`?as=<key>`), so any view is linkable and
 * survives a reload. That is what a stakeholder pastes into Slack.
 */
export const PERSONAS: Array<Persona> = [
  {
    key: 'super-admin',
    name: 'John Doe',
    title: 'GEOH Super Administrator',
    initials: 'JD',
    avatarColor: 'var(--web-progress-bar-success-background-color)',
    organization: 'GEOH',
    level: 'SuperAdmin',
    permissions: '*',
    features: '*'
  },
  {
    key: 'executive-approver',
    name: 'Jennifer James',
    title: 'Executive Approver',
    initials: 'JJ',
    avatarColor: 'var(--web-wisteria-color)',
    organization: 'GEOH',
    level: 'Admin',
    permissions: '*',
    features: '*'
  },
  {
    key: 'agency-admin',
    name: 'Maria Alvarez',
    title: 'Agency Administrator',
    initials: 'MA',
    avatarColor: 'var(--web-primary-color)',
    organization: 'Riverbend Home Care',
    group: 'All Locations',
    level: 'Admin',
    // No SuperAdmin level, so the whole Super Administrator group disappears —
    // the same way it does in the real app.
    permissions: '*',
    features: '*'
  },
  {
    key: 'scheduler',
    name: 'Devon Brooks',
    title: 'Scheduler',
    initials: 'DB',
    avatarColor: 'var(--web-carrot-color)',
    organization: 'Riverbend Home Care',
    group: 'North Region',
    level: 'Staff',
    permissions: [
      'ClientView',
      'StaffView',
      'VisitList',
      'VisitEdit',
      'SchedulingViewSelf',
      'AuthorizationView',
      'TripView',
      'MetricsView'
    ],
    features: ['ClientTasklist', 'EmployeeTasklist']
  },
  {
    key: 'biller',
    name: 'Priya Raman',
    title: 'Billing Specialist',
    initials: 'PR',
    avatarColor: 'var(--web-turquoise-color)',
    organization: 'Riverbend Home Care',
    level: 'Staff',
    permissions: ['ViewClaims', 'ViewClaimPayments', 'BillingVisitReview', 'ClientView'],
    features: ['WorklistClaimsEditMode', 'WorklistClaimsViewMode', 'WorklistClaimsEligibility', 'BillingWorklist']
  }
]

export const DEFAULT_PERSONA = PERSONAS[0]

export const findPersona = (key: string | null): Persona =>
  PERSONAS.find((p) => p.key === key) ?? DEFAULT_PERSONA
