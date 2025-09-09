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

    const scrollAmount = 336 // Card width (320px) + gap (16px)
    const currentScroll = scrollRef.current.scrollLeft
    
    const newPosition = direction === 'left' 
      ? currentScroll - scrollAmount
      : currentScroll + scrollAmount

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
    <div className="relative">
      {/* Carousel Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary mb-2">Eventos Destacados</h2>
          <p className="text-text-secondary">Descubre nuestros próximos eventos</p>
        </div>
        
        <div className="flex items-center gap-2">
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollToPosition('left')}
            disabled={!canScrollLeft}
            className="glassmorphism hover-float disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollToPosition('right')}
            disabled={!canScrollRight}
            className="glassmorphism hover-float disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className="carousel-container carousel-snap flex gap-4 overflow-x-auto pb-6 px-2 min-h-[470px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {eventos.map((evento, index) => (
          <div key={evento.id} className="carousel-item flex-shrink-0">
            {spotlightFirst && index === 0 ? (
              <CardEventSpotlight evento={evento} />
            ) : (
              <CardEvent evento={evento} />
            )}
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: Math.ceil(eventos.length / 5) }).map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-white/20 transition-colors duration-300"
            // You can add logic here to highlight the current section
          />
        ))}
      </div>
    </div>
  )
}

export default CarouselEvents