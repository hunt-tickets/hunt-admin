"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface AutocompleteInputProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function AutocompleteInput({
  options,
  value,
  onChange,
  placeholder,
  className,
  ...props
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [filteredOptions, setFilteredOptions] = React.useState<string[]>([])
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Filter options based on input value
  React.useEffect(() => {
    if (value.trim()) {
      const filtered = options.filter(option => 
        option.toLowerCase().includes(value.toLowerCase()) && 
        option.toLowerCase() !== value.toLowerCase()
      )
      setFilteredOptions(filtered)
      setIsOpen(filtered.length > 0)
      setHighlightedIndex(-1) // Reset highlight when options change
    } else {
      setFilteredOptions(options)
      setIsOpen(false)
      setHighlightedIndex(-1)
    }
  }, [value, options])

  // Handle click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current && 
        dropdownRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
  }

  const handleOptionClick = (option: string) => {
    onChange(option)
    setIsOpen(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  const handleInputFocus = () => {
    if (filteredOptions.length > 0 && value.trim()) {
      setIsOpen(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleOptionClick(filteredOptions[highlightedIndex])
        }
        break
    }
  }

  const handleOptionHover = (index: number) => {
    setHighlightedIndex(index)
  }

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn("glassmorphism-input w-full h-12", className)}
        {...props}
      />
      
      {isOpen && filteredOptions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredOptions.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => handleOptionHover(index)}
              className={cn(
                "w-full px-4 py-2 text-left text-sm transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg",
                index === highlightedIndex
                  ? "bg-interactive-primary text-text-inverse"
                  : "text-text-primary hover:bg-surface-elevated"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}