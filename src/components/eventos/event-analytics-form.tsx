"use client"

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface AnalyticsFormData {
  google_analytics_id: string;
  facebook_pixel_id: string;
  enable_heatmaps: boolean;
  track_conversions: boolean;
  track_social_shares: boolean;
  custom_goals: CustomGoal[];
  reporting_frequency: string;
  stakeholder_emails: string;
}

interface CustomGoal {
  id: string;
  name: string;
  type: string;
  target_value: string;
}

export function EventAnalyticsForm() {
  const [formData, setFormData] = useState<AnalyticsFormData>({
    google_analytics_id: '',
    facebook_pixel_id: '',
    enable_heatmaps: true,
    track_conversions: true,
    track_social_shares: true,
    custom_goals: [],
    reporting_frequency: 'weekly',
    stakeholder_emails: ''
  });

  const addCustomGoal = () => {
    const newGoal: CustomGoal = {
      id: Date.now().toString(),
      name: '',
      type: 'tickets_sold',
      target_value: ''
    };
    setFormData(prev => ({
      ...prev,
      custom_goals: [...prev.custom_goals, newGoal]
    }));
  };

  const removeCustomGoal = (id: string) => {
    setFormData(prev => ({
      ...prev,
      custom_goals: prev.custom_goals.filter(goal => goal.id !== id)
    }));
  };

  const updateCustomGoal = (id: string, field: keyof CustomGoal, value: string) => {
    setFormData(prev => ({
      ...prev,
      custom_goals: prev.custom_goals.map(goal =>
        goal.id === id ? { ...goal, [field]: value } : goal
      )
    }));
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Analytics</h3>
            <p className="text-text-secondary">
              Configura el seguimiento y análisis de datos para tu evento.
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Tracking IDs Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Google Analytics ID</label>
                  <Input
                    value={formData.google_analytics_id}
                    onChange={(e) => setFormData({...formData, google_analytics_id: e.target.value})}
                    placeholder="G-XXXXXXXXXX"
                    className="glassmorphism-input w-full h-12"
                  />
                  <p className="text-xs text-text-tertiary mt-1">Opcional - Para seguimiento detallado de usuarios</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Facebook Pixel ID</label>
                  <Input
                    value={formData.facebook_pixel_id}
                    onChange={(e) => setFormData({...formData, facebook_pixel_id: e.target.value})}
                    placeholder="123456789012345"
                    className="glassmorphism-input w-full h-12"
                  />
                  <p className="text-xs text-text-tertiary mt-1">Opcional - Para anuncios de Facebook/Instagram</p>
                </div>
              </div>
            </div>

            {/* Tracking Options Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <h4 className="text-sm font-medium text-text-secondary mb-4">Opciones de Seguimiento</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-border-secondary">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">Mapas de Calor</h4>
                    <p className="text-xs text-text-secondary">Analiza cómo interactúan los usuarios con tu página del evento</p>
                  </div>
                  <Switch
                    checked={formData.enable_heatmaps}
                    onCheckedChange={(checked) => setFormData({...formData, enable_heatmaps: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-border-secondary">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">Seguimiento de Conversiones</h4>
                    <p className="text-xs text-text-secondary">Rastrea compras de tickets y registros completados</p>
                  </div>
                  <Switch
                    checked={formData.track_conversions}
                    onCheckedChange={(checked) => setFormData({...formData, track_conversions: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-border-secondary">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">Compartidos en Redes Sociales</h4>
                    <p className="text-xs text-text-secondary">Mide el alcance orgánico y viral del evento</p>
                  </div>
                  <Switch
                    checked={formData.track_social_shares}
                    onCheckedChange={(checked) => setFormData({...formData, track_social_shares: checked})}
                  />
                </div>
              </div>
            </div>

            {/* Custom Goals Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-text-secondary">Objetivos Personalizados</h4>
                <Button
                  type="button"
                  onClick={addCustomGoal}
                  size="sm"
                  className="bg-interactive-primary text-text-inverse hover:bg-interactive-active"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Objetivo
                </Button>
              </div>

              {formData.custom_goals.length > 0 ? (
                <div className="space-y-4">
                  {formData.custom_goals.map((goal, index) => (
                    <div key={goal.id} className="bg-surface-elevated border border-border-secondary rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium text-text-primary">Objetivo #{index + 1}</h5>
                        <Button
                          type="button"
                          onClick={() => removeCustomGoal(goal.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-sm font-medium text-text-primary block mb-2">Nombre</label>
                          <Input
                            value={goal.name}
                            onChange={(e) => updateCustomGoal(goal.id, 'name', e.target.value)}
                            placeholder="Ej. Tickets VIP vendidos"
                            className="glassmorphism-input w-full h-10"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-text-primary block mb-2">Tipo</label>
                          <Select 
                            value={goal.type} 
                            onValueChange={(value) => updateCustomGoal(goal.id, 'type', value)}
                          >
                            <SelectTrigger className="glassmorphism-input w-full h-10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tickets_sold">Tickets Vendidos</SelectItem>
                              <SelectItem value="revenue">Ingresos</SelectItem>
                              <SelectItem value="registrations">Registros</SelectItem>
                              <SelectItem value="page_views">Vistas de Página</SelectItem>
                              <SelectItem value="social_shares">Compartidos Sociales</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-text-primary block mb-2">Meta</label>
                          <Input
                            type="number"
                            value={goal.target_value}
                            onChange={(e) => updateCustomGoal(goal.id, 'target_value', e.target.value)}
                            placeholder="1000"
                            className="glassmorphism-input w-full h-10"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-border-secondary rounded-lg p-6 text-center">
                  <p className="text-sm text-text-secondary">No hay objetivos personalizados configurados</p>
                  <p className="text-xs text-text-tertiary mt-1">Agrega objetivos para medir el éxito de tu evento</p>
                </div>
              )}
            </div>

            {/* Reporting Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Frecuencia de Reportes</label>
                  <Select value={formData.reporting_frequency} onValueChange={(value) => setFormData({...formData, reporting_frequency: value})}>
                    <SelectTrigger className="glassmorphism-input w-full h-12">
                      <SelectValue placeholder="Selecciona frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diario</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensual</SelectItem>
                      <SelectItem value="never">Nunca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">
                    Emails para Reportes
                    <span className="text-text-tertiary text-xs ml-1">(separados por comas)</span>
                  </label>
                  <Input
                    value={formData.stakeholder_emails}
                    onChange={(e) => setFormData({...formData, stakeholder_emails: e.target.value})}
                    placeholder="admin@evento.com, marketing@evento.com"
                    className="glassmorphism-input w-full h-12"
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