"use client"

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CardEvent, CardEventSpotlight } from './card-event'

interface EventData {
  id: string
  nombre: string
  fecha: string
  hora: string
  ubicacion: string
  imagen: string
  precio: string
  estado: 'Activo' | 'Próximo' | 'Agotado'
  vendidos: number
  capacidad: number
}

interface CarouselEventsProps {
  eventos: EventData[]
  autoPlay?: boolean
  autoPlayInterval?: number
  spotlightFirst?: boolean
}

export function CarouselEvents({ 
  eventos, 
  autoPlay = false, 
  autoPlayInterval = 5000,
  spotlightFirst = false 
}: CarouselEventsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay)
  const intervalRef = useRef<NodeJS.Timeout>()

  const checkScrollButtons = () => {
    if (!scrollRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }

  const scrollToPosition = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return

    const cardWidth = 320 // Base card width
    const gap = window.innerWidth >= 1024 ? 40 : window.innerWidth >= 640 ? 32 : 24
    const scrollAmount = cardWidth + gap
    const currentScroll = scrollRef.current.scrollLeft
    
    const newPosition = direction === 'left' 
      ? Math.max(0, currentScroll - scrollAmount)
      : Math.min(
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth,
          currentScroll + scrollAmount
        )

    scrollRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    })
  }

  const autoScrollNext = () => {
    if (!scrollRef.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    
    if (scrollLeft >= scrollWidth - clientWidth - 1) {
      // Reset to beginning
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      scrollToPosition('right')
    }
  }

  useEffect(() => {
    checkScrollButtons()
    
    const handleScroll = () => checkScrollButtons()
    const scrollElement = scrollRef.current
    
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll)
      return () => scrollElement.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(autoScrollNext, autoPlayInterval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, autoPlayInterval])

  const handleMouseEnter = () => {
    if (isAutoPlaying) setIsAutoPlaying(false)
  }

  const handleMouseLeave = () => {
    if (autoPlay) setIsAutoPlaying(true)
  }

  return (
    <div className="relative w-full">
      {/* Carousel Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-text-primary mb-2">Eventos Destacados</h2>
          <p className="text-text-secondary">Descubre nuestros próximos eventos</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Auto-play Toggle */}
          {autoPlay && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="glassmorphism hover-float"
            >
              {isAutoPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          )}
          
          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToPosition('left')}
              disabled={!canScrollLeft}
              className="glassmorphism hover-float disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => scrollToPosition('right')}
              disabled={!canScrollRight}
              className="glassmorphism hover-float disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-6 sm:gap-8 lg:gap-10 overflow-x-auto scrollbar-hide pb-6 scroll-smooth px-1"
          style={{
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {eventos.map((evento, index) => (
            <div 
              key={evento.id} 
              className="flex-shrink-0"
              style={{
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
              }}
            >
              {spotlightFirst && index === 0 ? (
                <CardEventSpotlight evento={evento} />
              ) : (
                <CardEvent evento={evento} />
              )}
            </div>
          ))}
        </div>
        
        {/* Gradient Overlays for better visual boundaries */}
        <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: Math.ceil(eventos.length / 3) }).map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors duration-300 cursor-pointer"
          />
        ))}
      </div>
    </div>
  )
}

export default CarouselEvents