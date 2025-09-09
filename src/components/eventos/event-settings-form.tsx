"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Save, Trash2 } from 'lucide-react';

interface SettingsFormData {
  event_status: string;
  publish_immediately: boolean;
  featured_event: boolean;
  allow_waitlist: boolean;
  waitlist_limit: string;
  cancellation_policy: string;
  custom_domain: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  social_image_url: string;
  enable_reviews: boolean;
  moderate_reviews: boolean;
  contact_organizer: boolean;
  show_attendee_list: boolean;
}

export function EventSettingsForm() {
  const [formData, setFormData] = useState<SettingsFormData>({
    event_status: 'draft',
    publish_immediately: false,
    featured_event: false,
    allow_waitlist: true,
    waitlist_limit: '100',
    cancellation_policy: 'standard',
    custom_domain: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    social_image_url: '',
    enable_reviews: true,
    moderate_reviews: true,
    contact_organizer: true,
    show_attendee_list: false
  });

  const [showDangerZone, setShowDangerZone] = useState(false);

  return (
    <div className="max-w-4xl">
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Configuración</h3>
            <p className="text-text-secondary">
              Ajustes avanzados y configuración final del evento.
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Event Status Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Estado del Evento</label>
                  <Select value={formData.event_status} onValueChange={(value) => setFormData({...formData, event_status: value})}>
                    <SelectTrigger className="glassmorphism-input w-full h-12">
                      <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                      <SelectItem value="postponed">Pospuesto</SelectItem>
                      <SelectItem value="sold_out">Agotado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Política de Cancelación</label>
                  <Select value={formData.cancellation_policy} onValueChange={(value) => setFormData({...formData, cancellation_policy: value})}>
                    <SelectTrigger className="glassmorphism-input w-full h-12">
                      <SelectValue placeholder="Selecciona política" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Estándar (72 horas)</SelectItem>
                      <SelectItem value="flexible">Flexible (24 horas)</SelectItem>
                      <SelectItem value="strict">Estricta (7 días)</SelectItem>
                      <SelectItem value="no_cancellation">Sin cancelación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-border-secondary">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">Publicar Inmediatamente</h4>
                    <p className="text-xs text-text-secondary">Publica el evento tan pronto como se complete</p>
                  </div>
                  <Switch
                    checked={formData.publish_immediately}
                    onCheckedChange={(checked) => setFormData({...formData, publish_immediately: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-border-secondary">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">Evento Destacado</h4>
                    <p className="text-xs text-text-secondary">Muestra este evento en la sección destacada</p>
                  </div>
                  <Switch
                    checked={formData.featured_event}
                    onCheckedChange={(checked) => setFormData({...formData, featured_event: checked})}
                  />
                </div>
              </div>
            </div>

            {/* Waitlist Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-border-secondary">
                <div>
                  <h4 className="text-sm font-medium text-text-primary">Permitir Lista de Espera</h4>
                  <p className="text-xs text-text-secondary">Los usuarios pueden unirse a una lista de espera cuando se agoten los tickets</p>
                </div>
                <Switch
                  checked={formData.allow_waitlist}
                  onCheckedChange={(checked) => setFormData({...formData, allow_waitlist: checked})}
                />
              </div>

              {formData.allow_waitlist && (
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Límite de Lista de Espera</label>
                  <Input
                    type="number"
                    value={formData.waitlist_limit}
                    onChange={(e) => setFormData({...formData, waitlist_limit: e.target.value})}
                    placeholder="100"
                    className="glassmorphism-input w-full h-12"
                  />
                </div>
              )}
            </div>

            {/* SEO Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <h4 className="text-sm font-medium text-text-secondary mb-4">Optimización SEO</h4>
              
              <div>
                <label className="text-sm font-medium text-text-primary block mb-3">Dominio Personalizado</label>
                <Input
                  value={formData.custom_domain}
                  onChange={(e) => setFormData({...formData, custom_domain: e.target.value})}
                  placeholder="mievento.com"
                  className="glassmorphism-input w-full h-12"
                />
                <p className="text-xs text-text-tertiary mt-1">Opcional - Usa tu propio dominio para la página del evento</p>
              </div>

              <div>
                <label className="text-sm font-medium text-text-primary block mb-3">
                  Título SEO
                  <span className="text-text-tertiary text-xs ml-1">({formData.seo_title.length}/60)</span>
                </label>
                <Input
                  value={formData.seo_title}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 60) {
                      setFormData({...formData, seo_title: value});
                    }
                  }}
                  placeholder="Título optimizado para búsquedas"
                  className="glassmorphism-input w-full h-12"
                  maxLength={60}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-text-primary block mb-3">
                  Descripción SEO
                  <span className="text-text-tertiary text-xs ml-1">({formData.seo_description.length}/160)</span>
                </label>
                <Textarea
                  value={formData.seo_description}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 160) {
                      setFormData({...formData, seo_description: value});
                    }
                  }}
                  placeholder="Descripción que aparecerá en los resultados de búsqueda"
                  className="glassmorphism-input w-full min-h-[80px] resize-none"
                  maxLength={160}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-text-primary block mb-3">Palabras Clave</label>
                <Input
                  value={formData.seo_keywords}
                  onChange={(e) => setFormData({...formData, seo_keywords: e.target.value})}
                  placeholder="concierto, música, rock, bogotá"
                  className="glassmorphism-input w-full h-12"
                />
                <p className="text-xs text-text-tertiary mt-1">Separadas por comas</p>
              </div>
            </div>

            {/* Social and Community Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <h4 className="text-sm font-medium text-text-secondary mb-4">Social y Comunidad</h4>
              
              <div>
                <label className="text-sm font-medium text-text-primary block mb-3">Imagen para Redes Sociales</label>
                <Input
                  value={formData.social_image_url}
                  onChange={(e) => setFormData({...formData, social_image_url: e.target.value})}
                  placeholder="https://ejemplo.com/imagen-social.jpg"
                  className="glassmorphism-input w-full h-12"
                />
                <p className="text-xs text-text-tertiary mt-1">URL de imagen que se mostrará al compartir en redes sociales</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-border-secondary">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">Permitir Reseñas</h4>
                    <p className="text-xs text-text-secondary">Los asistentes pueden dejar reseñas del evento</p>
                  </div>
                  <Switch
                    checked={formData.enable_reviews}
                    onCheckedChange={(checked) => setFormData({...formData, enable_reviews: checked})}
                  />
                </div>

                {formData.enable_reviews && (
                  <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-border-secondary">
                    <div>
                      <h4 className="text-sm font-medium text-text-primary">Moderar Reseñas</h4>
                      <p className="text-xs text-text-secondary">Las reseñas requieren aprobación antes de publicarse</p>
                    </div>
                    <Switch
                      checked={formData.moderate_reviews}
                      onCheckedChange={(checked) => setFormData({...formData, moderate_reviews: checked})}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-border-secondary">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">Contactar Organizador</h4>
                    <p className="text-xs text-text-secondary">Muestra botón para contactar al organizador del evento</p>
                  </div>
                  <Switch
                    checked={formData.contact_organizer}
                    onCheckedChange={(checked) => setFormData({...formData, contact_organizer: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-border-secondary">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">Mostrar Lista de Asistentes</h4>
                    <p className="text-xs text-text-secondary">Otros usuarios pueden ver quién asistirá al evento</p>
                  </div>
                  <Switch
                    checked={formData.show_attendee_list}
                    onCheckedChange={(checked) => setFormData({...formData, show_attendee_list: checked})}
                  />
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDangerZone(!showDangerZone)}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                {showDangerZone ? 'Ocultar' : 'Mostrar'} Zona de Peligro
              </Button>

              {showDangerZone && (
                <div className="border border-red-200 rounded-lg p-4 bg-red-50/50">
                  <h4 className="text-sm font-medium text-red-800 mb-3">Acciones Irreversibles</h4>
                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="destructive"
                      className="w-full justify-start bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar Evento Permanentemente
                    </Button>
                    <p className="text-xs text-red-600">
                      Esta acción no se puede deshacer. Se eliminarán todos los datos relacionados con el evento.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}