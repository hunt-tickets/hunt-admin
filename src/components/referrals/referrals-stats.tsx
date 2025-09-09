"use client"

import { Users, TrendingUp, DollarSign, Calendar, Target, Zap } from "lucide-react"

export function ReferralsStats() {
  const stats = [
    {
      id: 'referrals',
      title: 'Referidos Totales',
      value: '24',
      change: '+3 este mes',
      changeType: 'positive',
      icon: Users,
      color: 'text-status-info'
    },
    {
      id: 'active',
      title: 'Referidos Activos',
      value: '18',
      change: '+2 esta semana',
      changeType: 'positive',
      icon: Zap,
      color: 'text-status-success'
    },
    {
      id: 'earnings',
      title: 'Ganancias Totales',
      value: '$2,450',
      change: '+$340 este mes',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-status-success'
    },
    {
      id: 'pending',
      title: 'Pendiente de Pago',
      value: '$580',
      change: 'Próximo: 15 Oct',
      changeType: 'neutral',
      icon: Target,
      color: 'text-status-warning'
    },
    {
      id: 'events',
      title: 'Eventos Generados',
      value: '156',
      change: '+23 este mes',
      changeType: 'positive',
      icon: Calendar,
      color: 'text-interactive-primary'
    },
    {
      id: 'conversion',
      title: 'Tasa de Conversión',
      value: '78%',
      change: '+5% vs mes anterior',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-status-success'
    }
  ]

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-status-success'
      case 'negative': return 'text-status-error'
      default: return 'text-text-secondary'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.id}
            className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-6 rounded-xl hover:shadow-lg transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-text-secondary mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-text-primary">
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg bg-surface-elevated ${stat.color}/20 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <span className={`text-xs font-medium ${getChangeColor(stat.changeType)}`}>
                {stat.change}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}