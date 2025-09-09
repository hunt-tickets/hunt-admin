"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Invoice } from "@/lib/db"
import { useInvoicesContext } from "@/contexts/invoices-context"
import { useCurrencies } from "@/hooks/use-currencies"
import { useCompanies } from "@/hooks/use-companies"
import { AutocompleteInput } from "@/components/ui/autocomplete-input"
import { Loader2, Receipt, Building2, User, DollarSign, FileText } from "lucide-react"

interface CreateInvoiceFormProps {
  onSuccess: (invoice: Invoice) => void
  onCancel: () => void
}

export function CreateInvoiceForm({ onSuccess, onCancel }: CreateInvoiceFormProps) {
  const { createInvoice } = useInvoicesContext()
  const { currencies } = useCurrencies()
  const { companies } = useCompanies()
  const [loading, setLoading] = useState(false)
  
  // Usar USD como default (basado en hunt-backend migrations)
  const defaultCurrency = currencies.find(c => c.code === 'USD')?.code || 'USD'
  
  const [formData, setFormData] = useState({
    company_name: "",
    description: "",
    subtotal: "",
    tax: "",
    invoice_to: "",
    currency: defaultCurrency,
    payment_method: "",
    is_paid: false
  })

  const total = (parseFloat(formData.subtotal) || 0) + (parseFloat(formData.tax) || 0)
  
  // Helper para formatear currency usando los datos reales
  const formatCurrency = (amount: number, currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode)
    if (!currency) return `${currencyCode} ${amount.toFixed(2)}`
    
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.decimal_places || 2,
      maximumFractionDigits: currency.decimal_places || 2,
    }).format(amount)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.company_name || !formData.subtotal || !formData.invoice_to) {
      return
    }

    setLoading(true)
    
    try {
      const newInvoice = await createInvoice({
        company_name: formData.company_name,
        description: formData.description || undefined,
        subtotal: parseFloat(formData.subtotal),
        tax: parseFloat(formData.tax) || 0,
        total: total,
        invoice_to: formData.invoice_to,
        currency: formData.currency,
        payment_method: formData.payment_method || undefined,
        paid_at: formData.is_paid ? new Date().toISOString() : undefined,
        metadata: {}
      })
      onSuccess(newInvoice)
    } catch (error) {
      console.error('Error creating invoice:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SheetContent className="w-[500px] sm:max-w-[500px] bg-surface-secondary backdrop-blur-xl border-border-primary">
      <div className="h-full flex flex-col">
        <SheetHeader className="border-b border-border-secondary pb-4">
          <SheetTitle className="text-xl font-semibold text-text-primary">Nueva Factura</SheetTitle>
          <p className="text-text-secondary text-sm">Crear una nueva factura</p>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="flex-1 space-y-6 p-6 overflow-y-auto">
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary block">
                <Building2 className="inline w-4 h-4 mr-1" />
                Empresa *
              </label>
              <AutocompleteInput
                options={companies}
                value={formData.company_name}
                onChange={(value) => setFormData({ ...formData, company_name: value })}
                placeholder="Escribir o seleccionar empresa..."
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary block">
                <User className="inline w-4 h-4 mr-1" />
                Facturar a *
              </label>
              <Input
                placeholder="Cliente, Departamento..."
                value={formData.invoice_to}
                onChange={(e) => setFormData({ ...formData, invoice_to: e.target.value })}
                className="glassmorphism-input w-full h-12"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary block">
                <FileText className="inline w-4 h-4 mr-1" />
                Descripción
              </label>
              <Textarea
                placeholder="Servicios de consultoría, productos..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="glassmorphism-input w-full min-h-[80px]"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-medium text-text-primary block">
                  <DollarSign className="inline w-4 h-4 mr-1" />
                  Subtotal *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="1000.00"
                  value={formData.subtotal}
                  onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                  className="glassmorphism-input w-full h-12"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-text-primary block">
                  Impuesto
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="160.00"
                  value={formData.tax}
                  onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                  className="glassmorphism-input w-full h-12"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-text-primary block">
                  Total
                </label>
                <div className="glassmorphism-input w-full h-12 flex items-center px-3 text-text-primary font-semibold">
                  {formatCurrency(total, formData.currency)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-medium text-text-primary block">
                  Moneda
                </label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                  <SelectTrigger className="glassmorphism-input w-full h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-secondary backdrop-blur-xl border-border-primary">
                    {currencies.map((currency) => (
                      <SelectItem key={currency.id} value={currency.code}>
                        {currency.code} ({currency.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-text-primary block">
                  Método de Pago
                </label>
                <Input
                  placeholder="Tarjeta de crédito, PayPal, Transferencia..."
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  className="glassmorphism-input w-full h-12"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="is_paid" 
                checked={formData.is_paid}
                onCheckedChange={(checked) => setFormData({ ...formData, is_paid: checked === true })}
              />
              <label htmlFor="is_paid" className="text-sm font-medium text-text-primary">
                Marcar como pagado
              </label>
            </div>

            {/* Preview */}
            {formData.company_name && formData.invoice_to && formData.subtotal && (
              <div className="border-t border-border-secondary pt-6">
                <div className="bg-surface-elevated backdrop-blur-xl border border-border-secondary p-4 rounded-xl">
                  <p className="text-sm font-medium text-text-primary mb-3">Vista Previa</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-interactive-primary/10 rounded-full flex items-center justify-center">
                        <Receipt className="h-4 w-4 text-interactive-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{formData.company_name}</h3>
                        <p className="text-xs text-text-secondary">{formData.invoice_to}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-text-primary">
                          {formatCurrency(total, formData.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-text-secondary">
                        <span>Subtotal: {formatCurrency(parseFloat(formData.subtotal) || 0, formData.currency)}</span>
                        <span>Tax: {formatCurrency(parseFloat(formData.tax) || 0, formData.currency)}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border-secondary">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded ${formData.is_paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {formData.is_paid ? "Pagado" : "Pendiente"}
                        </span>
                        {formData.payment_method && (
                          <p className="text-xs text-text-secondary uppercase tracking-wide">
                            {formData.payment_method.replace('_', ' ')}
                          </p>
                        )}
                      </div>
                    </div>
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
                disabled={loading || !formData.company_name || !formData.subtotal || !formData.invoice_to}
                className="flex-1 h-12 bg-interactive-primary text-text-inverse hover:bg-interactive-active"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Crear Factura
              </Button>
            </div>
          </SheetFooter>
        </form>
      </div>
    </SheetContent>
  )
}