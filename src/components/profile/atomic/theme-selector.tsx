"use client"

import { Monitor, Sun, Moon } from "lucide-react";

interface ThemeSelectorProps {
  value: string;
  onChange: (theme: string) => void;
  label?: string;
}

export function ThemeSelector({ value, onChange, label = "Tema Preferido" }: ThemeSelectorProps) {
  const themes = [
    { id: 'system', label: 'Sistema', icon: Monitor },
    { id: 'light', label: 'Claro', icon: Sun },
    { id: 'dark', label: 'Oscuro', icon: Moon }
  ];

  return (
    <div>
      <label className="text-sm font-medium text-text-primary block mb-3">{label}</label>
      <div className="flex gap-3">
        {themes.map((theme) => {
          const IconComponent = theme.icon;
          return (
            <button 
              key={theme.id}
              onClick={() => onChange(theme.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all border backdrop-blur-md ${
                value === theme.id 
                  ? 'bg-white/10 text-text-primary border-border-focus' 
                  : 'bg-white/5 text-muted-foreground hover:text-text-primary hover:bg-white/8 border-white/10 hover:border-border-focus'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{theme.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}