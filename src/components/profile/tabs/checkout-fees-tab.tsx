"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info, AlertTriangle, Percent } from "lucide-react";
import type { TabContentProps } from "@/types/tabs";

interface CheckoutFeesSettings {
  transactionPercentage: string;
  transactionFixedAmount: string;
  taxTreatment: 'exclusive' | 'inclusive';
  taxAmount: string;
  taxLabel: string;
}

export function CheckoutFeesTab({ producerId, currentProducer }: TabContentProps) {
  const [settings, setSettings] = useState<CheckoutFeesSettings>({
    transactionPercentage: '',
    transactionFixedAmount: '',
    taxTreatment: 'exclusive',
    taxAmount: '',
    taxLabel: 'IVA'
  });

  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (key: keyof CheckoutFeesSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setHasChanges(false);
    }, 1000);
  };

  const resetSettings = () => {
    setSettings({
      transactionPercentage: '',
      transactionFixedAmount: '',
      taxTreatment: 'exclusive',
      taxAmount: '',
      taxLabel: 'IVA'
    });
    setHasChanges(false);
  };

  if (!currentProducer) {
    return (
      <div className="text-center text-muted-foreground">
        Selecciona un productor para configurar tarifas de checkout
      </div>
    );
  }

  return (
    <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-text-primary">Tarifas de Checkout e Impuestos</h3>
        <p className="text-text-secondary">
          Configura las tarifas de transacción e impuestos que se aplicarán en el checkout.
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-200">
            Estas son configuraciones predeterminadas y también pueden ser anuladas para cada evento en 'Configuración avanzada' en el formulario de edición de evento.
          </div>
        </div>
      </div>

      {/* Transaction Fees */}
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-text-primary mb-2">Tarifas de Transacción</h4>
          <p className="text-sm text-text-secondary mb-4">
            Las tarifas de transacción se pueden cobrar una vez por pedido. Establece un monto fijo, un porcentaje del monto del pedido, o una combinación de ambos. Establece en cero para no cobrar una tarifa de transacción.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary">Porcentaje</label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={settings.transactionPercentage}
                  onChange={(e) => updateSetting('transactionPercentage', e.target.value)}
                  placeholder="0.00"
                  className="glassmorphism-input w-full h-12 pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  <Percent className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-primary">Monto Fijo</label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.transactionFixedAmount}
                  onChange={(e) => updateSetting('transactionFixedAmount', e.target.value)}
                  placeholder="0.00"
                  className="glassmorphism-input w-full h-12 pl-8"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  $
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Tax */}
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-text-primary mb-2">Impuesto sobre Ventas</h4>
            
            {/* Tax Disclaimer */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-200">
                  <strong>DESCARGO DE RESPONSABILIDAD:</strong> El cumplimiento fiscal es tu responsabilidad. No garantizamos la aplicabilidad o precisión de nuestras herramientas fiscales. Si tienes alguna pregunta sobre tus obligaciones fiscales, debes consultar a un asesor fiscal profesional.
                </div>
              </div>
            </div>

            {/* Tax Treatment */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                  Tratamiento del Impuesto
                  <span className="text-red-400">*</span>
                  <Info className="w-3 h-3 text-text-tertiary" />
                </label>
                <div className="mt-3 space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="taxTreatment"
                      value="exclusive"
                      checked={settings.taxTreatment === 'exclusive'}
                      onChange={(e) => updateSetting('taxTreatment', e.target.value as 'exclusive' | 'inclusive')}
                      className="w-4 h-4 text-interactive-primary focus:ring-2 focus:ring-interactive-primary"
                    />
                    <div>
                      <span className="text-sm text-text-primary font-medium">Exclusivo</span>
                      <p className="text-xs text-text-secondary">se cobrará impuesto adicional a la tasa establecida</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="taxTreatment"
                      value="inclusive"
                      checked={settings.taxTreatment === 'inclusive'}
                      onChange={(e) => updateSetting('taxTreatment', e.target.value as 'exclusive' | 'inclusive')}
                      className="w-4 h-4 text-interactive-primary focus:ring-2 focus:ring-interactive-primary"
                    />
                    <div>
                      <span className="text-sm text-text-primary font-medium">Inclusivo</span>
                      <p className="text-xs text-text-secondary">asume que el impuesto ya está incluido en los precios establecidos</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Tax Amount and Label */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary">Monto</label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={settings.taxAmount}
                      onChange={(e) => updateSetting('taxAmount', e.target.value)}
                      placeholder="0.00"
                      className="glassmorphism-input w-full h-12 pr-10"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
                      <Percent className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-text-primary">Etiqueta</label>
                  <Input
                    value={settings.taxLabel}
                    onChange={(e) => updateSetting('taxLabel', e.target.value)}
                    placeholder="IVA"
                    className="glassmorphism-input w-full h-12"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6">
        <Button 
          variant="outline" 
          className="hover:bg-interactive-secondary border-border-secondary text-text-primary px-6"
          onClick={resetSettings}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSave}
          disabled={loading || !hasChanges}
          className="bg-green-600 text-white hover:bg-green-700 font-medium disabled:opacity-50 px-6"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </div>
  );
}