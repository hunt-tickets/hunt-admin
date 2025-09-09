"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Currency } from "@/lib/db"
import { useCurrenciesContext } from "@/contexts/currencies-context"
import { Loader2 } from "lucide-react"

interface CreateCurrencyFormProps {
  onSuccess: (currency: Currency) => void
  onCancel: () => void
}

export function CreateCurrencyForm({ onSuccess, onCancel }: CreateCurrencyFormProps) {
  const { createCurrency } = useCurrenciesContext()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    name: {
      es: "",
      en: ""
    },
    symbol: "",
    decimal_places: 2,
    is_active: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.code || (!formData.name.es && !formData.name.en) || !formData.symbol) {
      return
    }

    setLoading(true)
    
    try {
      const newCurrency = await createCurrency({
        ...formData,
        name: formData.name // Store as JSONB object
      })
      onSuccess(newCurrency)
    } catch (error) {
      console.error('Error creating currency:', error)
      // You might want to show a toast or error message here
    } finally {
      setLoading(false)
    }
  }

  return (
    <SheetContent className="w-[500px] sm:max-w-[500px] bg-surface-secondary backdrop-blur-xl border-border-primary">
      <div className="h-full flex flex-col">
        <SheetHeader className="border-b border-border-secondary pb-4">
          <SheetTitle className="text-xl font-semibold text-text-primary">Nueva Moneda</SheetTitle>
          <p className="text-text-secondary text-sm">Crear una nueva moneda para la plataforma</p>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="flex-1 space-y-6 p-6 overflow-y-auto">
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary block">
                Código de Moneda *
              </label>
              <Input
                placeholder="USD, EUR, MXN..."
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="glassmorphism-input w-full h-12 font-mono"
                maxLength={3}
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-text-primary block">
                Nombre de la Moneda *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-text-secondary block mb-1">Español</label>
                  <Input
                    placeholder="Peso Mexicano, Dólar Estadounidense..."
                    value={formData.name.es || ''}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, es: e.target.value } })}
                    className="glassmorphism-input w-full h-10"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-secondary block mb-1">Inglés</label>
                  <Input
                    placeholder="Mexican Peso, US Dollar..."
                    value={formData.name.en || ''}
                    onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                    className="glassmorphism-input w-full h-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-medium text-text-primary block">
                  Símbolo *
                </label>
                <Input
                  placeholder="$, €, £..."
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  className="glassmorphism-input w-full h-12"
                  maxLength={3}
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-text-primary block">
                  Lugares Decimales
                </label>
                <Input
                  type="number"
                  min="0"
                  max="8"
                  value={formData.decimal_places}
                  onChange={(e) => setFormData({ ...formData, decimal_places: parseInt(e.target.value) || 0 })}
                  className="glassmorphism-input w-full h-12"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary block">
                Estado
              </label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={formData.is_active ? "default" : "outline"}
                  size="default"
                  className="flex-1 h-12"
                  onClick={() => setFormData({ ...formData, is_active: true })}
                >
                  Activa
                </Button>
                <Button
                  type="button"
                  variant={!formData.is_active ? "default" : "outline"}
                  size="default"
                  className="flex-1 h-12"
                  onClick={() => setFormData({ ...formData, is_active: false })}
                >
                  Inactiva
                </Button>
              </div>
            </div>

            {/* Preview */}
            {formData.code && formData.symbol && (
              <div className="border-t border-border-secondary pt-6">
                <div className="bg-surface-elevated backdrop-blur-xl border border-border-secondary p-4 rounded-xl">
                  <p className="text-sm font-medium text-text-primary mb-3">Vista Previa</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-interactive-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-interactive-primary">{formData.symbol}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-mono font-bold text-sm text-text-primary">{formData.code}</p>
                      <p className="text-xs text-text-secondary">{formData.name.es || formData.name.en || 'Nombre de moneda'}</p>
                    </div>
                    <Badge variant={formData.is_active ? "default" : "secondary"} className="text-xs">
                      {formData.is_active ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>

          <SheetFooter className="border-t border-border-secondary p-6">
            <div className="flex gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="flex-1 h-12"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.code || (!formData.name.es && !formData.name.en) || !formData.symbol}
                className="flex-1 h-12 bg-interactive-primary text-text-inverse hover:bg-interactive-active"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Crear Moneda
              </Button>
            </div>
          </SheetFooter>
        </form>
      </div>
    </SheetContent>
  )
}