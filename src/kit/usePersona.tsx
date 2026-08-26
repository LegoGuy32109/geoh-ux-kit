import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PERSONAS, findPersona } from './personas.ts'
import type { Gate, Persona } from './types.ts'

type PersonaContextValue = {
  persona: Persona
  personas: Array<Persona>
  setPersona: (key: string) => void
  /** True if the active persona holds any of these permission keys. */
  can: (permission: Gate) => boolean
  /** True if the active persona's org has any of these feature flags. */
  hasFeature: (feature: Gate) => boolean
}

const PersonaContext = createContext<PersonaContextValue | null>(null)

const holds = (held: Array<string> | '*', gate: Gate): boolean => {
  if (held === '*') return true
  const needed = Array.isArray(gate)
    ? gate
    : [
        gate
      ]
  return needed.some((key) => held.includes(key))
}

export const PersonaProvider = ({ children }: { children: ReactNode }) => {
  const [params, setParams] = useSearchParams()
  const persona = findPersona(params.get('as'))

  // `replace` so flipping personas doesn't stack history entries a reviewer
  // then has to click Back through.
  const setPersona = useCallback(
    (key: string) => {
      const next = new URLSearchParams(params)
      next.set('as', key)
      setParams(next, {
        replace: true
      })
    },
    [
      params,
      setParams
    ]
  )

  const value = useMemo<PersonaContextValue>(
    () => ({
      persona,
      personas: PERSONAS,
      setPersona,
      can: (permission) => holds(persona.permissions, permission),
      hasFeature: (feature) => holds(persona.features, feature)
    }),
    [
      persona,
      setPersona
    ]
  )

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>
}

export const usePersona = (): PersonaContextValue => {
  const value = useContext(PersonaContext)
  if (value === null) throw new Error('usePersona must be used inside <PersonaProvider>')
  return value
}
