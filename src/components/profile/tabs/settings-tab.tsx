"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Removed Card import - using glassmorphism instead
import { DangerZone } from "@/components/profile/atomic/danger-zone";
import { useProducerSettings } from "@/hooks/use-producer-settings";
import type { TabContentProps } from "@/types/tabs";

export function SettingsTab({ producerId, currentProducer }: TabContentProps) {
  const { settings, loading, hasChanges, updateSetting, resetSettings, saveSettings, deleteProducer } = useProducerSettings({ currentProducer });

  const handleSave = async () => {
    const success = await saveSettings();
    if (success) {
      // Show success feedback
    }
  };

  if (!currentProducer) {
    return (
      <div className="text-center text-muted-foreground">
        Selecciona un productor para ver la configuración
      </div>
    );
  }

  return (
    <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">Configuración del Productor</h3>
          <p className="text-text-secondary">
            Gestiona la información básica y configuración de tu productora.
          </p>
        </div>
        <div>
          {hasChanges && (
            <Button 
              onClick={handleSave}
              disabled={loading || !settings.name.trim()}
              className="bg-interactive-primary text-text-inverse hover:bg-interactive-active font-medium disabled:opacity-50 px-6 border border-border-primary"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          )}
        </div>
      </div>
        {/* Información Básica */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Producer Name */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary mb-2 block">Nombre del Productor</label>
              <Input
                value={settings.name}
                onChange={(e) => updateSetting('name', e.target.value)}
                placeholder="Nombre de la productora"
                className="w-full h-12 px-4 bg-surface-elevated border border-border-primary rounded-xl text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-border-primary focus:border-border-primary transition-all duration-200 text-sm"
              />
              <p className="text-xs text-text-secondary mt-2">
                Este nombre aparecerá en todos los eventos
              </p>
            </div>

            {/* Description - Full width on mobile, spans 2 columns on desktop */}
            <div className="space-y-3 md:row-span-2">
              <label className="text-sm font-medium text-text-primary mb-2 block">Descripción</label>
              <textarea
                value={settings.description}
                onChange={(e) => updateSetting('description', e.target.value)}
                placeholder="Descripción del productor (opcional)"
                rows={8}
                className="w-full px-4 py-3 bg-surface-elevated border border-border-primary rounded-xl text-text-primary placeholder-text-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-border-primary focus:border-border-primary transition-all duration-200 text-sm"
              />
              <p className="text-xs text-text-secondary mt-2">
                Breve descripción que aparecerá en el perfil del productor
              </p>
            </div>

            {/* Time Format */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary mb-2 block">Formato de Hora</label>
              <Select
                value={settings.timeFormat || '24h'}
                onValueChange={(value) => updateSetting('timeFormat', value)}
              >
                <SelectTrigger className="w-full h-12 px-4 bg-surface-elevated border border-border-primary rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-border-primary focus:border-border-primary transition-all duration-200 text-sm">
                  <SelectValue placeholder="Seleccionar formato" />
                </SelectTrigger>
                <SelectContent className="bg-surface-elevated border border-border-primary rounded-xl">
                  <SelectItem value="12h">12 horas (3:30 PM)</SelectItem>
                  <SelectItem value="24h">24 horas (15:30)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-text-secondary mt-2">
                Formato para mostrar las horas en eventos
              </p>
            </div>

            {/* Language */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary mb-2 block">Idioma</label>
              <Select
                value={settings.language || 'es'}
                onValueChange={(value) => updateSetting('language', value)}
              >
                <SelectTrigger className="w-full h-12 px-4 bg-surface-elevated border border-border-primary rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-border-primary focus:border-border-primary transition-all duration-200 text-sm">
                  <SelectValue placeholder="Seleccionar idioma" />
                </SelectTrigger>
                <SelectContent className="bg-surface-elevated border border-border-primary rounded-xl">
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-text-secondary mt-2">
                Idioma principal de la interfaz
              </p>
            </div>

            {/* Timezone */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary mb-2 block">Zona Horaria</label>
              <Select
                value={settings.timezone || 'America/Bogota'}
                onValueChange={(value) => updateSetting('timezone', value)}
              >
                <SelectTrigger className="w-full h-12 px-4 bg-surface-elevated border border-border-primary rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-border-primary focus:border-border-primary transition-all duration-200 text-sm">
                  <SelectValue placeholder="Seleccionar zona horaria" />
                </SelectTrigger>
                <SelectContent className="bg-surface-elevated border border-border-primary rounded-xl">
                  <SelectItem value="America/Bogota">Bogotá (GMT-5)</SelectItem>
                  <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                  <SelectItem value="America/Lima">Lima (GMT-5)</SelectItem>
                  <SelectItem value="America/Santiago">Santiago (GMT-3)</SelectItem>
                  <SelectItem value="America/Buenos_Aires">Buenos Aires (GMT-3)</SelectItem>
                  <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                  <SelectItem value="America/Caracas">Caracas (GMT-4)</SelectItem>
                  <SelectItem value="America/Panama">Panamá (GMT-5)</SelectItem>
                  <SelectItem value="America/Costa_Rica">San José (GMT-6)</SelectItem>
                  <SelectItem value="America/Guatemala">Guatemala (GMT-6)</SelectItem>
                  <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                  <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-text-secondary mt-2">
                Zona horaria para mostrar fechas y horas
              </p>
            </div>
          </div>

          {/* Configuraciones Avanzadas */}
          <div className="border-t border-border-secondary pt-6">
            <h4 className="text-lg font-medium text-text-primary mb-4">Configuraciones Avanzadas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Show Timezone */}
              <div className="bg-surface-elevated border border-border-secondary rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-text-primary">Mostrar Zona Horaria</label>
                    <p className="text-xs text-text-secondary mt-1">
                      Mostrar zona horaria junto a las fechas
                    </p>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showTimezone || false}
                        onChange={(e) => updateSetting('showTimezone', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-border-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-primary after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-interactive-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Hide Hunt Tickets Logo */}
              <div className="bg-surface-elevated border border-border-secondary rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-text-primary">Ocultar Logo Hunt Tickets</label>
                    <p className="text-xs text-text-secondary mt-1">
                      Ocultar el logo de Hunt Tickets en páginas públicas
                    </p>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.hideHuntLogo || false}
                        onChange={(e) => updateSetting('hideHuntLogo', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-border-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-primary after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-interactive-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      {/* Danger Zone */}
      <DangerZone 
        producer={currentProducer}
        onDelete={deleteProducer}
      />
    </div>
  );
}