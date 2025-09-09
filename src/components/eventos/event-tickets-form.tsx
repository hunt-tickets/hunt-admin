"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Ticket } from 'lucide-react';

interface TicketTier {
  id: string;
  name: string;
  description: string;
  price: string;
  quantity: string;
  sale_start_date: string;
  sale_end_date: string;
  tier_type: string;
}

interface TicketsFormData {
  ticket_tiers: TicketTier[];
  max_per_person: string;
  refund_policy: string;
}

export function EventTicketsForm() {
  const [formData, setFormData] = useState<TicketsFormData>({
    ticket_tiers: [
      {
        id: '1',
        name: '',
        description: '',
        price: '',
        quantity: '',
        sale_start_date: '',
        sale_end_date: '',
        tier_type: 'general'
      }
    ],
    max_per_person: '10',
    refund_policy: 'no_refund'
  });

  const addTicketTier = () => {
    const newTier: TicketTier = {
      id: Date.now().toString(),
      name: '',
      description: '',
      price: '',
      quantity: '',
      sale_start_date: '',
      sale_end_date: '',
      tier_type: 'general'
    };
    setFormData({
      ...formData,
      ticket_tiers: [...formData.ticket_tiers, newTier]
    });
  };

  const removeTicketTier = (id: string) => {
    setFormData({
      ...formData,
      ticket_tiers: formData.ticket_tiers.filter(tier => tier.id !== id)
    });
  };

  const updateTicketTier = (id: string, field: keyof TicketTier, value: string) => {
    setFormData({
      ...formData,
      ticket_tiers: formData.ticket_tiers.map(tier =>
        tier.id === id ? { ...tier, [field]: value } : tier
      )
    });
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Tickets</h3>
            <p className="text-text-secondary">
              Configura los diferentes tipos de tickets y precios para tu evento.
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Ticket Tiers Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-text-secondary">Tipos de Tickets</h4>
                <Button
                  type="button"
                  onClick={addTicketTier}
                  size="sm"
                  className="bg-interactive-primary text-text-inverse hover:bg-interactive-active"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Tipo
                </Button>
              </div>

              <div className="space-y-6">
                {formData.ticket_tiers.map((tier, index) => (
                  <div key={tier.id} className="bg-surface-elevated border border-border-secondary rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-sm font-medium text-text-primary">Ticket #{index + 1}</h5>
                      {formData.ticket_tiers.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeTicketTier(tier.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-text-primary block mb-3">Nombre del Ticket</label>
                          <Input
                            value={tier.name}
                            onChange={(e) => updateTicketTier(tier.id, 'name', e.target.value)}
                            placeholder="Ej. Entrada General"
                            className="glassmorphism-input w-full h-12"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-text-primary block mb-3">Tipo de Ticket</label>
                          <Select 
                            value={tier.tier_type} 
                            onValueChange={(value) => updateTicketTier(tier.id, 'tier_type', value)}
                          >
                            <SelectTrigger className="glassmorphism-input w-full h-12">
                              <SelectValue placeholder="Selecciona el tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="vip">VIP</SelectItem>
                              <SelectItem value="early_bird">Preventa</SelectItem>
                              <SelectItem value="student">Estudiante</SelectItem>
                              <SelectItem value="senior">Tercera Edad</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-text-primary block mb-3">Descripción</label>
                        <Input
                          value={tier.description}
                          onChange={(e) => updateTicketTier(tier.id, 'description', e.target.value)}
                          placeholder="Describe qué incluye este ticket"
                          className="glassmorphism-input w-full h-12"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-text-primary block mb-3">Precio</label>
                          <Input
                            type="number"
                            value={tier.price}
                            onChange={(e) => updateTicketTier(tier.id, 'price', e.target.value)}
                            placeholder="0.00"
                            className="glassmorphism-input w-full h-12"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-text-primary block mb-3">Cantidad Disponible</label>
                          <Input
                            type="number"
                            value={tier.quantity}
                            onChange={(e) => updateTicketTier(tier.id, 'quantity', e.target.value)}
                            placeholder="100"
                            className="glassmorphism-input w-full h-12"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-text-primary block mb-3">Inicio de Venta</label>
                          <Input
                            type="datetime-local"
                            value={tier.sale_start_date}
                            onChange={(e) => updateTicketTier(tier.id, 'sale_start_date', e.target.value)}
                            className="glassmorphism-input w-full h-12"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-text-primary block mb-3">Fin de Venta</label>
                          <Input
                            type="datetime-local"
                            value={tier.sale_end_date}
                            onChange={(e) => updateTicketTier(tier.id, 'sale_end_date', e.target.value)}
                            className="glassmorphism-input w-full h-12"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Settings Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Máximo por Persona</label>
                  <Select value={formData.max_per_person} onValueChange={(value) => setFormData({...formData, max_per_person: value})}>
                    <SelectTrigger className="glassmorphism-input w-full h-12">
                      <SelectValue placeholder="Selecciona el límite" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: 20}, (_, i) => (
                        <SelectItem key={i+1} value={String(i+1)}>{i+1} ticket{i === 0 ? '' : 's'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Política de Reembolso</label>
                  <Select value={formData.refund_policy} onValueChange={(value) => setFormData({...formData, refund_policy: value})}>
                    <SelectTrigger className="glassmorphism-input w-full h-12">
                      <SelectValue placeholder="Selecciona la política" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_refund">Sin Reembolso</SelectItem>
                      <SelectItem value="partial_refund">Reembolso Parcial</SelectItem>
                      <SelectItem value="full_refund">Reembolso Completo</SelectItem>
                      <SelectItem value="custom">Política Personalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}