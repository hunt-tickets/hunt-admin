"use client"

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  placeholder?: string;
  label?: string;
}

// Utility functions for color conversion
function hexToHsv(hex: string): [number, number, number] {
  // Validar formato hex
  if (!hex || !hex.startsWith('#') || hex.length !== 7) {
    return [0, 1, 1]; // Default rojo
  }

  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  if (diff !== 0) {
    if (max === r) h = ((g - b) / diff) % 6;
    else if (max === g) h = (b - r) / diff + 2;
    else h = (r - g) / diff + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : diff / max;
  const v = max;

  return [h, Math.max(0, Math.min(1, s)), Math.max(0, Math.min(1, v))];
}

function hsvToHex(h: number, s: number, v: number): string {
  // Normalizar valores
  h = Math.max(0, Math.min(360, h));
  s = Math.max(0, Math.min(1, s));
  v = Math.max(0, Math.min(1, v));

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }

  r = Math.round(Math.max(0, Math.min(255, (r + m) * 255)));
  g = Math.round(Math.max(0, Math.min(255, (g + m) * 255)));
  b = Math.round(Math.max(0, Math.min(255, (b + m) * 255)));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function ColorPicker({ value, onChange, placeholder = "#0a0a0a", label = "Color Principal" }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hsv, setHsv] = useState<[number, number, number]>(() => {
    if (value && value.startsWith('#')) {
      return hexToHsv(value);
    }
    return [0, 1, 1];
  });
  const [hexInput, setHexInput] = useState(value || placeholder);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const colorAreaRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingArea, setIsDraggingArea] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);

  // Sincronizar con value prop
  useEffect(() => {
    if (value && value.startsWith('#') && value !== hexInput) {
      const newHsv = hexToHsv(value);
      setHsv(newHsv);
      setHexInput(value);
    }
  }, [value, hexInput]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateColor = useCallback((newHsv: [number, number, number]) => {
    const hex = hsvToHex(newHsv[0], newHsv[1], newHsv[2]);
    setHsv(newHsv);
    setHexInput(hex);
    onChange(hex);
  }, [onChange]);

  const handleColorAreaMouseDown = (e: React.MouseEvent) => {
    setIsDraggingArea(true);
    handleColorAreaMove(e);
  };

  const handleColorAreaMove = (e: React.MouseEvent) => {
    if (!colorAreaRef.current) return;
    
    const rect = colorAreaRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    
    updateColor([hsv[0], x, 1 - y]);
  };

  const handleHueMouseDown = (e: React.MouseEvent) => {
    setIsDraggingHue(true);
    handleHueMove(e);
  };

  const handleHueMove = (e: React.MouseEvent) => {
    if (!hueSliderRef.current) return;
    
    const rect = hueSliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const hue = x * 360;
    
    updateColor([hue, hsv[1], hsv[2]]);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hex = e.target.value;
    
    // Agregar # si no lo tiene
    if (hex && !hex.startsWith('#')) {
      hex = '#' + hex;
    }
    
    // Limitar longitud y caracteres válidos
    if (hex.length > 7) {
      hex = hex.slice(0, 7);
    }
    
    setHexInput(hex);
    
    // Validar y aplicar solo si es hex válido
    if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
      const newHsv = hexToHsv(hex);
      setHsv(newHsv);
      onChange(hex);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingArea) {
        handleColorAreaMove(e as any);
      }
      if (isDraggingHue) {
        handleHueMove(e as any);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingArea(false);
      setIsDraggingHue(false);
    };

    if (isDraggingArea || isDraggingHue) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingArea, isDraggingHue]);

  const currentHue = hsvToHex(hsv[0], 1, 1);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-sm font-medium text-text-primary block mb-3">{label}</label>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="glassmorphism-input rounded-2xl h-12 w-full flex items-center gap-3 px-3 cursor-pointer hover:border-border-focus transition-all"
      >
        <div 
          className="w-6 h-6 rounded-full border border-border-secondary shadow-sm" 
          style={{ 
            backgroundColor: (value && value.startsWith('#')) ? value : 'transparent',
            backgroundImage: (value && value.startsWith('#')) ? 'none' : 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
            backgroundSize: (value && value.startsWith('#')) ? 'auto' : '4px 4px',
            backgroundPosition: (value && value.startsWith('#')) ? 'auto' : '0 0, 0 2px, 2px -2px, -2px 0px'
          }}
        />
        <span className="text-text-primary text-sm flex-1 text-left">{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Color Picker Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <div className="bg-black/40 backdrop-blur-lg border border-white/30 rounded-2xl p-5 shadow-2xl shadow-black/40">
            
            {/* Color Area */}
            <div className="mb-4">
              <div 
                ref={colorAreaRef}
                className="relative w-full h-40 rounded-xl cursor-crosshair overflow-hidden"
                style={{
                  background: `linear-gradient(to right, #ffffff, ${currentHue}), linear-gradient(to top, #000000, transparent)`
                }}
                onMouseDown={handleColorAreaMouseDown}
              >
                {/* Color picker dot */}
                <div
                  className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    left: `${hsv[1] * 100}%`,
                    top: `${(1 - hsv[2]) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* Hue Slider */}
            <div className="mb-4">
              <div 
                ref={hueSliderRef}
                className="relative w-full h-4 rounded-full cursor-pointer"
                style={{
                  background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                }}
                onMouseDown={handleHueMouseDown}
              >
                {/* Hue picker handle */}
                <div
                  className="absolute w-6 h-6 bg-white border-2 border-gray-300 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 top-1/2 pointer-events-none"
                  style={{
                    left: `${(hsv[0] / 360) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* Color Preview and Hex Input */}
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-white/90 block mb-2">Hex</label>
                <input
                  type="text"
                  value={hexInput}
                  onChange={handleHexInputChange}
                  className="w-full bg-black/20 border border-white/30 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-white/50 transition-all"
                  placeholder="#000000"
                />
              </div>
              <div className="relative">
                <div 
                  className="w-12 h-12 rounded-xl border-2 border-white/50 shadow-lg overflow-hidden cursor-pointer hover:border-white/70 transition-all"
                  style={{ backgroundColor: hsvToHex(hsv[0], hsv[1], hsv[2]) }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    // Use ref for reliable access to color input
                    setTimeout(() => {
                      if (colorInputRef.current) {
                        colorInputRef.current.click();
                      }
                    }, 100);
                  }}
                />
                <input
                  ref={colorInputRef}
                  type="color"
                  value={hsvToHex(hsv[0], hsv[1], hsv[2])}
                  onChange={(e) => {
                    const newHsv = hexToHsv(e.target.value);
                    setHsv(newHsv);
                    setHexInput(e.target.value);
                    onChange(e.target.value);
                  }}
                  className="absolute opacity-0 w-0 h-0 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}