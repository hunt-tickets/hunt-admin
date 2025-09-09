"use client"

import { useState } from "react"
import { Link, Copy, Check, Share2, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ReferralsLink() {
  const [copied, setCopied] = useState(false)
  const referralLink = "https://hunttickets.com/ref/TU-CODIGO-123"

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error copying to clipboard:', err)
    }
  }

  return (
    <div className="bg-gradient-to-r from-interactive-primary/10 to-status-success/10 border border-interactive-primary/20 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">Tu Link de Referido</h3>
          <p className="text-text-secondary text-sm">
            Comparte este enlace y gana 5% por cada evento que organicen tus referidos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-interactive-primary border-interactive-primary/30"
          >
            <QrCode className="w-4 h-4" />
            QR
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 bg-surface-secondary/50 border border-border-secondary rounded-lg p-3 flex items-center gap-3">
          <Link className="w-5 h-5 text-interactive-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-text-primary font-mono text-sm truncate">
              {referralLink}
            </p>
          </div>
        </div>
        
        <Button
          onClick={copyToClipboard}
          className="flex items-center gap-2 bg-interactive-primary hover:bg-interactive-active text-text-inverse"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copiado
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copiar
            </>
          )}
        </Button>
      </div>

      <div className="mt-4 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-status-success"></div>
          <span className="text-text-secondary">Comisión: 5% por evento</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-status-info"></div>
          <span className="text-text-secondary">Pago: Mensual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-status-warning"></div>
          <span className="text-text-secondary">Mínimo: $50 USD</span>
        </div>
      </div>
    </div>
  )
}