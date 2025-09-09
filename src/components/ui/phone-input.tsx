"use client"

import { useState } from "react";
import { Phone } from "lucide-react";
import { SidebarSelect } from "./sidebar-select";

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  showPrefix?: boolean;
}

const countryPrefixes = [
  { value: '+1', label: '+1', description: 'Estados Unidos / Canadá' },
  { value: '+52', label: '+52', description: 'México' },
  { value: '+34', label: '+34', description: 'España' },
  { value: '+54', label: '+54', description: 'Argentina' },
  { value: '+57', label: '+57', description: 'Colombia' },
  { value: '+58', label: '+58', description: 'Venezuela' },
  { value: '+51', label: '+51', description: 'Perú' },
  { value: '+56', label: '+56', description: 'Chile' },
];

export function PhoneInput({ 
  value = '',
  onChange,
  label,
  placeholder = "123 456 7890",
  disabled = false,
  error = false,
  showPrefix = true
}: PhoneInputProps) {
  const [prefix, setPrefix] = useState('+52');
  const [phoneNumber, setPhoneNumber] = useState(value);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhoneNumber(newPhone);
    const fullNumber = showPrefix ? `${prefix} ${newPhone}` : newPhone;
    onChange?.(fullNumber);
  };

  const handlePrefixChange = (newPrefix: string) => {
    setPrefix(newPrefix);
    const fullNumber = `${newPrefix} ${phoneNumber}`;
    onChange?.(fullNumber);
  };

  return (
    <div className="relative">
      {label && (
        <label className="text-sm font-medium text-text-primary block mb-2">{label}</label>
      )}
      <div className="flex gap-2">
        {showPrefix && (
          <div className="w-24">
            <SidebarSelect
              options={countryPrefixes}
              defaultValue={prefix}
              onChange={handlePrefixChange}
            />
          </div>
        )}
        <div className="relative flex-1">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`glassmorphism-input w-full h-12 px-3 pr-10 rounded-lg transition-all ${
              error ? 'border-status-error' : 'hover:border-border-focus'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          <Phone className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none ${
            disabled ? 'text-text-tertiary' : 'text-text-secondary'
          }`} />
        </div>
      </div>
    </div>
  );
}