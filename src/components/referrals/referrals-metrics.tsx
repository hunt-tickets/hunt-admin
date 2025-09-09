"use client"

import { Users, Activity, Calendar, Percent, DollarSign, TrendingUp } from "lucide-react"
import { StatsCard } from "@/components/ui/stats-card"

export function ReferralsMetrics() {
  // Mock data - esto vendría de una API/database
  const metrics = {
    totalReferrals: 0,
    activeReferrals: 0,
    totalEvents: 0,
    earningsPerEvent: 5, // 5%
    totalEarned: 0.00,
    totalAvailable: 0.00,
    totalPaidOut: 0.00,
    totalRemaining: 0.00
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <StatsCard
        title="Total de Referidos"
        value={metrics.totalReferrals}
        description="Usuarios registrados"
        icon={Users}
        iconColor="text-status-info"
      />
      
      <StatsCard
        title="Referidos Activos"
        value={metrics.activeReferrals}
        description="Este mes"
        icon={Activity}
        iconColor="text-status-success"
      />
      
      <StatsCard
        title="# de Eventos"
        value={metrics.totalEvents}
        description="Participaciones"
        icon={Calendar}
        iconColor="text-interactive-primary"
      />
      
      <StatsCard
        title="Ganancias por Evento"
        value={`${metrics.earningsPerEvent}%`}
        description="Comisión promedio"
        icon={Percent}
        iconColor="text-status-success"
      />
      
      <StatsCard
        title="Total Ganado"
        value={`$${metrics.totalEarned.toFixed(2)}`}
        description="Ingresos totales"
        icon={DollarSign}
        iconColor="text-status-success"
      />
      
      <StatsCard
        title="Disponible para Pago"
        value={`$${metrics.totalAvailable.toFixed(2)}`}
        description="Para retirar"
        icon={TrendingUp}
        iconColor="text-status-info"
      />
      
      <StatsCard
        title="Total Pagado"
        value={`$${metrics.totalPaidOut.toFixed(2)}`}
        description="Ya procesado"
        icon={DollarSign}
        iconColor="text-text-secondary"
      />
      
      <StatsCard
        title="Restante por Pagar"
        value={`$${metrics.totalRemaining.toFixed(2)}`}
        description="En proceso"
        icon={DollarSign}
        iconColor="text-status-warning"
      />
    </div>
  )
}