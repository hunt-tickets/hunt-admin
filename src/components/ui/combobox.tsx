"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  options: string[]
  value: string
  onSelect: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  searchPlaceholder?: string
  className?: string
}

export function Combobox({
  options,
  value,
  onSelect,
  placeholder = "Seleccionar opción...",
  emptyMessage = "No se encontraron resultados.",
  searchPlaceholder = "Buscar...",
  className
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between glassmorphism-input h-12 text-left",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-surface-secondary backdrop-blur-xl border-border-primary">
        <Command>
          <CommandInput 
            placeholder={searchPlaceholder} 
            className="h-9"
            value={inputValue}
            onValueChange={(value) => {
              setInputValue(value)
              onSelect(value) // Allow typing new values
            }}
          />
          <CommandList>
            {options.length === 0 ? (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            ) : (
              <>
                {inputValue && !options.includes(inputValue) && (
                  <CommandGroup>
                    <CommandItem
                      value={inputValue}
                      onSelect={() => {
                        onSelect(inputValue)
                        setOpen(false)
                        setInputValue("")
                      }}
                      className="cursor-pointer"
                    >
                      <Check className="mr-2 h-4 w-4 opacity-0" />
                      Crear "{inputValue}"
                    </CommandItem>
                  </CommandGroup>
                )}
                <CommandGroup>
                  {options
                    .filter((option) => 
                      option.toLowerCase().includes(inputValue.toLowerCase())
                    )
                    .map((option) => (
                      <CommandItem
                        key={option}
                        value={option}
                        onSelect={(currentValue) => {
                          onSelect(currentValue)
                          setOpen(false)
                          setInputValue("")
                        }}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === option ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}