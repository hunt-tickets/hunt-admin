"use client"

import { Upload } from "lucide-react";

interface ImageUploaderProps {
  preview: string;
  loading: boolean;
  uploading?: boolean;
  onFileSelect: (file: File) => void;
  label: string;
  description?: string;
  aspectRatio?: 'square' | 'banner';
  bgVariant?: 'dark' | 'light' | 'white' | 'default';
  imageBg?: 'white' | 'black';
}

export function ImageUploader({ 
  preview, 
  loading, 
  uploading = false,
  onFileSelect, 
  label, 
  description,
  aspectRatio = 'square',
  bgVariant = 'default',
  imageBg
}: ImageUploaderProps) {
  const aspectClass = aspectRatio === 'square' ? 'aspect-square' : 'aspect-[3/1]';
  
  const getBgClass = () => {
    if (preview && imageBg) {
      return imageBg === 'white' ? 'bg-white' : 'bg-black';
    }
    switch (bgVariant) {
      case 'light': return 'bg-interactive-secondary';
      case 'white': return 'bg-white';
      case 'dark': return 'bg-black/20';
      default: return 'bg-interactive-hover';
    }
  };

  const getPatternStyle = () => {
    return {};
  };

  return (
    <div>
      <label className="text-sm font-medium text-text-primary block mb-3">{label}</label>
      <div className="relative">
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
          }}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div 
          className={`${aspectClass} border border-border-secondary rounded-lg flex items-center justify-center cursor-pointer hover:border-border-focus transition-colors ${getBgClass()} overflow-hidden relative group`}
          style={getPatternStyle()}
        >
          {uploading ? (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <div className="animate-spin h-6 w-6 border-2 border-text-inverse border-t-transparent rounded-full"></div>
            </div>
          ) : null}
          
          {loading ? (
            <div className="w-full h-full image-skeleton rounded-lg"></div>
          ) : preview ? (
            <>
              <img 
                src={preview} 
                alt={`${label} preview`} 
                className="w-full h-full object-cover rounded-lg image-loading"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="h-6 w-6 text-text-primary" />
              </div>
            </>
          ) : (
            <Upload className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
}