"use client"

import { createContext, useContext } from "react"

type FieldContextValue = {
  id: string
  name?: string
  error?: string
  disabled?: boolean
  required?: boolean
  description?: string
}

const FieldContext = createContext<FieldContextValue | undefined>(undefined)

export function useFieldContext() {
  const context = useContext(FieldContext)

  if (!context) {
    throw new Error("Field components must be used within a Field component")
  }

  return context
}

export const FieldProvider = FieldContext.Provider

