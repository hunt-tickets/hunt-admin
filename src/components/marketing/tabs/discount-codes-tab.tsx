"use client"

import { useState } from "react";
import { Tag, Plus, Copy, Eye, Edit, Trash2, Calendar, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DiscountCode {
  id: number;
  code: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  status: "active" | "inactive" | "expired" | "used_up";
  usageLimit?: number;
  usageCount: number;
  validFrom: string;
  validUntil: string;
  applicableEvents?: string[];
  createdAt: string;
}

const mockDiscountCodes: DiscountCode[] = [
  {
    id: 1,
    code: "ROCK2024",
    name: "Descuento Concierto Rock",
    type: "percentage",
    value: 15,
    status: "active",
    usageLimit: 100,
    usageCount: 23,
    validFrom: "2024-01-15",
    validUntil: "2024-02-15",
    applicableEvents: ["Concierto Rock Nacional"],
    createdAt: "2024-01-10"
  },
  {
    id: 2,
    code: "EARLYBIRD",
    name: "Preventa General",
    type: "fixed",
    value: 5000,
    status: "active",
    usageLimit: 500,
    usageCount: 387,
    validFrom: "2024-01-01",
    validUntil: "2024-01-31",
    createdAt: "2023-12-28"
  },
  {
    id: 3,
    code: "STUDENT50",
    name: "Descuento Estudiantes",
    type: "percentage",
    value: 50,
    status: "inactive",
    usageLimit: 200,
    usageCount: 156,
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    createdAt: "2024-01-05"
  },
  {
    id: 4,
    code: "FLASHSALE",
    name: "Oferta Flash Navidad",
    type: "percentage",
    value: 25,
    status: "expired",
    usageLimit: 50,
    usageCount: 50,
    validFrom: "2023-12-20",
    validUntil: "2023-12-25",
    createdAt: "2023-12-18"
  }
];

export function DiscountCodesTab() {
  const [discountCodes, setDiscountCodes] = useState(mockDiscountCodes);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-status-success bg-status-success/10 border-status-success/20";
      case "inactive": return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "expired": return "text-status-error bg-status-error/10 border-status-error/20";
      case "used_up": return "text-text-secondary bg-surface-tertiary border-border-secondary";
      default: return "text-text-secondary bg-surface-tertiary border-border-secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Activo";
      case "inactive": return "Inactivo";
      case "expired": return "Expirado";
      case "used_up": return "Agotado";
      default: return "Desconocido";
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const formatValue = (type: string, value: number) => {
    return type === "percentage" ? `${value}%` : `$${value.toLocaleString()}`;
  };

  return (
    <div className="max-w-6xl">
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Discount Codes</h3>
            <p className="text-text-secondary">
              Crea y gestiona códigos de descuento para incentivar las ventas de tus eventos.
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Discount Codes Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-text-secondary">Gestiona tus códigos promocionales</h4>
                <Button className="bg-interactive-primary text-text-inverse hover:bg-interactive-active">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Código
                </Button>
              </div>
          <div className="space-y-4">
            {discountCodes.map((discount) => (
              <div key={discount.id} className="bg-surface-elevated border border-border-secondary rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <code className="bg-surface-tertiary px-2 py-1 rounded text-sm font-mono text-text-primary border">
                          {discount.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(discount.code)}
                          className="h-6 w-6 p-0 hover:bg-surface-primary"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary">{discount.name}</h3>
                      <Badge className={`${getStatusColor(discount.status)} text-xs px-2 py-1 pointer-events-none`}>
                        {getStatusText(discount.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-text-secondary mb-3">
                      <span className="flex items-center gap-1">
                        <Percent className="h-4 w-4" />
                        Descuento: {formatValue(discount.type, discount.value)}
                      </span>
                      <span>
                        Usado: {discount.usageCount}{discount.usageLimit ? `/${discount.usageLimit}` : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Válido: {new Date(discount.validFrom).toLocaleDateString()} - {new Date(discount.validUntil).toLocaleDateString()}
                      </span>
                    </div>

                    {discount.applicableEvents && discount.applicableEvents.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-text-tertiary">Eventos:</span>
                        {discount.applicableEvents.map((event, index) => (
                          <Badge key={index} className="text-xs px-2 py-1 bg-interactive-primary/10 text-interactive-primary pointer-events-none">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-border-secondary">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-border-secondary">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-border-secondary hover:bg-status-error/10 hover:border-status-error/20 hover:text-status-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

              {discountCodes.length === 0 && (
                <div className="text-center py-12">
                  <Tag className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">No hay códigos de descuento</h3>
                  <p className="text-text-secondary mb-6">
                    Crea tu primer código de descuento para incentivar las ventas
                  </p>
                  <Button className="bg-interactive-primary text-text-inverse hover:bg-interactive-active">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Código
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}