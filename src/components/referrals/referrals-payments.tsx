"use client"

import { Receipt, Clock, CheckCircle2 } from "lucide-react"

export function ReferralsPayments() {
  // Mock data - esto vendría de una API/database
  const payments: Array<{ amount: number; datePaid: string; id: string; status: 'completed' | 'pending' | 'processing' }> = []
  
  // Mock upcoming payments
  const upcomingPayments = [
    { amount: 0.00, dueDate: '2024-10-15', status: 'pending' as const },
  ]

  return (
    <div className="space-y-6">
      {/* Próximos Pagos */}
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-status-warning/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-status-warning" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary">Próximos Pagos</h3>
        </div>
        
        {upcomingPayments.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-text-secondary" />
            </div>
            <h4 className="font-medium text-text-primary mb-2">No hay pagos programados</h4>
            <p className="text-text-secondary text-sm">
              Los pagos se procesarán cuando tengas ganancias disponibles.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingPayments.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-surface-elevated border border-border-secondary">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-status-warning animate-pulse"></div>
                  <div>
                    <p className="font-semibold text-status-warning">${payment.amount.toFixed(2)}</p>
                    <p className="text-text-secondary text-sm">Fecha estimada: {new Date(payment.dueDate).toLocaleDateString('es-ES')}</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-status-warning/10 border border-status-warning/20">
                  <span className="text-xs font-medium text-status-warning">Pendiente</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historial de Pagos */}
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-status-success/10 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-status-success" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary">Historial de Pagos</h3>
        </div>
        
        {payments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-text-secondary" />
            </div>
            <h4 className="font-medium text-text-primary mb-2">Sin Historial</h4>
            <p className="text-text-secondary text-sm">
              No hay historial de pagos disponible aún.
            </p>
            <p className="text-text-secondary text-xs mt-2">
              Cuando recibas tus primeros pagos, aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 pb-4 border-b border-border-secondary">
              <div className="font-medium text-text-primary">Monto</div>
              <div className="font-medium text-text-primary">Fecha de Pago</div>
              <div className="font-medium text-text-primary">Estado</div>
            </div>
            
            <div className="space-y-3">
              {payments.map((payment, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 py-4 px-4 rounded-lg bg-surface-elevated border border-border-secondary hover:bg-surface-tertiary transition-colors">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-status-success" />
                    <span className="font-semibold text-status-success">
                      ${payment.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-text-secondary">
                    {new Date(payment.datePaid).toLocaleDateString('es-ES')}
                  </div>
                  <div>
                    <div className="px-2 py-1 rounded-full bg-status-success/10 border border-status-success/20 inline-block">
                      <span className="text-xs font-medium text-status-success">Completado</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}