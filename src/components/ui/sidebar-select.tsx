"use client"

import { useState } from "react";

interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SidebarSelectProps {
  options: SelectOption[];
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  label?: string;
}

export function SidebarSelect({ 
  options,
  defaultValue,
  placeholder = 'Seleccionar opción',
  onChange,
  label
}: SidebarSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0]?.value || '');

  const selectedOption = options.find(opt => opt.value === selectedValue);

  return (
    <div className="relative">
      {label && (
        <label className="text-sm font-medium text-text-primary block mb-2">{label}</label>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glassmorphism-input w-full h-12 px-3 rounded-lg hover:border-border-focus transition-all flex items-center justify-between"
      >
        <span className="text-text-primary text-sm">
          {selectedOption?.label || placeholder}
        </span>
        <svg className={`w-4 h-4 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-1 w-full z-20 bg-surface-primary border border-border-secondary rounded-xl p-2 shadow-xl animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="space-y-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedValue(option.value);
                    setIsOpen(false);
                    onChange?.(option.value);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedValue === option.value 
                      ? 'bg-interactive-secondary text-text-primary' 
                      : 'text-muted-foreground hover:text-text-primary hover:bg-interactive-secondary'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-xs opacity-60">{option.description}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}