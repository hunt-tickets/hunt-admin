"use client"

import { createContext, useContext, useState, useRef, useCallback } from 'react'

interface CardHoverContextType {
  hoveredCardId: string | null
  setHoveredCard: (id: string | null) => void
  mousePosition: { x: number; y: number }
  setMousePosition: (position: { x: number; y: number }) => void
}

export const CardHoverContext = createContext<CardHoverContextType>({
  hoveredCardId: null,
  setHoveredCard: () => {},
  mousePosition: { x: 0, y: 0 },
  setMousePosition: () => {},
})

export function useCardHover() {
  const context = useContext(CardHoverContext)
  if (!context) {
    throw new Error('useCardHover must be used within a CardHoverProvider')
  }
  return context
}

export function useGlowEffect(cardId: string) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate distance from center
    const distanceFromCenter = Math.hypot(mouseX - centerX, mouseY - centerY)
    
    // Inactive zone to avoid flickering
    const inactiveRadius = 0.5 * Math.min(rect.width, rect.height) * 0.3

    if (distanceFromCenter > inactiveRadius) {
      // Calculate angle for conic gradient
      const targetAngle = (180 * Math.atan2(mouseY - centerY, mouseX - centerX)) / Math.PI + 90

      // Smooth animation with requestAnimationFrame
      const animate = () => {
        setMousePos({
          x: mouseX,
          y: mouseY,
        })
        
        // Apply the gradient rotation
        if (cardRef.current) {
          cardRef.current.style.setProperty('--glow-angle', `${targetAngle}deg`)
          cardRef.current.style.setProperty('--glow-x', `${(mouseX / rect.width) * 100}%`)
          cardRef.current.style.setProperty('--glow-y', `${(mouseY / rect.height) * 100}%`)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }
  }, [])

  return {
    cardRef,
    isHovered,
    mousePos,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
  }
}