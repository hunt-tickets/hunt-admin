"use client"

import { useState } from "react";

interface TextareaInputProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  rows?: number;
  maxLength?: number;
  showCounter?: boolean;
  variant?: 'default' | 'large' | 'small';
}

export function TextareaInput({ 
  value = '',
  onChange,
  label,
  placeholder = "Escribe tu mensaje...",
  disabled = false,
  error = false,
  rows = 4,
  maxLength,
  showCounter = false,
  variant = 'default'
}: TextareaInputProps) {
  const [text, setText] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (maxLength && newText.length > maxLength) return;
    
    setText(newText);
    onChange?.(newText);
  };

  const getRows = () => {
    switch (variant) {
      case 'small': return 2;
      case 'large': return 8;
      default: return rows;
    }
  };

  return (
    <div className="relative">
      {label && (
        <label className="text-sm font-medium text-text-primary block mb-2">{label}</label>
      )}
      <div className="relative">
        <textarea
          value={text}
          onChange={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          rows={getRows()}
          className={`glassmorphism-input w-full px-3 py-3 rounded-lg transition-all resize-none ${
            error ? 'border-status-error' : 'hover:border-border-focus'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {showCounter && maxLength && (
          <div className={`absolute bottom-2 right-3 text-xs ${
            text.length > maxLength * 0.9 ? 'text-status-warning' : 'text-text-tertiary'
          }`}>
            {text.length}/{maxLength}
          </div>
        )}
      </div>
      {showCounter && maxLength && text.length > maxLength * 0.9 && (
        <p className={`text-xs mt-1 ${
          text.length >= maxLength ? 'text-status-error' : 'text-status-warning'
        }`}>
          {text.length >= maxLength 
            ? 'Has alcanzado el límite de caracteres' 
            : `Te quedan ${maxLength - text.length} caracteres`
          }
        </p>
      )}
    </div>
  );
}