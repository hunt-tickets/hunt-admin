"use client"

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, Upload, Trash2, Eye, Plus } from 'lucide-react';

interface MediaFile {
  id: string;
  file: File | null;
  preview: string;
  type: 'banner' | 'poster' | 'gallery';
  name: string;
}

interface MediaFormData {
  banner: MediaFile | null;
  poster: MediaFile | null;
  gallery: MediaFile[];
}

export function EventMediaForm() {
  const [formData, setFormData] = useState<MediaFormData>({
    banner: null,
    poster: null,
    gallery: []
  });
  
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File, type: 'banner' | 'poster' | 'gallery') => {
    const preview = URL.createObjectURL(file);
    
    if (type === 'gallery') {
      const newGalleryItem: MediaFile = {
        id: Date.now().toString(),
        file,
        preview,
        type: 'gallery',
        name: file.name
      };
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, newGalleryItem]
      }));
    } else {
      const mediaFile: MediaFile = {
        id: Date.now().toString(),
        file,
        preview,
        type,
        name: file.name
      };
      setFormData(prev => ({
        ...prev,
        [type]: mediaFile
      }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'poster' | 'gallery') => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file, type);
    }
    // Reset input value
    event.target.value = '';
  };

  const removeMedia = (type: 'banner' | 'poster', id?: string) => {
    if (type === 'gallery' && id) {
      setFormData(prev => ({
        ...prev,
        gallery: prev.gallery.filter(item => item.id !== id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [type]: null
      }));
    }
  };

  const removeGalleryItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter(item => item.id !== id)
    }));
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Imágenes</h3>
            <p className="text-text-secondary">
              Sube imágenes promocionales para tu evento.
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Banner Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div>
                <label className="text-sm font-medium text-text-primary block mb-3">
                  Banner Principal
                  <span className="text-text-tertiary text-xs ml-1">(1200x400px recomendado)</span>
                </label>
                
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'banner')}
                  className="hidden"
                />

                {formData.banner ? (
                  <div className="relative">
                    <div className="aspect-[3/1] w-full rounded-lg overflow-hidden border border-border-secondary">
                      <img
                        src={formData.banner.preview}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => window.open(formData.banner?.preview)}
                        className="bg-black/50 text-white hover:bg-black/70"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeMedia('banner')}
                        className="bg-red-500/50 text-white hover:bg-red-500/70"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => bannerInputRef.current?.click()}
                    className="aspect-[3/1] w-full border-2 border-dashed border-border-secondary rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-surface-elevated transition-colors"
                  >
                    <Upload className="h-8 w-8 text-text-tertiary mb-2" />
                    <p className="text-sm text-text-secondary">Haz clic para subir banner</p>
                    <p className="text-xs text-text-tertiary mt-1">PNG, JPG hasta 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Poster Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div>
                <label className="text-sm font-medium text-text-primary block mb-3">
                  Póster del Evento
                  <span className="text-text-tertiary text-xs ml-1">(800x1200px recomendado)</span>
                </label>

                <input
                  ref={posterInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'poster')}
                  className="hidden"
                />

                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    {formData.poster ? (
                      <div className="relative">
                        <div className="aspect-[2/3] w-full rounded-lg overflow-hidden border border-border-secondary">
                          <img
                            src={formData.poster.preview}
                            alt="Poster preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => window.open(formData.poster?.preview)}
                            className="bg-black/50 text-white hover:bg-black/70 w-8 h-8 p-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => removeMedia('poster')}
                            className="bg-red-500/50 text-white hover:bg-red-500/70 w-8 h-8 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => posterInputRef.current?.click()}
                        className="aspect-[2/3] w-full border-2 border-dashed border-border-secondary rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-surface-elevated transition-colors"
                      >
                        <ImageIcon className="h-6 w-6 text-text-tertiary mb-2" />
                        <p className="text-xs text-text-secondary text-center">Subir póster</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-text-primary">
                    Galería de Imágenes
                    <span className="text-text-tertiary text-xs ml-1">({formData.gallery.length}/10)</span>
                  </label>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={formData.gallery.length >= 10}
                    className="bg-interactive-primary text-text-inverse hover:bg-interactive-active"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Imagen
                  </Button>
                </div>

                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'gallery')}
                  className="hidden"
                />

                {formData.gallery.length > 0 ? (
                  <div className="grid grid-cols-4 gap-4">
                    {formData.gallery.map((item) => (
                      <div key={item.id} className="relative">
                        <div className="aspect-square w-full rounded-lg overflow-hidden border border-border-secondary">
                          <img
                            src={item.preview}
                            alt={`Gallery ${item.name}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => window.open(item.preview)}
                            className="bg-black/50 text-white hover:bg-black/70 w-8 h-8 p-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => removeGalleryItem(item.id)}
                            className="bg-red-500/50 text-white hover:bg-red-500/70 w-8 h-8 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border-secondary rounded-lg p-8 text-center">
                    <ImageIcon className="h-8 w-8 text-text-tertiary mx-auto mb-2" />
                    <p className="text-sm text-text-secondary">No hay imágenes en la galería</p>
                    <p className="text-xs text-text-tertiary mt-1">Agrega imágenes adicionales del evento</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}