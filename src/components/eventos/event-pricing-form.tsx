"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface PricingFormData {
  currency: string;
  tax_included: boolean;
  tax_rate: string;
  service_fee: string;
  payment_methods: string[];
  early_bird_discount: string;
  early_bird_end_date: string;
  group_discount: boolean;
  group_discount_min: string;
  group_discount_rate: string;
}

export function EventPricingForm() {
  const [formData, setFormData] = useState<PricingFormData>({
    currency: 'COP',
    tax_included: true,
    tax_rate: '19',
    service_fee: '5',
    payment_methods: ['credit_card', 'debit_card'],
    early_bird_discount: '',
    early_bird_end_date: '',
    group_discount: false,
    group_discount_min: '5',
    group_discount_rate: '10'
  });

  const togglePaymentMethod = (method: string) => {
    setFormData(prev => ({
      ...prev,
      payment_methods: prev.payment_methods.includes(method)
        ? prev.payment_methods.filter(m => m !== method)
        : [...prev.payment_methods, method]
    }));
  };

  const paymentMethods = [
    { id: 'credit_card', label: 'Tarjeta de Crédito', icon: '💳' },
    { id: 'debit_card', label: 'Tarjeta Débito', icon: '💳' },
    { id: 'pse', label: 'PSE', icon: '🏦' },
    { id: 'nequi', label: 'Nequi', icon: '📱' },
    { id: 'daviplata', label: 'Daviplata', icon: '📱' },
    { id: 'efecty', label: 'Efecty', icon: '🏪' },
    { id: 'baloto', label: 'Baloto', icon: '🎯' }
  ];

  return (
    <div className="max-w-4xl">
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Precios</h3>
            <p className="text-text-secondary">
              Configura los aspectos financieros y métodos de pago para tu evento.
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Currency and Tax Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Moneda</label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                    <SelectTrigger className="glassmorphism-input w-full h-12">
                      <SelectValue placeholder="Selecciona la moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                      <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Tasa de Impuesto (%)</label>
                  <Input
                    type="number"
                    value={formData.tax_rate}
                    onChange={(e) => setFormData({...formData, tax_rate: e.target.value})}
                    placeholder="19"
                    className="glassmorphism-input w-full h-12"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Tarifa de Servicio (%)</label>
                  <Input
                    type="number"
                    value={formData.service_fee}
                    onChange={(e) => setFormData({...formData, service_fee: e.target.value})}
                    placeholder="5"
                    className="glassmorphism-input w-full h-12"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-border-secondary">
                <div>
                  <h4 className="text-sm font-medium text-text-primary">Impuestos Incluidos</h4>
                  <p className="text-xs text-text-secondary">Los precios mostrados incluyen impuestos</p>
                </div>
                <Switch
                  checked={formData.tax_included}
                  onCheckedChange={(checked) => setFormData({...formData, tax_included: checked})}
                />
              </div>
            </div>

            {/* Payment Methods Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div>
                <h4 className="text-sm font-medium text-text-secondary mb-4">Métodos de Pago Aceptados</h4>
                <div className="grid grid-cols-3 gap-3">
                  {paymentMethods.map((method) => {
                    const isSelected = formData.payment_methods.includes(method.id);
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => togglePaymentMethod(method.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                          isSelected 
                            ? 'border-interactive-primary bg-interactive-primary/10' 
                            : 'border-border-secondary hover:bg-surface-elevated'
                        }`}
                      >
                        <span className="text-lg">{method.icon}</span>
                        <span className={`text-sm font-medium ${
                          isSelected ? 'text-interactive-primary' : 'text-text-primary'
                        }`}>
                          {method.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Discounts Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <h4 className="text-sm font-medium text-text-secondary mb-4">Descuentos</h4>
              
              {/* Early Bird Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Descuento Preventa (%)</label>
                  <Input
                    type="number"
                    value={formData.early_bird_discount}
                    onChange={(e) => setFormData({...formData, early_bird_discount: e.target.value})}
                    placeholder="15"
                    className="glassmorphism-input w-full h-12"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-3">Fecha Límite Preventa</label>
                  <Input
                    type="date"
                    value={formData.early_bird_end_date}
                    onChange={(e) => setFormData({...formData, early_bird_end_date: e.target.value})}
                    className="glassmorphism-input w-full h-12"
                  />
                </div>
              </div>

              {/* Group Discount */}
              <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-border-secondary">
                <div>
                  <h4 className="text-sm font-medium text-text-primary">Descuento por Grupo</h4>
                  <p className="text-xs text-text-secondary">Aplicar descuento para compras grupales</p>
                </div>
                <Switch
                  checked={formData.group_discount}
                  onCheckedChange={(checked) => setFormData({...formData, group_discount: checked})}
                />
              </div>

              {formData.group_discount && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-text-primary block mb-3">Mínimo para Descuento</label>
                    <Input
                      type="number"
                      value={formData.group_discount_min}
                      onChange={(e) => setFormData({...formData, group_discount_min: e.target.value})}
                      placeholder="5"
                      className="glassmorphism-input w-full h-12"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-primary block mb-3">Descuento Grupo (%)</label>
                    <Input
                      type="number"
                      value={formData.group_discount_rate}
                      onChange={(e) => setFormData({...formData, group_discount_rate: e.target.value})}
                      placeholder="10"
                      className="glassmorphism-input w-full h-12"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}