"use client"

import { useState } from "react";
import { Wallet, CreditCard, Plus, Settings, CheckCircle, XCircle, AlertCircle, ExternalLink, Copy, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { TabContentProps } from "@/types/tabs";

// Mock data for payment gateways
const mockPaymentAccounts = {
  mercadopago: {
    id: 1,
    provider: "MercadoPago",
    status: "connected",
    accountId: "MP_123456789",
    email: "producer@hunttickets.com",
    country: "Argentina",
    currency: "ARS",
    fees: {
      domestic: "5.9%",
      international: "7.9%"
    },
    balance: "15,420.50",
    isActive: true,
    connectedAt: "2024-01-15T10:00:00Z",
    lastTransaction: "2024-01-20T14:30:00Z",
    webhookUrl: "https://api.hunttickets.com/webhooks/mercadopago",
    credentials: {
      accessToken: "APP_USR_123456789ABCDEF",
      publicKey: "APP_USR_987654321FEDCBA"
    }
  },
  stripe: {
    id: 2,
    provider: "Stripe",
    status: "disconnected",
    accountId: null,
    email: null,
    country: null,
    currency: null,
    fees: {
      domestic: "2.9% + $0.30",
      international: "3.9% + $0.30"
    },
    balance: "0.00",
    isActive: false,
    connectedAt: null,
    lastTransaction: null,
    webhookUrl: "https://api.hunttickets.com/webhooks/stripe",
    credentials: {
      secretKey: "",
      publishableKey: ""
    }
  }
};

// Simple Switch component
const Switch = ({ checked, disabled, onChange }: { checked?: boolean; disabled?: boolean; onChange?: (checked: boolean) => void }) => {
  return (
    <button
      onClick={() => onChange?.(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        disabled 
          ? 'bg-gray-200 cursor-not-allowed'
          : checked 
            ? 'bg-blue-600' 
            : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

export function PaymentsTab({ producerId, currentProducer }: TabContentProps) {
  const [activeProvider, setActiveProvider] = useState<'mercadopago' | 'stripe'>('mercadopago');
  const [showCredentials, setShowCredentials] = useState({ mercadopago: false, stripe: false });
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [settings, setSettings] = useState({
    testMode: false,
    autoWebhooks: true,
    emailNotifications: true
  });

  const toggleCredentialsVisibility = (provider: 'mercadopago' | 'stripe') => {
    setShowCredentials(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Conectado
          </Badge>
        );
      case 'disconnected':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Desconectado
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Error
          </Badge>
        );
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const renderPaymentProviderCard = (provider: 'mercadopago' | 'stripe') => {
    const account = mockPaymentAccounts[provider];
    const isConnected = account.status === 'connected';

    return (
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              provider === 'mercadopago' 
                ? 'bg-blue-100' 
                : 'bg-purple-100'
            }`}>
              {provider === 'mercadopago' ? (
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">MP</span>
                </div>
              ) : (
                <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">{account.provider}</h3>
              <p className="text-sm text-text-secondary">
                {provider === 'mercadopago' 
                  ? 'Procesador de pagos para América Latina'
                  : 'Procesador global de pagos online'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(account.status)}
            <Switch 
              checked={account.isActive} 
              disabled={!isConnected}
              onChange={(checked) => {
                // Handle account activation toggle
                console.log(`Toggle ${provider} account to:`, checked);
              }}
            />
          </div>
        </div>

        {isConnected ? (
          <div className="space-y-6">
            {/* Account Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-text-secondary mb-1">Cuenta ID</div>
                <div className="text-sm font-medium text-text-primary">{account.accountId}</div>
              </div>
              <div>
                <div className="text-sm text-text-secondary mb-1">Email</div>
                <div className="text-sm font-medium text-text-primary">{account.email}</div>
              </div>
              <div>
                <div className="text-sm text-text-secondary mb-1">País</div>
                <div className="text-sm font-medium text-text-primary">{account.country}</div>
              </div>
              <div>
                <div className="text-sm text-text-secondary mb-1">Moneda</div>
                <div className="text-sm font-medium text-text-primary">{account.currency}</div>
              </div>
            </div>

            {/* Balance and Fees */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-surface-elevated">
                <div className="text-sm text-text-secondary mb-1">Balance disponible</div>
                <div className="text-2xl font-bold text-text-primary">
                  ${account.balance} {account.currency}
                </div>
              </Card>
              <Card className="p-4 bg-surface-elevated">
                <div className="text-sm text-text-secondary mb-1">Comisión Nacional</div>
                <div className="text-lg font-semibold text-text-primary">{account.fees.domestic}</div>
              </Card>
              <Card className="p-4 bg-surface-elevated">
                <div className="text-sm text-text-secondary mb-1">Comisión Internacional</div>
                <div className="text-lg font-semibold text-text-primary">{account.fees.international}</div>
              </Card>
            </div>

            {/* Credentials Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-semibold text-text-primary">Credenciales API</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCredentialsVisibility(provider)}
                  className="flex items-center gap-2"
                >
                  {showCredentials[provider] ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Ocultar
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Mostrar
                    </>
                  )}
                </Button>
              </div>

              <div className="grid gap-4">
                {provider === 'mercadopago' ? (
                  <>
                    <div>
                      <label className="text-sm font-medium text-text-primary block mb-2">Access Token</label>
                      <div className="flex gap-2">
                        <Input
                          type={showCredentials[provider] ? "text" : "password"}
                          value={account.credentials.accessToken}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-primary block mb-2">Public Key</label>
                      <div className="flex gap-2">
                        <Input
                          type={showCredentials[provider] ? "text" : "password"}
                          value={account.credentials.publicKey}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium text-text-primary block mb-2">Secret Key</label>
                      <div className="flex gap-2">
                        <Input
                          type={showCredentials[provider] ? "text" : "password"}
                          value={account.credentials.secretKey || "No configurado"}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-primary block mb-2">Publishable Key</label>
                      <div className="flex gap-2">
                        <Input
                          type={showCredentials[provider] ? "text" : "password"}
                          value={account.credentials.publishableKey || "No configurado"}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="text-sm font-medium text-text-primary block mb-2">Webhook URL</label>
                  <div className="flex gap-2">
                    <Input
                      value={account.webhookUrl}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-border-secondary">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configurar
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Ver en {provider === 'mercadopago' ? 'MercadoPago' : 'Stripe'}
              </Button>
              <Button variant="destructive" size="sm">
                Desconectar
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Conectar {account.provider}
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Configura tu cuenta de {account.provider} para comenzar a procesar pagos
            </p>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Conectar cuenta
            </Button>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Payment Gateway</h1>
        <p className="text-text-secondary mt-2">
          Administra tus cuentas de procesamiento de pagos y configuraciones de MercadoPago y Stripe
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">1</div>
              <div className="text-sm text-text-secondary">Cuentas Conectadas</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">$15,420</div>
              <div className="text-sm text-text-secondary">Balance Total</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">5.9%</div>
              <div className="text-sm text-text-secondary">Comisión Promedio</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">0</div>
              <div className="text-sm text-text-secondary">Problemas Activos</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Providers Tabs */}
      <div className="border-b border-border-secondary mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveProvider('mercadopago')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeProvider === 'mercadopago'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-focus'
            }`}
          >
            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">MP</span>
            </div>
            MercadoPago
          </button>
          <button
            onClick={() => setActiveProvider('stripe')}
            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeProvider === 'stripe'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-focus'
            }`}
          >
            <div className="w-5 h-5 bg-purple-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            Stripe
          </button>
        </nav>
      </div>

      {/* Payment Provider Content */}
      <div className="space-y-8">
        {renderPaymentProviderCard(activeProvider)}

        {/* Additional Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Configuración General</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-text-primary">Modo de Prueba</div>
                <div className="text-sm text-text-secondary">Usar las credenciales de sandbox para testing</div>
              </div>
              <Switch 
                checked={settings.testMode}
                onChange={(checked) => setSettings(prev => ({ ...prev, testMode: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-text-primary">Webhooks Automáticos</div>
                <div className="text-sm text-text-secondary">Configurar webhooks automáticamente al conectar</div>
              </div>
              <Switch 
                checked={settings.autoWebhooks}
                onChange={(checked) => setSettings(prev => ({ ...prev, autoWebhooks: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-text-primary">Notificaciones de Pago</div>
                <div className="text-sm text-text-secondary">Recibir notificaciones por email de transacciones</div>
              </div>
              <Switch 
                checked={settings.emailNotifications}
                onChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}