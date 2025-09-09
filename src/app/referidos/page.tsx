"use client"

import { Share2, TrendingUp, DollarSign, Users, Link, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReferralsStats } from "@/components/referrals/referrals-stats"
import { ReferralsChart } from "@/components/referrals/referrals-chart"
import { ReferralsActivity } from "@/components/referrals/referrals-activity"
import { ReferralsLink } from "@/components/referrals/referrals-link"
import { ReferralsPaymentsTabs } from "@/components/referrals/referrals-payments-tabs"

export default function ReferidosPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header con acción principal */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-text-primary">Programa de Referidos</h1>
          <p className="text-text-secondary">
            Invita amigos y gana comisiones por cada evento que organicen
          </p>
        </div>
        <Button className="flex items-center gap-2 bg-interactive-primary hover:bg-interactive-active text-text-inverse">
          <Share2 className="w-4 h-4" />
          Compartir Link
        </Button>
      </div>

      {/* Gráfico principal como primer elemento */}
      <ReferralsChart />

      {/* Tabs de pagos */}
      <ReferralsPaymentsTabs />
    </div>
  )
}