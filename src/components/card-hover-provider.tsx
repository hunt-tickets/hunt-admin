"use client"

import React, { useState, ReactNode } from 'react'
import { CardHoverContext } from '@/hooks/use-card-hover'

interface CardHoverProviderProps {
  children: ReactNode
}

export function CardHoverProvider({ children }: CardHoverProviderProps) {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const setHoveredCard = (id: string | null) => {
    setHoveredCardId(id)
  }

  return (
    <CardHoverContext.Provider
      value={{
        hoveredCardId,
        setHoveredCard,
        mousePosition,
        setMousePosition,
      }}
    >
      {children}
    </CardHoverContext.Provider>
  )
}