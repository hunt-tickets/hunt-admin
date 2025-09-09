"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Building, Car } from 'lucide-react';

interface LocationFormData {
  venue_name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  venue_description: string;
  capacity: string;
  venue_type: string;
  parking_info: string;
  public_transport: string;
}

export function EventLocationForm() {
  const [formData, setFormData] = useState<LocationFormData>({
    venue_name: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    venue_description: '',
    capacity: '',
    venue_type: 'indoor',
    parking_info: '',
    public_transport: ''
  });

  return (
    <div className="max-w-4xl">
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Ubicación</h3>
            <p className="text-text-secondary">
              Configura la información del lugar donde se realizará tu evento.
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Venue Information Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Nombre del Lugar</label>
                  <Input
                    value={formData.venue_name}
                    onChange={(e) => setFormData({...formData, venue_name: e.target.value})}
                    placeholder="Ej. Teatro Nacional"
                    className="glassmorphism-input w-full h-12"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Tipo de Lugar</label>
                  <Select value={formData.venue_type} onValueChange={(value) => setFormData({...formData, venue_type: value})}>
                    <SelectTrigger className="glassmorphism-input w-full h-12">
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indoor">Interior</SelectItem>
                      <SelectItem value="outdoor">Exterior</SelectItem>
                      <SelectItem value="mixed">Mixto</SelectItem>
                      <SelectItem value="online">Virtual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Dirección</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Ej. Carrera 10 #15-30"
                    className="glassmorphism-input w-full h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Ciudad</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Ej. Bogotá"
                    className="glassmorphism-input w-full h-12"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Estado/Región</label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    placeholder="Ej. Cundinamarca"
                    className="glassmorphism-input w-full h-12"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Código Postal</label>
                  <Input
                    value={formData.postal_code}
                    onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                    placeholder="Ej. 110111"
                    className="glassmorphism-input w-full h-12"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">País</label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    placeholder="Ej. Colombia"
                    className="glassmorphism-input w-full h-12"
                  />
                </div>
              </div>
            </div>

            {/* Venue Details Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Capacidad Máxima</label>
                  <Input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    placeholder="Ej. 500"
                    className="glassmorphism-input w-full h-12"
                  />
                </div>
                <div></div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-text-primary block mb-3">
                  Descripción del Lugar
                  <span className="text-text-tertiary text-xs ml-1">({formData.venue_description.length}/500)</span>
                </label>
                <Textarea
                  value={formData.venue_description}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 500) {
                      setFormData({...formData, venue_description: value});
                    }
                  }}
                  placeholder="Describe las características del lugar (escenario, sonido, iluminación, etc.)"
                  className="glassmorphism-input w-full min-h-[120px] resize-none"
                  maxLength={500}
                />
              </div>
            </div>

            {/* Transportation Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Información de Estacionamiento</label>
                  <Textarea
                    value={formData.parking_info}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 300) {
                        setFormData({...formData, parking_info: value});
                      }
                    }}
                    placeholder="Disponibilidad, costos y ubicación de estacionamiento"
                    className="glassmorphism-input w-full min-h-[100px] resize-none"
                    maxLength={300}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Transporte Público</label>
                  <Textarea
                    value={formData.public_transport}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 300) {
                        setFormData({...formData, public_transport: value});
                      }
                    }}
                    placeholder="Estaciones de metro/bus cercanas y rutas recomendadas"
                    className="glassmorphism-input w-full min-h-[100px] resize-none"
                    maxLength={300}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}