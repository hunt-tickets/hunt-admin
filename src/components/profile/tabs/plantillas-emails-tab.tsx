"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import type { TabContentProps } from "@/types/tabs";

export function PlantillasEmailsTab({ producerId, currentProducer }: TabContentProps) {
  const [settings, setSettings] = useState({
    senderName: currentProducer?.name || "Hunt Tickets",
    headerColor: "#000000",
    headerImage: "",
    footerText: "Hunt Tickets S.A.S. - NIT: 901881747-0\ninfo@hunt-tickets.com | WhatsApp: +573228597640\nwww.hunt-tickets.com"
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSettings(prev => ({
          ...prev,
          headerImage: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateEmailPreview = () => {
    return `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <!-- Header Personalizado -->
        <div style="background: ${settings.headerColor}; color: #ffffff; padding: 30px 20px; text-align: center;">
          ${settings.headerImage ? `
            <div style="margin-bottom: 15px;">
              <img src="${settings.headerImage}" alt="Logo" style="max-height: 60px; max-width: 200px;">
            </div>
          ` : ''}
          <h1 style="margin: 0; font-size: 28px; font-weight: 600;">${settings.senderName}</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Tus entradas para [Nombre del Evento]</p>
        </div>

        <!-- Contenido del Email -->
        <div style="padding: 40px 30px;">
          <p style="font-size: 16px; margin: 0 0 20px 0; color: #333333;">Hola [Nombre del Usuario],</p>
          
          <p style="font-size: 16px; margin: 0 0 30px 0; line-height: 1.6; color: #333333;">
            Has adquirido entradas para <strong>[Nombre del Evento]</strong>. Aquí están los detalles:
          </p>

          <!-- Información del Evento -->
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 0 0 30px 0; border-left: 4px solid ${settings.headerColor};">
            <p style="margin: 0 0 8px 0; font-size: 16px; color: #333333;"><strong>📅 Fecha:</strong> [Fecha del Evento] [Hora] COT</p>
            <p style="margin: 0 0 8px 0; font-size: 16px; color: #333333;"><strong>📍 Lugar:</strong> [Nombre del Venue]</p>
            <p style="margin: 0; font-size: 16px; color: #333333;"><strong>🗺️ Dirección:</strong> [Dirección del Venue]</p>
          </div>

          <!-- Botón de Acción -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="#" style="background: ${settings.headerColor}; color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
              VER MIS ENTRADAS
            </a>
          </div>

          <!-- Placeholder para Entradas -->
          <div style="border: 2px dashed #ddd; border-radius: 8px; padding: 40px; text-align: center; background: #fafafa;">
            <div style="color: #666666;">
              <div style="font-size: 48px; margin-bottom: 15px;">🎫</div>
              <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #333333;">Aquí aparecerán tus entradas</h3>
              <p style="margin: 0; font-size: 14px;">Vista previa de tickets con códigos QR, información del evento y botones de wallet</p>
            </div>
          </div>

          <!-- Instrucciones -->
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 30px 0 0 0; border: 1px solid #bbdefb;">
            <p style="margin: 0; font-size: 14px; color: #1976d2; line-height: 1.5;">
              <strong>💡 Importante:</strong> Presenta este email o descarga tus entradas en la app móvil Hunt Tickets. También puedes agregarlas a tu wallet digital.
            </p>
          </div>
        </div>

        <!-- Footer Personalizado -->
        <div style="background: #f5f5f5; padding: 25px; text-align: center; color: #666666; border-top: 1px solid #e0e0e0;">
          ${settings.footerText.split('\n').map(line => 
            `<p style="margin: 0 0 5px 0; font-size: 12px;">${line}</p>`
          ).join('')}
        </div>
      </div>
    `;
  };

  if (!currentProducer) {
    return (
      <div className="text-center text-muted-foreground">
        Selecciona un productor para gestionar plantillas de emails
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-text-primary">Plantillas de Emails</h3>
        <p className="text-text-secondary">
          Personaliza el header y footer que aparecerá en todos los emails de entradas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Columna Izquierda - Configuración */}
        <div className="space-y-8">
          <h4 className="text-lg font-medium text-text-primary">Configuración del Email</h4>
          
          {/* Nombre del Remitente */}
          <div>
            <label className="text-sm font-medium text-text-primary block mb-3">Nombre del Remitente</label>
            <Input
              value={settings.senderName}
              onChange={(e) => setSettings(prev => ({ ...prev, senderName: e.target.value }))}
              placeholder="Hunt Tickets"
              className="w-full h-12 px-4 bg-surface-elevated border border-border-primary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-border-primary focus:border-border-primary transition-all duration-200 text-sm"
            />
          </div>

          {/* Color del Header */}
          <div>
            <label className="text-sm font-medium text-text-primary block mb-3">Color del Header</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={settings.headerColor}
                onChange={(e) => setSettings(prev => ({ ...prev, headerColor: e.target.value }))}
                className="w-12 h-12 rounded-lg border border-border-primary bg-surface-elevated cursor-pointer"
              />
              <Input
                value={settings.headerColor}
                onChange={(e) => setSettings(prev => ({ ...prev, headerColor: e.target.value }))}
                placeholder="#000000"
                className="flex-1 h-12 px-4 bg-surface-elevated border border-border-primary rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-border-primary focus:border-border-primary transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Imagen del Header */}
          <div>
            <label className="text-sm font-medium text-text-primary block mb-3">Logo del Header</label>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-border-secondary rounded-lg p-6 text-center hover:border-border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="header-image"
                />
                <label htmlFor="header-image" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
                  <p className="text-sm text-text-secondary">Haz clic para subir una imagen</p>
                  <p className="text-xs text-text-tertiary mt-1">PNG, JPG hasta 2MB</p>
                </label>
              </div>
              {settings.headerImage && (
                <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-border-secondary">
                  <div className="flex items-center gap-3">
                    <img src={settings.headerImage} alt="Preview" className="w-12 h-12 object-contain rounded" />
                    <span className="text-sm text-text-primary">Imagen cargada</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSettings(prev => ({ ...prev, headerImage: "" }))}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20"
                  >
                    Eliminar
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Texto del Footer */}
          <div>
            <label className="text-sm font-medium text-text-primary block mb-3">Texto Legal del Footer</label>
            <textarea
              value={settings.footerText}
              onChange={(e) => setSettings(prev => ({ ...prev, footerText: e.target.value }))}
              placeholder="Información legal y de contacto..."
              rows={5}
              className="w-full px-4 py-3 bg-surface-elevated border border-border-primary rounded-lg text-text-primary placeholder-text-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-border-primary focus:border-border-primary transition-all duration-200 text-sm"
            />
            <p className="text-xs text-text-tertiary mt-2">Usa saltos de línea para separar diferentes líneas de información</p>
          </div>

          {/* Botón Guardar */}
          <Button className="w-full bg-interactive-primary text-text-inverse hover:bg-interactive-active font-medium h-12 mt-8">
            Guardar Configuración
          </Button>
        </div>

        {/* Columna Derecha - Preview */}
        <div>
          <h4 className="text-lg font-medium text-text-primary mb-6">Vista Previa del Email</h4>
          <div className="bg-white rounded-lg border border-border-secondary overflow-auto" style={{ maxHeight: '800px' }}>
            <div 
              dangerouslySetInnerHTML={{ __html: generateEmailPreview() }}
              className="email-preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}