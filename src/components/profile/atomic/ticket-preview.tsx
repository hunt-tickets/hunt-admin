"use client"

import { useState, useMemo } from "react";
import { FileText, MapPin, Calendar, User, QrCode, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BrandingSettings {
  theme?: string;
  primaryColor?: string;
  logos?: {
    main?: string;
    white?: string;
    black?: string;
    fullWhite?: string;
    fullBlack?: string;
  };
}

interface TicketPreviewProps {
  producerId?: string;
  currentProducer?: any;
  brandingSettings?: BrandingSettings;
}

export function TicketPreview({ producerId, currentProducer, brandingSettings }: TicketPreviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Datos mock para el preview
  const mockData = useMemo(() => {
    const eventDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return {
      event: {
        name: "Festival de Música Electrónica",
        date: eventDate.toLocaleDateString("es-CO", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }),
        time: "21:00",
        flyer: brandingSettings?.logos?.main || "https://via.placeholder.com/300x400/1a1a1a/ffffff?text=EVENTO"
      },
      venue: {
        name: currentProducer?.name || "Venue Ejemplo",
        address: "Calle 123 #45-67, Bogotá"
      },
      ticket: {
        type: "Entrada General",
        orderId: "HT123456",
        userEmail: "usuario@ejemplo.com"
      }
    };
  }, [currentProducer, brandingSettings]);

  if (!currentProducer) {
    return (
      <div className="bg-surface-elevated border border-border-secondary rounded-xl p-6">
        <div className="text-center text-text-secondary">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Selecciona un productor para ver el preview de entradas</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold text-text-primary">Preview de Entradas</h4>
          <p className="text-text-secondary text-sm">
            Vista previa de cómo se verán las entradas en PDF con tu branding actual.
          </p>
        </div>

        <div className="bg-surface-elevated border border-border-secondary rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-interactive-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-interactive-primary" />
              </div>
              <div>
                <h5 className="font-medium text-text-primary">Entrada de Ejemplo</h5>
                <p className="text-sm text-text-secondary">
                  Visualiza cómo se aplicará tu branding
                </p>
              </div>
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-interactive-primary text-text-inverse hover:bg-interactive-active font-medium"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Preview
            </Button>
          </div>

          <div className="mt-4 p-3 bg-surface-secondary/30 rounded-lg">
            <h6 className="text-sm font-medium text-text-primary mb-2">Información del Preview</h6>
            <ul className="text-xs text-text-secondary space-y-1">
              <li>• Este preview muestra cómo se verán las entradas con tu branding actual</li>
              <li>• Los logos se aplicarán automáticamente en las entradas reales</li>
              <li>• Los datos mostrados son ejemplos para visualización</li>
              <li>• Las entradas reales tendrán códigos QR únicos y funcionales</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal Lateral */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          
          {/* Modal Panel */}
          <div className="relative ml-auto w-full max-w-4xl bg-surface-primary border-l border-border-primary shadow-2xl overflow-hidden">
            {/* Header del Modal */}
            <div className="bg-surface-secondary border-b border-border-primary p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-text-primary">Preview de Entrada</h3>
                <p className="text-text-secondary text-sm">Vista previa con tu branding actual</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="border-border-secondary hover:bg-surface-elevated"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 overflow-y-auto h-full max-h-[calc(100vh-120px)]">
              {/* Preview Visual de la Entrada */}
              <div className="bg-white border-2 border-border-secondary rounded-xl overflow-hidden shadow-lg max-w-3xl mx-auto">
                {/* Header Negro */}
                <div className="bg-black text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {brandingSettings?.logos?.white ? (
                      <img 
                        src={brandingSettings.logos.white} 
                        alt="Logo" 
                        className="h-8 w-auto"
                      />
                    ) : (
                      <div className="text-lg font-bold">HUNT TICKETS</div>
                    )}
                  </div>
                  <div className="text-sm opacity-80">#{mockData.ticket.orderId}</div>
                </div>

                {/* Contenido Principal */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Columna Izquierda - Flyer */}
                    <div className="space-y-4">
                      <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border">
                        {brandingSettings?.logos?.main ? (
                          <img 
                            src={brandingSettings.logos.main}
                            alt="Event Flyer" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                            <div className="text-center">
                              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">Imagen del Evento</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Columna Derecha - Información */}
                    <div className="space-y-6">
                      {/* Evento */}
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{mockData.event.name}</h2>
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{mockData.event.date} {mockData.event.time} COT</span>
                        </div>
                      </div>

                      {/* Lugar */}
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">LUGAR</p>
                        <p className="font-semibold text-gray-900">{mockData.venue.name}</p>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{mockData.venue.address}</span>
                        </div>
                      </div>

                      {/* Entrada */}
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">ENTRADA</p>
                        <p className="font-semibold text-gray-900">{mockData.ticket.type}</p>
                        <p className="text-sm text-gray-600">Orden: #{mockData.ticket.orderId}</p>
                      </div>

                      {/* Correo Comprador */}
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">CORREO COMPRADOR</p>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-600" />
                          <span className="font-semibold text-gray-900">{mockData.ticket.userEmail}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Línea Divisoria */}
                  <div className="border-t border-gray-200 my-6"></div>

                  {/* Sección Inferior */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Columna Izquierda - Info */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Información del ticket</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Con Hunt Tickets, tus entradas se sincronizan en un solo ecosistema: disponibles en tu app móvil y también en tu correo como archivo PDF.
                      </p>
                      
                      {/* App Buttons Simulados */}
                      <div className="flex gap-2">
                        <div className="w-16 h-6 bg-black rounded text-white text-xs flex items-center justify-center">App Store</div>
                        <div className="w-16 h-6 bg-black rounded text-white text-xs flex items-center justify-center">Google Play</div>
                        <div className="w-16 h-6 bg-gray-800 rounded text-white text-xs flex items-center justify-center">Hunt App</div>
                      </div>
                      
                      {/* Texto Legal Simulado */}
                      <div className="text-xs text-gray-500 leading-tight">
                        <p>Este ticket es personal e intransferible salvo uso de la funcionalidad de transferencia dentro de la plataforma de Hunt Tickets. Su uso indebido, reproducción o alteración anula su validez...</p>
                      </div>
                    </div>

                    {/* Columna Derecha - QR */}
                    <div className="flex flex-col items-center space-y-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                          ESTE CÓDIGO SERÁ ESCANEADO AL MOMENTO DE INGRESAR AL EVENTO
                        </p>
                      </div>
                      
                      {/* QR Code Simulado */}
                      <div className="w-32 h-32 border-2 border-black flex items-center justify-center bg-white">
                        <QrCode className="w-16 h-16 text-black" />
                      </div>
                      
                      <p className="text-xs text-gray-500">ID: preview-qr-123456</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 mt-6 pt-4">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <div className="space-y-1">
                        <p>info@hunt-tickets.com</p>
                        <p>WhatsApp: +573228597640</p>
                        <p>www.hunt-tickets.com</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p>Entrada 1 de 1</p>
                        <p>No se aceptan devoluciones</p>
                        <p>Hunt Tickets S.A.S. NIT 901881747-0</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}