"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Invoice } from "@/lib/db"
import { useInvoicesContext } from "@/contexts/invoices-context"
import { useCurrencies } from "@/hooks/use-currencies"
import { useCompanies } from "@/hooks/use-companies"
import { AutocompleteInput } from "@/components/ui/autocomplete-input"
import { Loader2, Receipt, Building2, User, DollarSign, FileText, ExternalLink, Download } from "lucide-react"

interface EditInvoiceFormProps {
  invoice: Invoice
  onSuccess: (invoice: Invoice) => void
  onCancel: () => void
}

export function EditInvoiceForm({ invoice, onSuccess, onCancel }: EditInvoiceFormProps) {
  const { updateInvoice, deleteInvoice } = useInvoicesContext()
  const { currencies } = useCurrencies()
  const { companies } = useCompanies()
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState('information')
  const [pdfSignedUrl, setPdfSignedUrl] = useState<string | null>(null)
  const [loadingPdf, setLoadingPdf] = useState(false)
  
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

  // Función para obtener el signed URL del PDF desde la API
  const fetchSignedPdfUrl = async (invoiceId: string) => {
    try {
      setLoadingPdf(true)
      console.log('Fetching signed URL for invoice:', invoiceId)
      
      const response = await fetch(`/api/invoices/${invoiceId}/pdf-url`)
      
      if (!response.ok) {
        console.log('Could not get signed URL, PDF will show as unavailable')
        return // No mostrar error, simplemente dejar como no disponible
      }
      
      const data = await response.json()
      console.log('API Response:', data)
      
      if (data.signedUrl) {
        setPdfSignedUrl(data.signedUrl)
        console.log('Successfully set signed URL')
      }
    } catch (error) {
      console.log('Could not load PDF, but tabs interface will still work')
    } finally {
      setLoadingPdf(false)
    }
  }

  // Función para abrir el PDF en una nueva pestaña
  const viewInvoicePdf = () => {
    if (pdfSignedUrl) {
      window.open(pdfSignedUrl, '_blank')
    }
  }

  // Función para descargar el PDF
  const downloadInvoicePdf = () => {
    if (pdfSignedUrl) {
      const link = document.createElement('a')
      link.href = pdfSignedUrl
      link.download = `factura-${invoice.company_name.replace(/\s+/g, '-').toLowerCase()}-${invoice.id.slice(0, 8)}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Initialize form with invoice data
  useEffect(() => {
    if (invoice) {
      setFormData({
        company_name: invoice.company_name || "",
        description: invoice.description || "",
        subtotal: invoice.subtotal?.toString() || "",
        tax: invoice.tax?.toString() || "",
        invoice_to: invoice.invoice_to || "",
        currency: invoice.currency || defaultCurrency,
        payment_method: invoice.payment_method || "",
        is_paid: !!invoice.paid_at
      })
      
      // Cargar el signed URL del PDF
      fetchSignedPdfUrl(invoice.id)
    }
  }, [invoice])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.company_name || !formData.subtotal || !formData.invoice_to) {
      return
    }

    setLoading(true)
    
    try {
      const updatedInvoice = await updateInvoice(invoice.id, {
        company_name: formData.company_name,
        description: formData.description || undefined,
        subtotal: parseFloat(formData.subtotal),
        tax: parseFloat(formData.tax) || 0,
        total: total,
        invoice_to: formData.invoice_to,
        currency: formData.currency,
        payment_method: formData.payment_method || undefined,
        paid_at: formData.is_paid ? new Date().toISOString() : undefined,
        metadata: invoice.metadata || {}
      })
      onSuccess(updatedInvoice)
    } catch (error) {
      console.error('Error updating invoice:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteInvoice(invoice.id)
      setShowDeleteConfirm(false)
      setDeleteConfirmText('')
      onCancel() // Close the edit form
    } catch (error) {
      console.error('Error deleting invoice:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const confirmationText = `eliminar ${invoice.company_name}`
  const isConfirmValid = deleteConfirmText === confirmationText

  return (
    <SheetContent className="w-[500px] sm:max-w-[500px] bg-surface-secondary backdrop-blur-xl border-border-primary">
      <div className="h-full flex flex-col">
        <SheetHeader className="border-b border-border-secondary pb-4">
          <div>
            <SheetTitle className="text-xl font-semibold text-text-primary">Editar Factura</SheetTitle>
            <p className="text-text-secondary text-sm">Modificar los datos de {invoice.company_name}</p>
          </div>
        </SheetHeader>
        
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-6 pt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="information">Información</TabsTrigger>
                <TabsTrigger value="factura">Factura</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="information" className="flex-1 flex flex-col m-0">
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

                  {/* Danger Zone */}
                  <div className="mt-8 pt-8 border-t border-status-error/20">
                    <div className="bg-status-error/5 border border-status-error/20 rounded-lg p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-status-error">Eliminar Factura</h5>
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
                      disabled={loading || !formData.company_name || !formData.subtotal || !formData.invoice_to}
                      className="flex-1 h-12 bg-interactive-primary text-text-inverse hover:bg-interactive-active"
                    >
                      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Actualizar Factura
                    </Button>
                  </div>
                </SheetFooter>
              </form>
            </TabsContent>

            <TabsContent value="factura" className="flex-1 flex flex-col m-0">
              <div className="flex-1 p-6 space-y-6">
                {/* Header con acciones PDF */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">Factura PDF</h3>
                    <p className="text-sm text-text-secondary">
                      Vista previa del documento generado
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={viewInvoicePdf}
                      disabled={!pdfSignedUrl || loadingPdf}
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Abrir en nueva pestaña
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={downloadInvoicePdf}
                      disabled={!pdfSignedUrl || loadingPdf}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Descargar
                    </Button>
                  </div>
                </div>

                {/* PDF Preview */}
                <div className="flex-1 bg-surface-elevated backdrop-blur-xl border border-border-secondary rounded-xl overflow-hidden">
                  {loadingPdf ? (
                    <div className="flex-1 flex items-center justify-center h-96">
                      <div className="text-center space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin text-interactive-primary mx-auto" />
                        <p className="text-sm text-text-secondary">Cargando vista previa...</p>
                      </div>
                    </div>
                  ) : pdfSignedUrl ? (
                    <iframe
                      src={pdfSignedUrl}
                      className="w-full h-full min-h-[600px]"
                      title={`Factura ${invoice.company_name}`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex-1 flex items-center justify-center h-96">
                      <div className="text-center space-y-3">
                        <FileText className="w-12 h-12 text-text-secondary mx-auto" />
                        <div>
                          <p className="font-medium text-text-primary">PDF no disponible</p>
                          <p className="text-sm text-text-secondary">No se pudo cargar la vista previa del PDF</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Información del archivo */}
                <div className="bg-surface-elevated/50 backdrop-blur border border-border-secondary rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-interactive-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-interactive-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-text-primary">
                        factura-{invoice.company_name.replace(/\s+/g, '-').toLowerCase()}-{invoice.id.slice(0, 8)}.pdf
                      </p>
                      <p className="text-xs text-text-secondary">
                        Creada el {new Date(invoice.created_at).toLocaleDateString('es-ES')} • Factura ID: {invoice.id.slice(0, 8)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-text-secondary">Almacenado en</p>
                      <p className="text-xs font-mono text-text-primary">hunt-tickets/invoices</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <SheetFooter className="border-t border-border-secondary p-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="w-full h-12"
                >
                  Cerrar
                </Button>
              </SheetFooter>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SheetContent>
  )
}