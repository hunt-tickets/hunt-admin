"use client"

import { Calendar, Home, Plus, Save, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface EventHeaderProps {
  eventName?: string;
  eventDescription?: string;
  isNew?: boolean;
  children?: React.ReactNode;
}

export function EventHeader({ 
  eventName = "Nuevo Evento", 
  eventDescription = "Configura los detalles de tu evento",
  isNew = true,
  children 
}: EventHeaderProps) {
  const bannerUrl = isNew 
    ? "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&h=400&fit=crop&crop=face"
    : "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&h=400&fit=crop&crop=face";
  
  return (
    <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl overflow-hidden">
      {/* Banner Section */}
      <div className="relative h-48 rounded-t-xl overflow-hidden">
        <img 
          src={bannerUrl}
          alt="Event banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70"></div>
        
        {/* Action Buttons on Banner */}
        <div className="absolute top-4 right-4 flex gap-2">
          {isNew ? (
            <>
              <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Save className="w-4 h-4 mr-2" />
                Guardar Borrador
              </Button>
              <Button size="sm" className="bg-interactive-primary text-text-inverse hover:bg-interactive-active">
                <Plus className="w-4 h-4 mr-2" />
                Publicar Evento
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Share className="w-4 h-4 mr-2" />
                Compartir
              </Button>
              <Button size="sm" className="bg-interactive-primary text-text-inverse hover:bg-interactive-active">
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-text-secondary hover:text-text-primary flex items-center gap-2">
                <Home className="h-4 w-4" />
                Inicio
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/eventos" className="text-text-secondary hover:text-text-primary flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Eventos
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-text-primary font-medium flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {isNew ? "Crear Evento" : eventName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex items-center gap-4">
          {/* Event Icon */}
          <div className="w-16 h-16 border border-border-secondary rounded-xl flex items-center justify-center flex-shrink-0 bg-interactive-primary/10">
            <Calendar className="h-8 w-8 text-interactive-primary" />
          </div>
          
          {/* Event Name and Description */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text-primary">{eventName}</h1>
            <p className="text-text-secondary mt-1">{eventDescription}</p>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isNew 
                ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
                : 'bg-green-500/10 text-green-500 border border-green-500/20'
            }`}>
              {isNew ? 'Borrador' : 'Publicado'}
            </span>
          </div>
        </div>
        
        {/* Additional content (stats, actions, etc.) */}
        {children && (
          <div className="pt-4 border-t border-border-secondary">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}