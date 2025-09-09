"use client"

import { useState } from "react"
import { Receipt, FileSpreadsheet, DollarSign } from "lucide-react"

export function ReferralsPaymentsTabs() {
  const [activeTab, setActiveTab] = useState<'history' | 'report'>('history')

  // Mock data para historial de pagos
  const paymentHistory = [
    {
      id: 1,
      amount: 320,
      date: '2024-04-15',
      method: 'Transferencia bancaria'
    },
    {
      id: 2,
      amount: 180,
      date: '2024-03-20',
      method: 'PayPal'
    },
    {
      id: 3,
      amount: 280,
      date: '2024-02-18',
      method: 'Transferencia bancaria'
    },
    {
      id: 4,
      amount: 150,
      date: '2024-01-22',
      method: 'PayPal'
    }
  ]

  // Datos del reporte tipo Excel
  const totalEarned = 2440
  const totalAvailableForPayout = 580
  const totalPaidOut = 930
  const totalRemainingForPayout = 930

  return (
    <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl">
      {/* Tabs Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-surface-elevated text-text-primary shadow-sm border border-border-secondary'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50'
            }`}
          >
            <Receipt className="w-4 h-4" />
            Historial de Pagos
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'report'
                ? 'bg-surface-elevated text-text-primary shadow-sm border border-border-secondary'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Reporte de Ganancias
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'history' ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary mb-6">Historial de Pagos</h3>

            {paymentHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-8 h-8 text-text-secondary" />
                </div>
                <h4 className="font-medium text-text-primary mb-2">Sin historial</h4>
                <p className="text-text-secondary text-sm">
                  Tus pagos completados aparecerán aquí.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-border-secondary">
                <table className="w-full">
                  <thead className="bg-surface-elevated">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-text-secondary">Monto</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-text-secondary">Fecha</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-text-secondary">Método</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-secondary">
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id} className="hover:bg-surface-elevated/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-status-success">
                          ${payment.amount}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-primary">
                          {new Date(payment.date).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary">
                          {payment.method}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-text-primary mb-6">Reporte de Ganancias</h3>
            
            {/* Métricas principales en grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-surface-elevated border border-border-secondary rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-secondary">Total Ganado</span>
                  <div className="p-2 rounded-full bg-status-success/10">
                    <DollarSign className="w-4 h-4 text-status-success" />
                  </div>
                </div>
                <span className="text-2xl font-bold text-status-success mt-2 block">${totalEarned.toFixed(2)}</span>
              </div>

              <div className="bg-surface-elevated border border-border-secondary rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-secondary">Total Pagado</span>
                  <div className="p-2 rounded-full bg-interactive-primary/10">
                    <Receipt className="w-4 h-4 text-interactive-primary" />
                  </div>
                </div>
                <span className="text-2xl font-bold text-text-primary mt-2 block">${totalPaidOut.toFixed(2)}</span>
              </div>

              <div className="bg-surface-elevated border border-border-secondary rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-secondary">Disponible para Pago</span>
                  <div className="p-2 rounded-full bg-status-warning/10">
                    <FileSpreadsheet className="w-4 h-4 text-status-warning" />
                  </div>
                </div>
                <span className="text-2xl font-bold text-status-warning mt-2 block">${totalAvailableForPayout.toFixed(2)}</span>
              </div>

              <div className="bg-surface-elevated border border-border-secondary rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-secondary">Pendiente por Pagar</span>
                  <div className="p-2 rounded-full bg-text-secondary/10">
                    <FileSpreadsheet className="w-4 h-4 text-text-secondary" />
                  </div>
                </div>
                <span className="text-2xl font-bold text-text-primary mt-2 block">${totalRemainingForPayout.toFixed(2)}</span>
              </div>
            </div>

            {/* Resumen con barra de progreso */}
            <div className="bg-surface-elevated border border-border-secondary rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-text-primary">Progreso de Pagos</h4>
                <span className="text-2xl font-bold text-interactive-primary">
                  {Math.round((totalPaidOut / totalEarned) * 100)}%
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="w-full bg-surface-secondary rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-interactive-primary to-status-success h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((totalPaidOut / totalEarned) * 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">
                    Pagado: ${totalPaidOut.toFixed(2)}
                  </span>
                  <span className="text-text-secondary">
                    Total: ${totalEarned.toFixed(2)}
                  </span>
                </div>
                
                <div className="text-center pt-2 border-t border-border-secondary">
                  <span className="text-lg font-semibold text-text-primary">
                    Restante: ${(totalEarned - totalPaidOut).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}