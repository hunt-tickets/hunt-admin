"use client"

import { User, Calendar, DollarSign, TrendingUp, Clock } from "lucide-react"

export function ReferralsActivity() {
  const activities = [
    {
      id: 1,
      type: 'new_referral',
      title: 'Nuevo referido',
      description: 'María González se registró',
      amount: null,
      time: '2 horas',
      icon: User,
      color: 'text-status-info',
      bgColor: 'bg-status-info/10'
    },
    {
      id: 2,
      type: 'event_created',
      title: 'Evento creado',
      description: 'Carlos M. organizó "Concierto Jazz"',
      amount: '+$45',
      time: '5 horas',
      icon: Calendar,
      color: 'text-status-success',
      bgColor: 'bg-status-success/10'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Pago procesado',
      description: 'Comisión de febrero',
      amount: '$340',
      time: '1 día',
      icon: DollarSign,
      color: 'text-status-success',
      bgColor: 'bg-status-success/10'
    },
    {
      id: 4,
      type: 'milestone',
      title: 'Meta alcanzada',
      description: '20 referidos activos',
      amount: null,
      time: '2 días',
      icon: TrendingUp,
      color: 'text-status-warning',
      bgColor: 'bg-status-warning/10'
    },
    {
      id: 5,
      type: 'event_created',
      title: 'Evento creado',
      description: 'Ana L. organizó "Workshop Tech"',
      amount: '+$25',
      time: '3 días',
      icon: Calendar,
      color: 'text-status-success',
      bgColor: 'bg-status-success/10'
    },
    {
      id: 6,
      type: 'new_referral',
      title: 'Nuevo referido',
      description: 'Diego R. se registró',
      amount: null,
      time: '4 días',
      icon: User,
      color: 'text-status-info',
      bgColor: 'bg-status-info/10'
    }
  ]

  return (
    <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl">
      {/* Header */}
      <div className="p-6 border-b border-border-secondary">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-interactive-primary/10">
            <Clock className="w-5 h-5 text-interactive-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Actividad Reciente
            </h3>
            <p className="text-text-secondary text-sm">
              Últimas acciones de tus referidos
            </p>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-elevated transition-colors"
              >
                <div className={`p-2 rounded-full ${activity.bgColor} flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {activity.title}
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        {activity.description}
                      </p>
                    </div>
                    
                    <div className="text-right flex-shrink-0 ml-3">
                      {activity.amount && (
                        <p className="text-sm font-medium text-status-success">
                          {activity.amount}
                        </p>
                      )}
                      <p className="text-xs text-text-secondary">
                        hace {activity.time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="mt-6 pt-4 border-t border-border-secondary">
          <button className="w-full text-center text-sm text-interactive-primary hover:text-interactive-active transition-colors font-medium">
            Ver toda la actividad
          </button>
        </div>
      </div>
    </div>
  )
}