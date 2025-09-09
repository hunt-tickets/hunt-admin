"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Country, Currency } from "@/lib/db"
import { useCurrenciesContext } from "@/contexts/currencies-context"
import { Loader2, Globe, Phone, DollarSign, MessageCircle, Mail } from "lucide-react"

interface EditCountryFormProps {
  country: Country
  currencies: Currency[]
  onSuccess: (country: Country) => void
  onCancel: () => void
}

export function EditCountryForm({ country, currencies, onSuccess, onCancel }: EditCountryFormProps) {
  const { updateCountry, deleteCountry } = useCurrenciesContext()
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    phone_prefix: "",
    default_currency_id: "",
    is_active: true,
    whatsapp_support_phone: "",
    support_email: "",
    privacy_policy_url: "",
    refund_policy_url: "",
    terms_of_service_url: ""
  })

  // Initialize form with country data
  useEffect(() => {
    if (country) {
      setFormData({
        name: country.name || "",
        code: country.code || "",
        phone_prefix: country.phone_prefix || "",
        default_currency_id: country.default_currency_id || "",
        is_active: country.is_active ?? true,
        whatsapp_support_phone: country.whatsapp_support_phone || "",
        support_email: country.support_email || "",
        privacy_policy_url: country.privacy_policy_url || "",
        refund_policy_url: country.refund_policy_url || "",
        terms_of_service_url: country.terms_of_service_url || ""
      })
    }
  }, [country])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.code || !formData.phone_prefix) {
      return
    }

    setLoading(true)
    
    try {
      const updatedCountry = await updateCountry(country.id, {
        ...formData,
        default_currency_id: formData.default_currency_id || null,
        whatsapp_support_phone: formData.whatsapp_support_phone || null,
        support_email: formData.support_email || null,
        privacy_policy_url: formData.privacy_policy_url || null,
        refund_policy_url: formData.refund_policy_url || null,
        terms_of_service_url: formData.terms_of_service_url || null
      })
      onSuccess(updatedCountry)
    } catch (error) {
      console.error('Error updating country:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteCountry(country.id)
      setShowDeleteConfirm(false)
      setDeleteConfirmText('')
      onCancel() // Close the edit form
    } catch (error) {
      console.error('Error deleting country:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const confirmationText = `eliminar ${country.name}`
  const isConfirmValid = deleteConfirmText === confirmationText

  const selectedCurrency = currencies.find(c => c.id === formData.default_currency_id)

  return (
    <SheetContent className="w-[600px] sm:max-w-[600px] bg-surface-secondary backdrop-blur-xl border-border-primary overflow-y-auto">
      <div className="h-full flex flex-col">
        <SheetHeader className="border-b border-border-secondary pb-4">
          <SheetTitle className="text-xl font-semibold text-text-primary">Editar País</SheetTitle>
          <p className="text-text-secondary text-sm">Modificar los datos del país {country.name}</p>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="flex-1 space-y-8 p-6 overflow-y-auto">
            {/* Basic Info */}
            <div className="space-y-6">
              <div className="border-b border-border-secondary pb-4">
                <h3 className="text-lg font-semibold text-text-primary">Información Básica</h3>
                <p className="text-text-secondary text-sm">Datos generales del país</p>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-text-primary block">
                  Nombre del País *
                </label>
                <Input
                  placeholder="México, Estados Unidos..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="glassmorphism-input w-full h-12"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary block">
                    Código ISO *
                  </label>
                  <Input
                    placeholder="MX, US, ES..."
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="glassmorphism-input w-full h-12 font-mono"
                    maxLength={2}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary block">
                    Prefijo Telefónico *
                  </label>
                  <Input
                    placeholder="+52, +1, +34..."
                    value={formData.phone_prefix}
                    onChange={(e) => setFormData({ ...formData, phone_prefix: e.target.value })}
                    className="glassmorphism-input w-full h-12 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-text-primary block">
                  Moneda por Defecto
                </label>
                <Select
                  value={formData.default_currency_id}
                  onValueChange={(value) => setFormData({ ...formData, default_currency_id: value })}
                >
                  <SelectTrigger className="glassmorphism-input w-full h-12">
                    <SelectValue placeholder="Seleccionar moneda..." />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.id} value={currency.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold">{currency.code}</span>
                          <span className="text-text-secondary">-</span>
                          <span>{typeof currency.name === 'string' ? currency.name : currency.name?.es || currency.name?.en || 'N/A'}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-text-primary block">Estado</label>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={formData.is_active ? "default" : "outline"}
                    size="default"
                    className="flex-1 h-12"
                    onClick={() => setFormData({ ...formData, is_active: true })}
                  >
                    Activo
                  </Button>
                  <Button
                    type="button"
                    variant={!formData.is_active ? "default" : "outline"}
                    size="default"
                    className="flex-1 h-12"
                    onClick={() => setFormData({ ...formData, is_active: false })}
                  >
                    Inactivo
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="border-b border-border-secondary pb-4">
                <h3 className="text-lg font-semibold text-text-primary">Información de Contacto</h3>
                <p className="text-text-secondary text-sm">Canales de soporte para usuarios</p>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-text-primary block">
                  WhatsApp de Soporte
                </label>
                <Input
                  placeholder="+52 55 1234 5678"
                  value={formData.whatsapp_support_phone}
                  onChange={(e) => setFormData({ ...formData, whatsapp_support_phone: e.target.value })}
                  className="glassmorphism-input w-full h-12 font-mono"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-text-primary block">
                  Email de Soporte
                </label>
                <Input
                  type="email"
                  placeholder="soporte@hunttickets.mx"
                  value={formData.support_email}
                  onChange={(e) => setFormData({ ...formData, support_email: e.target.value })}
                  className="glassmorphism-input w-full h-12"
                />
              </div>
            </div>

            {/* Policies */}
            <div className="space-y-6">
              <div className="border-b border-border-secondary pb-4">
                <h3 className="text-lg font-semibold text-text-primary">Políticas y Términos</h3>
                <p className="text-text-secondary text-sm">Documentos legales del país</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary block">
                    URL Política de Privacidad
                  </label>
                  <Input
                    type="url"
                    placeholder="https://hunttickets.com/privacy-mx"
                    value={formData.privacy_policy_url}
                    onChange={(e) => setFormData({ ...formData, privacy_policy_url: e.target.value })}
                    className="glassmorphism-input w-full h-12"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary block">
                    URL Política de Reembolsos
                  </label>
                  <Input
                    type="url"
                    placeholder="https://hunttickets.com/refunds-mx"
                    value={formData.refund_policy_url}
                    onChange={(e) => setFormData({ ...formData, refund_policy_url: e.target.value })}
                    className="glassmorphism-input w-full h-12"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary block">
                    URL Términos de Servicio
                  </label>
                  <Input
                    type="url"
                    placeholder="https://hunttickets.com/terms-mx"
                    value={formData.terms_of_service_url}
                    onChange={(e) => setFormData({ ...formData, terms_of_service_url: e.target.value })}
                    className="glassmorphism-input w-full h-12"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            {formData.name && formData.code && (
              <div className="border-t border-border-secondary pt-6">
                <div className="bg-surface-elevated backdrop-blur-xl border border-border-secondary p-4 rounded-xl">
                  <p className="text-sm font-medium text-text-primary mb-4">Vista Previa</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-interactive-primary/10 rounded-full flex items-center justify-center">
                          <Globe className="h-4 w-4 text-interactive-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{formData.name}</h3>
                          <p className="text-xs font-mono text-text-secondary">{formData.code}</p>
                        </div>
                      </div>
                      <Badge variant={formData.is_active ? "default" : "secondary"} className="text-xs">
                        {formData.is_active ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-text-secondary" />
                        <span className="font-mono">{formData.phone_prefix || '-'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-text-secondary" />
                        <span className="font-mono">{selectedCurrency?.code || '-'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        formData.whatsapp_support_phone ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <MessageCircle className="h-3 w-3" />
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        formData.support_email ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Mail className="h-3 w-3" />
                      </div>
                      <div className="ml-auto flex gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          formData.privacy_policy_url ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        <div className={`w-2 h-2 rounded-full ${
                          formData.refund_policy_url ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        <div className={`w-2 h-2 rounded-full ${
                          formData.terms_of_service_url ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
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
                      <h5 className="font-medium text-status-error">Eliminar País</h5>
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
                disabled={loading || !formData.name || !formData.code || !formData.phone_prefix}
                className="flex-1 h-12 bg-interactive-primary text-text-inverse hover:bg-interactive-active"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Actualizar País
              </Button>
            </div>
          </SheetFooter>
        </form>
      </div>
    </SheetContent>
  )
}