"use client"

import { useState } from "react";
import { Calendar } from "lucide-react";

interface CalendarInputProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

export function CalendarInput({ 
  value = '',
  onChange,
  label,
  placeholder = "dd/mm/yyyy",
  disabled = false,
  error = false
}: CalendarInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSelectedDate(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="relative">
      {label && (
        <label className="text-sm font-medium text-text-primary block mb-2">{label}</label>
      )}
      <div className="relative">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          disabled={disabled}
          className={`glassmorphism-input w-full h-12 px-3 pr-10 rounded-lg transition-all ${
            error ? 'border-status-error' : 'hover:border-border-focus'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        />
        <Calendar className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none ${
          disabled ? 'text-text-tertiary' : 'text-text-secondary'
        }`} />
      </div>
    </div>
  );
}