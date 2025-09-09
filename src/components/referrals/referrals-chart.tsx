"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { DollarSign, TrendingUp } from "lucide-react"

export function ReferralsChart() {
  const chartData = [
    { month: 'Ene', earnings: 180 },
    { month: 'Feb', earnings: 320 },
    { month: 'Mar', earnings: 280 },
    { month: 'Abr', earnings: 520 },
    { month: 'May', earnings: 450 },
    { month: 'Jun', earnings: 690 }
  ]

  const totalEarnings = chartData.reduce((sum, item) => sum + item.earnings, 0)
  const avgMonthly = Math.round(totalEarnings / chartData.length)
  const lastMonth = chartData[chartData.length - 1].earnings
  const previousMonth = chartData[chartData.length - 2].earnings
  const growth = Math.round(((lastMonth - previousMonth) / previousMonth) * 100)

  return (
    <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl">
      {/* Header */}
      <div className="p-6 border-b border-border-secondary">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">
              Evolución de Ingresos
            </h3>
            <p className="text-text-secondary text-sm">
              Comisiones mensuales por referidos
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-text-secondary">Este mes</p>
              <p className="text-lg font-bold text-status-success">${lastMonth}</p>
              <p className="text-xs text-status-success">+{growth}% vs anterior</p>
            </div>
            <div className="p-2 rounded-lg bg-status-success/10">
              <DollarSign className="w-5 h-5 text-status-success" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-secondary))" />
              
              <XAxis 
                dataKey="month" 
                tick={{ 
                  fill: 'currentColor',
                  fontSize: 14,
                  opacity: 0.7
                }}
                stroke="currentColor"
                className="text-text-secondary"
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              
              <YAxis 
                tick={{ 
                  fill: 'currentColor',
                  fontSize: 14,
                  opacity: 0.7
                }}
                stroke="currentColor"
                className="text-text-secondary"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
                dx={-10}
                width={60}
              />
              
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null
                  
                  return (
                    <div className="bg-surface-elevated border border-border-primary rounded-lg p-3 shadow-lg">
                      <p className="text-text-primary font-medium text-sm mb-1">
                        {label} 2024
                      </p>
                      <p className="text-status-success font-bold text-lg">
                        ${payload[0].value}
                      </p>
                      <p className="text-text-secondary text-xs">
                        Ingresos del mes
                      </p>
                    </div>
                  )
                }}
              />
              
              <Area
                type="monotone"
                dataKey="earnings"
                stroke="#22c55e"
                strokeWidth={3}
                fill="url(#greenGradient)"
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Estadísticas Resumen */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-border-secondary">
          <div className="bg-surface-elevated border border-border-secondary p-4 rounded-lg">
            <p className="text-sm font-medium text-text-secondary mb-3">Referidos Activos</p>
            <p className="text-2xl font-bold text-text-primary">18</p>
          </div>
          
          <div className="bg-surface-elevated border border-border-secondary p-4 rounded-lg">
            <p className="text-sm font-medium text-text-secondary mb-3">Ganancias Totales</p>
            <p className="text-2xl font-bold text-status-success">${totalEarnings.toLocaleString()}</p>
          </div>
          
          <div className="bg-surface-elevated border border-border-secondary p-4 rounded-lg">
            <p className="text-sm font-medium text-text-secondary mb-3">Ganancias Este Mes</p>
            <p className="text-2xl font-bold text-status-success">${lastMonth}</p>
          </div>
          
          <div className="bg-surface-elevated border border-border-secondary p-4 rounded-lg">
            <p className="text-sm font-medium text-text-secondary mb-3">Tasa de Comisión</p>
            <p className="text-2xl font-bold text-text-primary">5%</p>
          </div>
        </div>
      </div>
    </div>
  )
}