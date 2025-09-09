"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Currency } from "@/lib/db"
import { useCurrenciesContext } from "@/contexts/currencies-context"
import { Loader2 } from "lucide-react"

interface EditCurrencyFormProps {
  currency: Currency
  onSuccess: (currency: Currency) => void
  onCancel: () => void
}

export function EditCurrencyForm({ currency, onSuccess, onCancel }: EditCurrencyFormProps) {
  const { updateCurrency, deleteCurrency } = useCurrenciesContext()
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
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

  // Initialize form with currency data
  useEffect(() => {
    if (currency) {
      const name = typeof currency.name === 'string' 
        ? { es: currency.name, en: '' }
        : {
            es: currency.name?.es || '',
            en: currency.name?.en || ''
          }
      
      setFormData({
        code: currency.code || "",
        name: name,
        symbol: currency.symbol || "",
        decimal_places: currency.decimal_places || 2,
        is_active: currency.is_active ?? true
      })
    }
  }, [currency])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.code || (!formData.name.es && !formData.name.en) || !formData.symbol) {
      return
    }

    setLoading(true)
    
    try {
      const updatedCurrency = await updateCurrency(currency.id, {
        ...formData,
        name: formData.name // Store as JSONB object
      })
      onSuccess(updatedCurrency)
    } catch (error) {
      console.error('Error updating currency:', error)
      // You might want to show a toast or error message here
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteCurrency(currency.id)
      setShowDeleteConfirm(false)
      setDeleteConfirmText('')
      onCancel() // Close the edit form
    } catch (error) {
      console.error('Error deleting currency:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const confirmationText = `eliminar ${currency.code}`
  const isConfirmValid = deleteConfirmText === confirmationText

  return (
    <SheetContent className="w-[500px] sm:max-w-[500px] bg-surface-secondary backdrop-blur-xl border-border-primary">
      <div className="h-full flex flex-col">
        <SheetHeader className="border-b border-border-secondary pb-4">
          <SheetTitle className="text-xl font-semibold text-text-primary">Editar Moneda</SheetTitle>
          <p className="text-text-secondary text-sm">Modificar los datos de la moneda {currency.code}</p>
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

            {/* Danger Zone */}
            <div className="mt-8 pt-8 border-t border-status-error/20">
              <div className="bg-status-error/5 border border-status-error/20 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-status-error">Eliminar Moneda</h5>
                      <p className="text-sm text-muted-foreground">
                        Esta acción es permanente y no se puede deshacer.
                      </p>
                    </div>
                    {!showDeleteConfirm && (
                      <Button 
                        variant="outline"
                        className="border-status-error/50 text-status-error hover:bg-status-error/10 hover:border-status-error"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                  
                  {showDeleteConfirm && (
                    <div className="space-y-4 animate-in slide-in-from-top-2">
                      <p className="text-sm text-muted-foreground">
                        Escribe <span className="font-mono bg-interactive-secondary px-2 py-1 rounded text-text-primary">{confirmationText}</span> para confirmar
                      </p>
                      <Input
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder={confirmationText}
                        className="glassmorphism-input w-full h-10 font-mono"
                      />
                      <div className="flex gap-3">
                        <Button 
                          variant="outline"
                          className="flex-1 hover:bg-interactive-secondary border-border-secondary text-text-primary"
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeleteConfirmText('');
                          }}
                          disabled={isDeleting}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleDelete}
                          disabled={!isConfirmValid || isDeleting}
                          className="flex-1 bg-status-error hover:bg-status-error text-text-primary disabled:opacity-50"
                        >
                          {isDeleting ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
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
                Actualizar Moneda
              </Button>
            </div>
          </SheetFooter>
        </form>
      </div>
    </SheetContent>
  )
}