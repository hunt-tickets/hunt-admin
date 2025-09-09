"use client"

import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface SocialMediaInputProps {
  value: string;
  onChange: (value: string) => void;
  platform: string;
  placeholder: string;
  icon: React.ReactNode;
  iconColor: string;
}

export function SocialMediaInput({ 
  value, 
  onChange, 
  platform, 
  placeholder, 
  icon, 
  iconColor 
}: SocialMediaInputProps) {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="flex items-center gap-4">
      <div className={`w-6 h-6 flex-shrink-0 ${iconColor}`}>
        {icon}
      </div>
      <div className="w-32">
        <h4 className="font-semibold text-text-primary">{platform}</h4>
      </div>
      <div className="flex-1 relative">
        <Input 
          placeholder={placeholder}
          className="glassmorphism-input w-full h-12 pr-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors p-1 rounded-full hover:bg-surface-tertiary"
            title="Limpiar campo"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}