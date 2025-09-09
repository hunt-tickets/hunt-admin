"use client"

import { useState } from "react";
import { Mail, Plus, Send, Eye, Edit, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EmailCampaign {
  id: number;
  name: string;
  subject: string;
  status: "draft" | "scheduled" | "sent" | "active";
  recipients: number;
  openRate?: number;
  clickRate?: number;
  scheduledDate?: string;
  createdAt: string;
}

const mockCampaigns: EmailCampaign[] = [
  {
    id: 1,
    name: "Concierto Rock Nacional - Promoción",
    subject: "¡No te pierdas el evento del año!",
    status: "sent",
    recipients: 2500,
    openRate: 68.5,
    clickRate: 12.3,
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    name: "Festival Jazz - Early Bird",
    subject: "Descuentos especiales por tiempo limitado",
    status: "scheduled",
    recipients: 1200,
    scheduledDate: "2024-01-20",
    createdAt: "2024-01-10"
  },
  {
    id: 3,
    name: "Newsletter Mensual",
    subject: "Lo mejor de este mes en eventos",
    status: "draft",
    recipients: 0,
    createdAt: "2024-01-18"
  }
];

export function EmailCampaignsTab() {
  const [campaigns, setCampaigns] = useState(mockCampaigns);

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

  return (
    <div className="max-w-6xl">
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Email Campaigns</h3>
            <p className="text-text-secondary">
              Crea y gestiona campañas de email marketing para tus eventos.
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Email Campaigns Section */}
            <div className="space-y-4">
              <div className="border-t border-border-secondary py-4"></div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-text-secondary">Gestiona tus campañas de correo electrónico</h4>
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
                      <h3 className="text-lg font-semibold text-text-primary">{campaign.name}</h3>
                      <Badge className={`${getStatusColor(campaign.status)} text-xs px-2 py-1 pointer-events-none`}>
                        {getStatusText(campaign.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-text-secondary mb-3">{campaign.subject}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {campaign.recipients.toLocaleString()} destinatarios
                      </span>
                      {campaign.openRate && (
                        <span>Apertura: {campaign.openRate}%</span>
                      )}
                      {campaign.clickRate && (
                        <span>Clics: {campaign.clickRate}%</span>
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
                  <Mail className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">No hay campañas creadas</h3>
                  <p className="text-text-secondary mb-6">
                    Crea tu primera campaña de email para promocionar tus eventos
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