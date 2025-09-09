"use client"

import { useState } from "react";
import { Zap, Plus, Settings, Link, Unlink, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

interface Integration {
  id: number;
  name: string;
  service: string;
  status: "connected" | "disconnected" | "error";
  logo: string;
  description: string;
}

const mockIntegrations: Integration[] = [
  {
    id: 1,
    name: "Mailchimp Marketing",
    service: "Mailchimp",
    status: "connected",
    logo: "https://logoeps.com/wp-content/uploads/2013/03/mailchimp-vector-logo.png",
    description: "Email marketing y automatización"
  },
  {
    id: 2,
    name: "WhatsApp Business",
    service: "WhatsApp",
    status: "connected", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
    description: "Mensajería directa con clientes"
  },
  {
    id: 3,
    name: "Google Analytics",
    service: "Google",
    status: "error",
    logo: "https://developers.google.com/analytics/images/terms/logo_lockup_analytics_icon_vertical_black_2x.png",
    description: "Análisis web y conversiones"
  },
  {
    id: 4,
    name: "Facebook Pixel",
    service: "Meta",
    status: "disconnected",
    logo: "https://static.xx.fbcdn.net/rsrc.php/v3/yX/r/Kvo5FesWVKX.png",
    description: "Tracking y remarketing"
  },
];

const availableIntegrations = [
  {
    name: "Mailchimp",
    logo: "https://logoeps.com/wp-content/uploads/2013/03/mailchimp-vector-logo.png",
    description: "Email marketing y automatización"
  },
  {
    name: "WhatsApp",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg", 
    description: "Mensajería directa con clientes"
  },
  {
    name: "Google Analytics",
    logo: "https://developers.google.com/analytics/images/terms/logo_lockup_analytics_icon_vertical_black_2x.png",
    description: "Análisis web y conversiones"
  },
  {
    name: "Meta Pixel",
    logo: "https://static.xx.fbcdn.net/rsrc.php/v3/yX/r/Kvo5FesWVKX.png",
    description: "Tracking y remarketing"
  },
  {
    name: "Zapier",
    logo: "https://cdn.zapier.com/storage/photos/9ec65c79de8ae54080c1b417540469a6.png",
    description: "Automatización de flujos de trabajo"
  },
  {
    name: "Slack",
    logo: "https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png",
    description: "Notificaciones del equipo"
  },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newIntegrationName, setNewIntegrationName] = useState("");
  const [newIntegrationService, setNewIntegrationService] = useState("");

  const handleDelete = (id: number) => {
    setIntegrations(prev => prev.filter(integration => integration.id !== id));
  };

  const handleCreateIntegration = () => {
    if (!newIntegrationName.trim() || !newIntegrationService.trim()) return;
    
    const selectedService = availableIntegrations.find(service => service.name === newIntegrationService);
    if (!selectedService) return;

    const newIntegration: Integration = {
      id: Date.now(),
      name: newIntegrationName.trim(),
      service: newIntegrationService,
      status: "disconnected",
      logo: selectedService.logo,
      description: selectedService.description,
    };

    setIntegrations(prev => [...prev, newIntegration]);
    setNewIntegrationName("");
    setNewIntegrationService("");
    setShowCreateForm(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected": return Link;
      case "error": return AlertCircle;
      default: return Unlink;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "text-status-success bg-status-success/10 border-status-success/20";
      case "error": return "text-status-error bg-status-error/10 border-status-error/20";
      default: return "text-text-secondary bg-surface-tertiary border-border-secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected": return "Conectada";
      case "error": return "Error";
      default: return "Desconectada";
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Integraciones</h1>
        <p className="text-text-secondary mt-2">
          Conecta herramientas externas para potenciar tus eventos y automatizar procesos.
        </p>
      </div>

      {/* Integrations Section */}
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-interactive-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-interactive-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Servicios Conectados</h2>
                <p className="text-sm text-text-secondary">Administra tus integraciones activas</p>
              </div>
            </div>
            <Sheet open={showCreateForm} onOpenChange={setShowCreateForm}>
              <SheetTrigger asChild>
                <Button size="icon" className="bg-interactive-primary text-text-inverse hover:bg-interactive-active">
                  <Plus className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Agregar Nueva Integración</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div>
                    <label className="text-sm font-medium text-text-primary block mb-2">
                      Nombre de la integración
                    </label>
                    <Input
                      value={newIntegrationName}
                      onChange={(e) => setNewIntegrationName(e.target.value)}
                      placeholder="Ej: Marketing Principal"
                      className="bg-surface-elevated border-border-secondary"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-text-primary block mb-2">
                      Servicio
                    </label>
                    <select 
                      value={newIntegrationService}
                      onChange={(e) => setNewIntegrationService(e.target.value)}
                      className="w-full p-3 bg-surface-elevated border border-border-secondary rounded-md text-text-primary"
                    >
                      <option value="">Seleccionar servicio</option>
                      {availableIntegrations.map((service) => (
                        <option key={service.name} value={service.name}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleCreateIntegration}
                      disabled={!newIntegrationName.trim() || !newIntegrationService}
                      className="flex-1 bg-interactive-primary text-text-inverse hover:bg-interactive-active"
                    >
                      Crear Integración
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewIntegrationName("");
                        setNewIntegrationService("");
                      }}
                      className="border-border-secondary text-text-secondary hover:bg-surface-primary"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((integration) => {
              const StatusIcon = getStatusIcon(integration.status);
              
              return (
                <div 
                  key={integration.id}
                  className="bg-surface-elevated border border-border-secondary rounded-lg p-5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white rounded-lg overflow-hidden flex items-center justify-center p-1">
                      <img 
                        src={integration.logo}
                        alt={integration.service}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary text-sm">{integration.name}</h3>
                      <p className="text-xs text-text-secondary">{integration.service}</p>
                      <p className="text-xs text-text-secondary mt-1">{integration.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={`${getStatusColor(integration.status)} text-xs px-2 py-1 flex items-center gap-1 pointer-events-none`}>
                      <StatusIcon className="w-3 h-3" />
                      {getStatusText(integration.status)}
                    </Badge>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(integration.id)}
                      className="text-xs border-border-secondary hover:bg-status-error/10 hover:border-status-error/20 hover:text-status-error"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {integrations.length === 0 && (
            <div className="text-center py-12">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
                {availableIntegrations.slice(0, 6).map((service) => (
                  <div 
                    key={service.name}
                    onClick={() => {
                      setNewIntegrationService(service.name);
                      setShowCreateForm(true);
                    }}
                    className="bg-surface-elevated border border-border-secondary rounded-lg p-6 hover:bg-surface-primary/50 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-white rounded-lg overflow-hidden mx-auto mb-3 flex items-center justify-center p-1">
                      <img 
                        src={service.logo}
                        alt={service.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h4 className="font-semibold text-text-primary text-sm group-hover:text-interactive-primary transition-colors">
                      {service.name}
                    </h4>
                    <p className="text-xs text-text-secondary mt-1">{service.description}</p>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-text-secondary">
                Haz clic en cualquier servicio para comenzar la integración
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}