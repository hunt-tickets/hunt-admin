"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Accessibility, 
  Phone, 
  Mail, 
  MapPin, 
  AlertTriangle,
  Info,
  Car,
  Users,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";
import type { AccessibilityFormData } from '@/types/accessibility';
import { PHONE_PREFIXES, ACCESSIBILITY_FEATURES } from '@/types/accessibility';

// Custom Tooltip components without arrow
function CustomTooltip({ children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipPrimitive.Provider delayDuration={0}>
      <TooltipPrimitive.Root {...props}>
        {children}
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

function CustomTooltipTrigger(props: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger {...props} />;
}

function CustomTooltipContent({ 
  className, 
  sideOffset = 10, 
  children, 
  ...props 
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-fit rounded-md px-3 py-1.5 text-xs animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export function EventAccessibilityForm() {
  const [formData, setFormData] = useState<AccessibilityFormData>({
    contact_name: '',
    contact_prefix: '+57',
    contact_number: '',
    contact_email: '',
    entry_instructions: '',
    after_entry_instructions: '',
    hazards_information: '',
    toilet_directions: '',
    accessible_parking: '',
    wheelchair_accessible: false,
    hearing_loop: false,
    sign_language_interpreter: false,
    audio_description: false,
    large_print_materials: false,
    braille_materials: false,
    accessible_restrooms: false,
    service_animals_welcome: false,
    closed_captioning: false
  });

  const handleFeatureToggle = (feature: keyof AccessibilityFormData) => {
    setFormData(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Accesibilidad</h3>
            <p className="text-text-secondary">
              Configura la información de accesibilidad y contacto para personas con discapacidad.
            </p>
          </div>
          
          <div className="space-y-8">
          
            {/* Contact Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div className="grid grid-cols-2 gap-4">
                {/* Contact Name */}
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Nombre de Contacto</label>
                  <Input 
                    value={formData.contact_name}
                    onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
                    placeholder="Ej. María González - Coordinadora de Accesibilidad"
                    className="glassmorphism-input w-full h-12"
                  />
                </div>
                {/* Contact Email */}
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Correo Electrónico</label>
                  <Input 
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                    placeholder="accesibilidad@evento.com"
                    className="glassmorphism-input w-full h-12"
                  />
                </div>
              </div>
              
              {/* Phone Section */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Prefijo</label>
                  <Select 
                    value={formData.contact_prefix} 
                    onValueChange={(value) => setFormData({...formData, contact_prefix: value})}
                  >
                    <SelectTrigger className="glassmorphism-input w-full h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PHONE_PREFIXES.map((prefix) => (
                        <SelectItem key={prefix.value} value={prefix.value}>
                          {prefix.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-text-primary block mb-3">Número de Teléfono</label>
                  <Input
                    type="tel"
                    value={formData.contact_number}
                    onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
                    placeholder="3001234567"
                    className="glassmorphism-input w-full h-12"
                  />
                </div>
              </div>
            </div>

            {/* Accessibility Features Section */}
            <div className="space-y-6">
              <div className="border-t border-border-secondary py-4"></div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-4">Indica qué características de accesibilidad proporciona tu evento</h4>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {ACCESSIBILITY_FEATURES.map((feature) => {
                    const isSelected = formData[feature.key as keyof AccessibilityFormData] as boolean;
                    return (
                      <button
                        key={feature.key}
                        type="button"
                        onClick={() => handleFeatureToggle(feature.key as keyof AccessibilityFormData)}
                        className={`flex flex-col items-center gap-3 p-4 rounded-lg border transition-all duration-200 text-center h-32 ${
                          isSelected 
                            ? 'border-interactive-primary bg-interactive-primary/10' 
                            : 'border-border-secondary hover:bg-surface-elevated'
                        }`}
                      >
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-12 h-12 border rounded-lg flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-interactive-primary/20 border-interactive-primary/30'
                            : 'bg-surface-primary border-border-secondary hover:bg-interactive-primary/10'
                        }`}>
                          <feature.icon className={`w-6 h-6 transition-colors ${
                            isSelected ? 'text-interactive-primary' : 'text-text-primary'
                          }`} />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 flex flex-col items-center justify-center min-w-0">
                          <div className="flex items-center gap-1">
                            <div className="font-medium text-text-primary text-sm leading-tight">
                              {feature.subtitle}
                            </div>
                            <CustomTooltip>
                              <CustomTooltipTrigger asChild>
                                <span
                                  className="text-text-tertiary hover:text-text-secondary transition-colors cursor-help text-xs"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  ?
                                </span>
                              </CustomTooltipTrigger>
                              <CustomTooltipContent 
                                className="max-w-sm bg-surface-secondary/95 backdrop-blur-xl border border-border-primary text-text-primary shadow-xl"
                                sideOffset={15}
                              >
                                <p className="text-xs leading-relaxed">{feature.description}</p>
                              </CustomTooltipContent>
                            </CustomTooltip>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Detailed Instructions Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">
                    Instrucciones de Entrada
                    <span className="text-text-tertiary text-xs ml-1">({formData.entry_instructions.length}/2000)</span>
                  </label>
                  <Textarea
                    value={formData.entry_instructions}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 2000) {
                        setFormData({...formData, entry_instructions: value});
                      }
                    }}
                    placeholder="Describe cómo acceder al evento de forma accesible (entradas, rampas, ascensores, etc.)"
                    className="glassmorphism-input min-h-[120px] resize-none w-full"
                    maxLength={2000}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">
                    Instrucciones Después de la Entrada
                    <span className="text-text-tertiary text-xs ml-1">({formData.after_entry_instructions.length}/2000)</span>
                  </label>
                  <Textarea
                    value={formData.after_entry_instructions}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 2000) {
                        setFormData({...formData, after_entry_instructions: value});
                      }
                    }}
                    placeholder="Instrucciones una vez dentro del recinto (ubicación de asientos accesibles, servicios, etc.)"
                    className="glassmorphism-input min-h-[120px] resize-none w-full"
                    maxLength={2000}
                  />
                </div>
              </div>
              
              {/* Two column layout for smaller textareas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">
                    Indicaciones a Baños Accesibles
                    <span className="text-text-tertiary text-xs ml-1">({formData.toilet_directions.length}/1000)</span>
                  </label>
                  <Textarea
                    value={formData.toilet_directions}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 1000) {
                        setFormData({...formData, toilet_directions: value});
                      }
                    }}
                    placeholder="Ubicación y cómo llegar a los baños accesibles"
                    className="glassmorphism-input min-h-[100px] resize-none w-full"
                    maxLength={1000}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">
                    Información de Estacionamiento
                    <span className="text-text-tertiary text-xs ml-1">({formData.accessible_parking.length}/1000)</span>
                  </label>
                  <Textarea
                    value={formData.accessible_parking}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 1000) {
                        setFormData({...formData, accessible_parking: value});
                      }
                    }}
                    placeholder="Información sobre estacionamiento accesible disponible"
                    className="glassmorphism-input min-h-[100px] resize-none w-full"
                    maxLength={1000}
                  />
                </div>
              </div>

              <div>
                <label className="text-base font-medium text-text-primary block mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    Información de Riesgos o Consideraciones Especiales
                  </div>
                  <span className="text-text-tertiary text-xs ml-1">({formData.hazards_information.length}/2000)</span>
                </label>
                <Textarea
                  value={formData.hazards_information}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 2000) {
                      setFormData({...formData, hazards_information: value});
                    }
                  }}
                  placeholder="Información sobre posibles riesgos, ruidos fuertes, luces estroboscópicas, o cualquier consideración especial"
                  className="glassmorphism-input min-h-[120px] resize-none w-full"
                  maxLength={2000}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}