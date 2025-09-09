"use client"

import { useState } from "react";
import { MessageSquare, Plus, Send, Eye, Edit, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SMSCampaign {
  id: number;
  name: string;
  message: string;
  status: "draft" | "scheduled" | "sent" | "active";
  recipients: number;
  deliveryRate?: number;
  responseRate?: number;
  scheduledDate?: string;
  createdAt: string;
  type: "sms" | "whatsapp";
}

const mockSMSCampaigns: SMSCampaign[] = [
  {
    id: 1,
    name: "Recordatorio Festival Jazz",
    message: "🎵 ¡Mañana es el Festival de Jazz! No olvides tu ticket. Nos vemos a las 8pm en Teatro Principal.",
    status: "sent",
    recipients: 800,
    deliveryRate: 98.2,
    responseRate: 15.4,
    createdAt: "2024-01-15",
    type: "sms"
  },
  {
    id: 2,
    name: "WhatsApp - Concierto Rock",
    message: "🎸 ¡Últimas 24 horas para conseguir tu entrada al Concierto Rock Nacional! Link: hunttickets.com/rock",
    status: "scheduled",
    recipients: 1500,
    scheduledDate: "2024-01-22",
    createdAt: "2024-01-18",
    type: "whatsapp"
  },
  {
    id: 3,
    name: "SMS - Confirmación Compra",
    message: "✅ Compra confirmada. Tu ticket para [EVENTO] está listo. Descárgalo desde tu email o perfil.",
    status: "active",
    recipients: 0,
    createdAt: "2024-01-10",
    type: "sms"
  }
];

export function SMSCampaignsTab() {
  const [campaigns, setCampaigns] = useState(mockSMSCampaigns);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent": return "text-status-success bg-status-success/10 border-status-success/20";
      case "scheduled": return "text-blue-600 bg-blue-100 border-blue-200";
      case "active": return "text-green-600 bg-green-100 border-green-200";
      default: return "text-text-secondary bg-surface-tertiary border-border-secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "sent": return "Enviada";
      case "scheduled": return "Programada";
      case "active": return "Activa";
      default: return "Borrador";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "whatsapp" ? "📱" : "💬";
  };

  const getTypeText = (type: string) => {
    return type === "whatsapp" ? "WhatsApp" : "SMS";
  };

  return (
    <div className="max-w-6xl">
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">SMS/WhatsApp Campaigns</h3>
            <p className="text-text-secondary">
              Crea y gestiona campañas de SMS y WhatsApp para comunicarte directamente con tu audiencia.
            </p>
          </div>
          
          <div className="space-y-8">
            {/* SMS Campaigns Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-text-secondary">Gestiona tus campañas de mensajería</h4>
                <Button className="bg-interactive-primary text-text-inverse hover:bg-interactive-active">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Campaña
                </Button>
              </div>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-surface-elevated border border-border-secondary rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">{getTypeIcon(campaign.type)}</span>
                      <h3 className="text-lg font-semibold text-text-primary">{campaign.name}</h3>
                      <Badge className={`${getStatusColor(campaign.status)} text-xs px-2 py-1 pointer-events-none`}>
                        {getStatusText(campaign.status)}
                      </Badge>
                      <Badge className="text-xs px-2 py-1 bg-surface-tertiary text-text-secondary pointer-events-none">
                        {getTypeText(campaign.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-text-secondary mb-3 max-w-2xl">
                      {campaign.message.length > 100 
                        ? `${campaign.message.substring(0, 100)}...` 
                        : campaign.message
                      }
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-text-secondary">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {campaign.recipients.toLocaleString()} destinatarios
                      </span>
                      {campaign.deliveryRate && (
                        <span>Entrega: {campaign.deliveryRate}%</span>
                      )}
                      {campaign.responseRate && (
                        <span>Respuesta: {campaign.responseRate}%</span>
                      )}
                      {campaign.scheduledDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Programada: {new Date(campaign.scheduledDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-border-secondary">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-border-secondary">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {campaign.status === 'draft' && (
                      <Button variant="outline" size="sm" className="border-border-secondary">
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
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

              {campaigns.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">No hay campañas creadas</h3>
                  <p className="text-text-secondary mb-6">
                    Crea tu primera campaña de SMS o WhatsApp para llegar directamente a tu audiencia
                  </p>
                  <Button className="bg-interactive-primary text-text-inverse hover:bg-interactive-active">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Campaña
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