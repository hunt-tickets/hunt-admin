"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <div>
        <h3 className="text-xl font-semibold text-text-primary">Configuración del Productor</h3>
        <p className="text-text-secondary">
          Gestiona la información básica y configuración de tu productora.
        </p>
      </div>
        <div className="grid grid-cols-2 gap-8">
          {/* Columna Izquierda - Información básica */}
          <div className="space-y-6">
            {/* Producer Name */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary">Nombre del Productor</label>
              <Input
                value={settings.name}
                onChange={(e) => updateSetting('name', e.target.value)}
                placeholder="Nombre de la productora"
                className="glassmorphism-input w-full h-12"
              />
              <p className="text-xs text-text-secondary">
                Este nombre aparecerá en todos los eventos
              </p>
            </div>

            {/* Producer Domain */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary">Dominio</label>
              <div className="flex items-center">
                <span className="bg-interactive-hover border border-border-secondary border-r-0 rounded-l-lg px-3 h-12 flex items-center text-text-secondary text-sm whitespace-nowrap">
                  https://hunt-tickets.com/hosts/
                </span>
                <Input
                  value={settings.domain}
                  onChange={(e) => updateSetting('domain', e.target.value)}
                  placeholder="miproductora"
                  className="glassmorphism-input w-full h-12 rounded-l-none border-l-0"
                />
              </div>
              <p className="text-xs text-text-secondary">
                Tu URL personalizada será: https://hunt-tickets.com/hosts/{settings.domain || 'miproductora'}
              </p>
            </div>

            {/* Time Format */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary">Formato de Hora</label>
              <select
                value={settings.timeFormat || '24h'}
                onChange={(e) => updateSetting('timeFormat', e.target.value)}
                className="w-full px-4 py-3 bg-interactive-hover border border-border-secondary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent text-sm h-12"
              >
                <option value="12h">12 horas (3:30 PM)</option>
                <option value="24h">24 horas (15:30)</option>
              </select>
              <p className="text-xs text-text-secondary">
                Formato para mostrar las horas en eventos
              </p>
            </div>

            {/* Language */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary">Idioma</label>
              <select
                value={settings.language || 'es'}
                onChange={(e) => updateSetting('language', e.target.value)}
                className="w-full px-4 py-3 bg-interactive-hover border border-border-secondary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent text-sm h-12"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
              <p className="text-xs text-text-secondary">
                Idioma principal de la interfaz
              </p>
            </div>
          </div>

          {/* Columna Derecha - Descripción y configuraciones */}
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary">Descripción</label>
              <textarea
                value={settings.description}
                onChange={(e) => updateSetting('description', e.target.value)}
                placeholder="Descripción del productor (opcional)"
                rows={6}
                className="w-full px-4 py-3 bg-interactive-hover border border-border-secondary rounded-lg text-text-primary placeholder-text-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent text-sm"
              />
              <p className="text-xs text-text-secondary">
                Breve descripción que aparecerá en el perfil del productor
              </p>
            </div>

            {/* Show Timezone */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-text-primary">Mostrar Zona Horaria</label>
                  <p className="text-xs text-text-secondary">
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
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Hide Hunt Tickets Logo */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-text-primary">Ocultar Logo Hunt Tickets</label>
                  <p className="text-xs text-text-secondary">
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
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6">
          <Button 
            variant="outline" 
            className="hover:bg-interactive-secondary border-border-secondary text-text-primary px-6"
            onClick={resetSettings}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={loading || !hasChanges || !settings.name.trim()}
            className="bg-interactive-primary text-text-inverse hover:bg-interactive-active font-medium disabled:opacity-50 px-6 border border-border-primary"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>

      {/* Danger Zone */}
      <DangerZone 
        producer={currentProducer}
        onDelete={deleteProducer}
      />
    </div>
  );
}