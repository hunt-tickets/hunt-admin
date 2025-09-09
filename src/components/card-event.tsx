"use client"

import { useState, useRef, useEffect } from 'react'
import { Calendar, MapPin, DollarSign } from 'lucide-react'
import { useGlowEffect } from '@/hooks/use-card-hover'

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

interface CardEventProps {
  evento: EventData
  variant?: 'normal' | 'spotlight'
}

export function CardEvent({ evento, variant = 'normal' }: CardEventProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  
  const {
    cardRef,
    isHovered,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
  } = useGlowEffect(evento.id)

  useEffect(() => {
    if (imageRef.current?.complete) {
      setImageLoaded(true)
    }
  }, [])

  const progressPercentage = Math.round((evento.vendidos / evento.capacidad) * 100)

  return (
    <div
      ref={cardRef}
      className={`
        group relative w-80 sm:w-72 lg:w-80 xl:w-84 h-[440px] cursor-pointer
        transition-all duration-300 ease-out
        ${isHovered 
          ? 'bg-white/8 border-white/15' 
          : 'bg-white/4 border-white/8'
        }
        backdrop-blur-xl border rounded-2xl p-5
        hover:shadow-[0_20px_60px_rgba(0,0,0,0.3),0_8px_25px_rgba(255,255,255,0.1)]
        hover:transform hover:scale-[1.02]
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        '--glow-angle': '0deg',
        '--glow-x': '50%',
        '--glow-y': '50%',
      } as React.CSSProperties}
    >
      {/* Subtle Glow Effect Layer */}
      <div 
        className={`
          absolute inset-0 rounded-2xl pointer-events-none
          transition-opacity duration-500
          ${isHovered ? 'opacity-40' : 'opacity-0'}
        `}
        style={{
          background: `
            radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(255,255,255,0.1) 0%, transparent 50%)
          `,
          filter: 'blur(15px)',
        }}
      />

      {/* Image Container - Ratio 4:3 */}
      <div className="relative w-full aspect-[3/4] mb-4 overflow-hidden rounded-xl">
        {/* Loading Placeholder */}
        <div 
          className={`
            absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50
            transition-opacity duration-500
            ${imageLoaded ? 'opacity-0' : 'opacity-100'}
          `}
        />

        {/* Event Image */}
        <img
          ref={imageRef}
          src={evento.imagen}
          alt={evento.nombre}
          className={`
            w-full h-full object-cover
            transition-all duration-500 ease-out
            group-hover:brightness-105 group-hover:saturate-105
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Subtle Image Border on Hover */}
        <div 
          className={`
            absolute inset-0 rounded-xl border-2 pointer-events-none
            transition-all duration-300
            ${isHovered ? 'border-border-secondary opacity-100' : 'border-transparent opacity-0'}
          `}
        />

        {/* Status Badge - Only keep the most important */}
        <div className={`
          absolute top-3 right-3 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium
          ${evento.estado === 'Activo' ? 'bg-chart-2/90 text-text-primary' : 
            evento.estado === 'Próximo' ? 'bg-chart-4/90 text-text-primary' : 
            'bg-status-error/90 text-text-primary'}
        `}>
          {evento.estado}
        </div>
      </div>

      {/* Content Section - Clean & Organized */}
      <div className="space-y-3">
        {/* Title */}
        <h3 className={`
          text-lg font-semibold text-text-primary leading-tight line-clamp-2
          transition-colors duration-300
          ${isHovered ? 'text-text-primary' : 'text-text-secondary'}
        `}>
          {evento.nombre}
        </h3>

        {/* Event Details */}
        <div className="space-y-2">
          {/* Date & Time */}
          <div className={`
            flex items-center gap-2 text-sm
            transition-colors duration-300
            ${isHovered ? 'text-text-secondary' : 'text-text-secondary'}
          `}>
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{evento.fecha} - {evento.hora}</span>
          </div>

          {/* Venue */}
          <div className={`
            flex items-center gap-2 text-sm
            transition-colors duration-300
            ${isHovered ? 'text-text-secondary' : 'text-text-secondary'}
          `}>
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{evento.ubicacion}</span>
          </div>

          {/* Price */}
          {evento.precio && (
            <div className={`
              flex items-center gap-2 text-sm font-medium
              transition-colors duration-300
              ${isHovered ? 'text-chart-2' : 'text-text-secondary'}
            `}>
              <DollarSign className="w-4 h-4 flex-shrink-0" />
              <span>{evento.precio}</span>
            </div>
          )}
        </div>
      </div>

      {/* Spotlight Overlay (if variant is spotlight) */}
      {variant === 'spotlight' && (
        <div className={`
          absolute inset-0 rounded-2xl pointer-events-none
          bg-gradient-to-t from-black/70 via-black/30 to-transparent
          transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className={`
            absolute bottom-5 left-5 right-5
            transform transition-transform duration-300
            ${isHovered ? 'translate-y-0' : 'translate-y-2'}
          `}>
            <button className="w-full bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-border-secondary rounded-xl py-3 px-4 text-text-primary font-medium transition-all duration-300 hover:transform hover:scale-[1.02]">
              Ver Detalles
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function CardEventSpotlight({ evento }: { evento: EventData }) {
  return <CardEvent evento={evento} variant="spotlight" />
}