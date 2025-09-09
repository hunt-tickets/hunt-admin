"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface EventFormData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
}

export function EventGeneralForm() {
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl space-y-8">
        
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-text-primary mb-2">Información General</h3>
          <p className="text-text-secondary">Completa los datos básicos de tu evento</p>
        </div>

        {/* Event Name */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-text-primary">
            Nombre del Evento *
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Ej. Festival de Música Rock 2024"
            className="h-12 text-base"
          />
        </div>

        {/* Description */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-text-primary">
            Descripción del Evento *
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Describe tu evento, incluye detalles importantes como artistas, actividades, ubicación, etc."
            className="min-h-[120px] text-base resize-none"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-text-primary">Fecha y Hora de Inicio</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">Fecha</label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="h-12"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">Hora</label>
                <Input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                  className="h-12"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-text-primary">Fecha y Hora de Fin</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">Fecha</label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  min={formData.start_date}
                  className="h-12"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary mb-2 block">Hora</label>
                <Input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                  className="h-12"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-border-secondary flex gap-4">
          <Button variant="outline" className="flex-1">
            Guardar Borrador
          </Button>
          <Button className="flex-1 bg-interactive-primary text-text-inverse hover:bg-interactive-active">
            Continuar
          </Button>
        </div>

      </div>
    </div>
  );
}