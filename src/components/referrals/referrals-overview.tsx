"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ProgressBar } from "@/components/ui/progress-bar"
import { StatsCard } from "@/components/ui/stats-card"
import { TrendingUp, DollarSign, Calendar } from "lucide-react"

export function ReferralsOverview() {
  // Mock data for earnings over time
  const earningsData = [
    { month: 'Ene', earnings: 0 },
    { month: 'Feb', earnings: 0 },
    { month: 'Mar', earnings: 0 },
    { month: 'Abr', earnings: 0 },
    { month: 'May', earnings: 0 },
    { month: 'Jun', earnings: 0 },
  ]

  const data = {
    totalPayments: 0.00,
    maxPayouts: 1000.00,
    paymentProgress: 0,
    remaining: 1000.00,
    monthlyGrowth: 0
  }

  return (
    <div className="space-y-6">
      {/* Gráfico principal */}
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Evolución de Ganancias</h3>
            <p className="text-text-secondary">Seguimiento de ingresos por referidos</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-status-success/10 border border-status-success/20">
            <TrendingUp className="w-4 h-4 text-status-success" />
            <span className="text-sm font-medium text-status-success">+{data.monthlyGrowth}%</span>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={earningsData}>
              <defs>
                <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--interactive-primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--interactive-primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-primary))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--text-secondary))" 
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--text-secondary))" 
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--surface-elevated))',
                  border: '1px solid hsl(var(--border-primary))',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="earnings"
                stroke="hsl(var(--interactive-primary))"
                strokeWidth={2}
                fill="url(#earningsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Ganado"
          value={`$${data.totalPayments.toFixed(2)}`}
          description="Ingresos totales"
          icon={DollarSign}
          iconColor="text-status-success"
        />
        
        <StatsCard
          title="Disponible"
          value={`$${data.totalPayments.toFixed(2)}`}
          description="Para retirar"
          icon={TrendingUp}
          iconColor="text-status-info"
        />
        
        <StatsCard
          title="Próximo Pago"
          value="15 Oct"
          description="Fecha estimada"
          icon={Calendar}
          iconColor="text-status-warning"
        />
      </div>

      {/* Progreso de Pagos */}
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl">
        <h3 className="text-lg font-semibold text-text-primary mb-6">Meta de Ganancias</h3>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-text-primary mb-2">
              ${data.totalPayments.toFixed(2)} / ${data.maxPayouts.toFixed(2)}
            </div>
            <p className="text-text-secondary text-sm">Progreso hacia tu meta</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Progreso</span>
              <span className="text-text-primary">{data.paymentProgress}%</span>
            </div>
            <ProgressBar progress={data.paymentProgress} className="h-3" />
          </div>
          
          <div className="text-center pt-4">
            <p className="text-xl font-semibold text-text-primary">
              Restante: ${data.remaining.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}