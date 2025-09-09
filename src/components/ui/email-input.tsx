"use client"

import { useState } from "react";
import { Mail, Check, X } from "lucide-react";

interface EmailInputProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  showValidation?: boolean;
}

export function EmailInput({ 
  value = '',
  onChange,
  label,
  placeholder = "ejemplo@correo.com",
  disabled = false,
  error = false,
  showValidation = true
}: EmailInputProps) {
  const [email, setEmail] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    onChange?.(newEmail);
  };

  const getValidationIcon = () => {
    if (!showValidation || !email || isFocused) return null;
    
    if (isValidEmail(email)) {
      return <Check className="h-4 w-4 text-status-success" />;
    } else {
      return <X className="h-4 w-4 text-status-error" />;
    }
  };

  const getValidationBorder = () => {
    if (error) return 'border-status-error';
    if (!showValidation || !email || isFocused) return 'hover:border-border-focus';
    
    return isValidEmail(email) ? 'border-status-success' : 'border-status-error';
  };

  return (
    <div className="relative">
      {label && (
        <label className="text-sm font-medium text-text-primary block mb-2">{label}</label>
      )}
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`glassmorphism-input w-full h-12 px-3 pl-10 pr-10 rounded-lg transition-all ${
            getValidationBorder()
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none ${
          disabled ? 'text-text-tertiary' : 'text-text-secondary'
        }`} />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {getValidationIcon()}
        </div>
      </div>
      {showValidation && email && !isFocused && !isValidEmail(email) && (
        <p className="text-xs text-status-error mt-1">
          Ingresa un correo electrónico válido
        </p>
      )}
    </div>
  );
}