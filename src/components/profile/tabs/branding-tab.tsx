"use client"

import { useEffect } from "react";
// Removed Card import - using glassmorphism instead
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorPicker } from "@/components/profile/atomic/color-picker";
import { ThemeSelector } from "@/components/profile/atomic/theme-selector";
import { ImageUploader } from "@/components/profile/atomic/image-uploader";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useProducerSettings } from "@/hooks/use-producer-settings";
import type { TabContentProps } from "@/types/tabs";

export function BrandingTab({ producerId, currentProducer }: TabContentProps) {
  const { settings, updateSetting } = useProducerSettings({ currentProducer });
  const { previews, loadingStates, handleFileSelect, loadExistingImages } = useImageUpload({ producerId });

  useEffect(() => {
    if (producerId) {
      loadExistingImages(producerId);
    }
  }, [producerId, loadExistingImages]);

  return (
    <div className="max-w-4xl">
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Branding</h3>
            <p className="text-text-secondary">
              Gestiona la identidad visual y documentos legales de tu productora.
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Contact Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div className="grid grid-cols-2 gap-4">
                {/* WhatsApp */}
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">WhatsApp</label>
                  <Input 
                    placeholder="https://wa.me/1234567890"
                    className="glassmorphism-input w-full h-12"
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Correo Electrónico</label>
                  <Input 
                    placeholder="contacto@soporte.com"
                    className="glassmorphism-input w-full h-12"
                  />
                </div>
              </div>
              
              {/* Theme and Color Section */}
              <div className="grid grid-cols-2 gap-4">
                <ThemeSelector 
                  value={settings.theme}
                  onChange={(theme) => updateSetting('theme', theme as any)}
                />
                <ColorPicker
                  value={settings.primaryColor}
                  onChange={(color) => updateSetting('primaryColor', color)}
                />
              </div>
              
              {/* Font Section */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Fuente Principal</label>
                  <Select>
                    <SelectTrigger className="glassmorphism-input w-full h-12">
                      <SelectValue placeholder="Seleccionar fuente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="opensans">Open Sans</SelectItem>
                      <SelectItem value="lato">Lato</SelectItem>
                      <SelectItem value="poppins">Poppins</SelectItem>
                      <SelectItem value="montserrat">Montserrat</SelectItem>
                      <SelectItem value="nunito">Nunito</SelectItem>
                      <SelectItem value="raleway">Raleway</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Fuente Secundaria</label>
                  <Select>
                    <SelectTrigger className="glassmorphism-input w-full h-12">
                      <SelectValue placeholder="Seleccionar fuente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="opensans">Open Sans</SelectItem>
                      <SelectItem value="lato">Lato</SelectItem>
                      <SelectItem value="poppins">Poppins</SelectItem>
                      <SelectItem value="montserrat">Montserrat</SelectItem>
                      <SelectItem value="nunito">Nunito</SelectItem>
                      <SelectItem value="raleway">Raleway</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Logos Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div className="grid grid-cols-3 gap-4">
                <ImageUploader
                  preview={previews.main}
                  loading={loadingStates.main}
                  uploading={loadingStates.uploading}
                  onFileSelect={(file) => handleFileSelect(file, 'main')}
                  label="Principal"
                  description="Logo cuadrado principal de tu marca"
                />
                
                <ImageUploader
                  preview={previews.white}
                  loading={loadingStates.white}
                  onFileSelect={(file) => handleFileSelect(file, 'white')}
                  label="Fondo Claro"
                  description="Versión para fondos claros"
                  imageBg="white"
                />
                
                <ImageUploader
                  preview={previews.black}
                  loading={loadingStates.black}
                  onFileSelect={(file) => handleFileSelect(file, 'black')}
                  label="Fondo Oscuro"
                  description="Versión para fondos oscuros"
                  imageBg="black"
                />
              </div>
            </div>

            {/* Full Logos Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <ImageUploader
                  preview={previews.fullWhite}
                  loading={loadingStates.fullWhite}
                  onFileSelect={(file) => handleFileSelect(file, 'fullWhite')}
                  label="Full Logo Fondo Claro"
                  description="Logo completo horizontal para fondos claros"
                  aspectRatio="banner"
                  imageBg="white"
                />
                
                <ImageUploader
                  preview={previews.fullBlack}
                  loading={loadingStates.fullBlack}
                  onFileSelect={(file) => handleFileSelect(file, 'fullBlack')}
                  label="Full Logo Fondo Oscuro"
                  description="Logo completo horizontal para fondos oscuros"
                  aspectRatio="banner"
                  imageBg="black"
                />
              </div>
            </div>

            {/* Banner Section */}
            <div className="space-y-4">
              <ImageUploader
                preview={previews.banner}
                loading={loadingStates.banner}
                onFileSelect={(file) => handleFileSelect(file, 'banner')}
                label="Banner"
                description="Banner horizontal para encabezados (1200x400px recomendado)"
                aspectRatio="banner"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}