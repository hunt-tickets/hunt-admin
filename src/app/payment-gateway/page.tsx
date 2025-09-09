"use client"

import { useState } from "react";
import { CreditCard, Plus, Link, Unlink, AlertCircle, Trash2, HelpCircle, ChevronDown, ChevronUp, Building2, CheckCircle, Lightbulb, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

interface PaymentAccount {
  id: number;
  provider: "Stripe" | "MercadoPago";
  name: string;
  status: "connected" | "disconnected" | "error";
}

const mockAccounts: PaymentAccount[] = [
  {
    id: 1,
    provider: "MercadoPago",
    name: "MercadoPago Argentina",
    status: "connected",
  },
  {
    id: 2,
    provider: "MercadoPago", 
    name: "MercadoPago México",
    status: "connected",
  },
  {
    id: 3,
    provider: "Stripe",
    name: "Stripe Internacional",
    status: "error",
  },
  {
    id: 4,
    provider: "Stripe",
    name: "Stripe Testing",
    status: "disconnected",
  },
];

const faqData = [
  {
    id: 1,
    question: "¿Cómo conectar MercadoPago?",
    answer: "Necesitarás tu Access Token y Public Key desde tu panel de desarrollador."
  },
  {
    id: 2,
    question: "¿Múltiples cuentas del mismo proveedor?",
    answer: "Sí, útil para diferentes países o configuraciones comerciales."
  },
  {
    id: 3,
    question: "¿Estados de conexión?",
    answer: "Verde: activa, Gris: configurada pero inactiva, Rojo: error."
  }
];

export default function PaymentGatewayPage() {
  const [accounts, setAccounts] = useState(mockAccounts);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountProvider, setNewAccountProvider] = useState<"Stripe" | "MercadoPago" | "">("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setAccounts(prev => prev.filter(account => account.id !== id));
  };

  const handleCreateAccount = () => {
    if (!newAccountName.trim() || !newAccountProvider) return;
    
    const newAccount: PaymentAccount = {
      id: Date.now(),
      provider: newAccountProvider,
      name: newAccountName.trim(),
      status: "disconnected",
    };

    setAccounts(prev => [...prev, newAccount]);
    setNewAccountName("");
    setNewAccountProvider("");
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

  const getProviderLogo = (provider: string) => {
    return provider === "MercadoPago" 
      ? "https://towrlnsz3f.ufs.sh/f/w1eTxnkA8YGL8m6hzcGcd1UsOEXQ0TASBf9tojN3gaIDCGr7"
      : "https://towrlnsz3f.ufs.sh/f/w1eTxnkA8YGLBYSH9T4NbF6KCM8pJdztEGxmvqcaTyW72QSn";
  };

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Cuentas de Pago</h1>
        <p className="text-text-secondary mt-2">
          Administra tus cuentas de MercadoPago y Stripe para procesar pagos de eventos.
        </p>
      </div>

      {/* Payment Accounts Section */}
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-interactive-primary/10 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-interactive-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Procesadores de Pago</h2>
                <p className="text-sm text-text-secondary">Conecta y gestiona tus cuentas de pago</p>
              </div>
            </div>
            <Sheet open={showCreateForm} onOpenChange={setShowCreateForm}>
              <SheetTrigger asChild>
                <Button className="bg-interactive-primary text-text-inverse hover:bg-interactive-active">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Cuenta
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md [&>button]:hidden">
                <SheetHeader className="pb-6 px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <SheetTitle className="text-xl font-semibold">Agregar Nueva Cuenta</SheetTitle>
                      <p className="text-sm text-text-secondary mt-2">
                        Selecciona tu proveedor de pago preferido para comenzar
                      </p>
                    </div>
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-surface-elevated"
                        onClick={() => {
                          setNewAccountName("");
                          setNewAccountProvider("");
                        }}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Cerrar</span>
                      </Button>
                    </SheetClose>
                  </div>
                </SheetHeader>
                
                <div className="px-6 space-y-8">
                  {/* Provider Selection Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-text-primary">
                      Proveedor de Pago
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div 
                        onClick={() => setNewAccountProvider("MercadoPago")}
                        className={`bg-surface-elevated border rounded-xl p-6 hover:bg-surface-primary/50 transition-all duration-200 cursor-pointer group ${
                          newAccountProvider === "MercadoPago" ? "border-interactive-primary bg-interactive-primary/5" : "border-border-secondary"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-border-secondary">
                            <img 
                              src={getProviderLogo("MercadoPago")}
                              alt="MercadoPago"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className={`text-lg font-semibold transition-colors ${
                              newAccountProvider === "MercadoPago" ? "text-interactive-primary" : "text-text-primary group-hover:text-interactive-primary"
                            }`}>
                              MercadoPago
                            </h4>
                            <p className="text-sm text-text-secondary mt-1">
                              Procesador de pagos líder en América Latina
                            </p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                            newAccountProvider === "MercadoPago" 
                              ? "border-interactive-primary bg-interactive-primary" 
                              : "border-border-secondary"
                          }`}>
                            {newAccountProvider === "MercadoPago" && (
                              <CheckCircle className="w-3 h-3 text-white m-0.5" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-surface-elevated border border-dashed border-border-secondary rounded-xl p-6 opacity-60">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-text-tertiary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Clock className="h-8 w-8 text-text-tertiary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-text-secondary">
                              Más Procesadores
                            </h4>
                            <p className="text-sm text-text-tertiary mt-1">
                              Próximamente: Stripe, PayU, Wompi y más
                            </p>
                          </div>
                          <span className="text-xs text-text-tertiary font-medium px-2 py-1 bg-text-tertiary/10 rounded">
                            Próximamente
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Account Configuration Section - Only show when provider selected */}
                  {newAccountProvider && (
                    <div className="space-y-6">
                      <div className="border-t border-border-secondary pt-6">
                        <h3 className="text-sm font-medium text-text-primary mb-4">
                          Configuración de la Cuenta
                        </h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-text-primary block mb-3">
                              Nombre de la cuenta
                            </label>
                            <Input
                              value={newAccountName}
                              onChange={(e) => setNewAccountName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && newAccountName.trim()) {
                                  handleCreateAccount();
                                }
                              }}
                              placeholder={`Ej: ${newAccountProvider} México`}
                              className="bg-surface-elevated border-border-secondary h-12"
                              autoFocus
                            />
                            <p className="text-xs text-text-tertiary mt-2">
                              Este nombre te ayudará a identificar la cuenta en el panel
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => {
              const StatusIcon = getStatusIcon(account.status);
              
              return (
                <div 
                  key={account.id}
                  className="bg-surface-elevated border border-border-secondary rounded-lg p-5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 bg-white rounded-lg overflow-hidden ${account.provider === 'MercadoPago' ? 'ring-1 ring-border-secondary' : ''}`}>
                      <img 
                        src={getProviderLogo(account.provider)}
                        alt={account.provider}
                        className={`w-full h-full object-cover ${account.provider === 'Stripe' ? 'scale-[1.8]' : ''}`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary text-sm">{account.name}</h3>
                      <p className="text-xs text-text-secondary">{account.provider}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={`${getStatusColor(account.status)} text-xs px-2 py-1 flex items-center gap-1 pointer-events-none`}>
                      <StatusIcon className="w-3 h-3" />
                      {getStatusText(account.status)}
                    </Badge>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(account.id)}
                      className="text-xs border-border-secondary hover:bg-status-error/10 hover:border-status-error/20 hover:text-status-error"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {accounts.length === 0 && (
            <div className="text-center py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto mb-8">
                <div 
                  onClick={() => {
                    setNewAccountProvider("MercadoPago");
                    setShowCreateForm(true);
                  }}
                  className="bg-surface-elevated border border-border-secondary rounded-lg p-8 hover:bg-surface-primary/50 transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden mx-auto mb-4 ring-1 ring-border-secondary">
                    <img 
                      src={getProviderLogo("MercadoPago")}
                      alt="MercadoPago"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-semibold text-text-primary group-hover:text-interactive-primary transition-colors">
                    MercadoPago
                  </h4>
                  <p className="text-xs text-text-secondary mt-2">Disponible ahora</p>
                </div>
                
                <div className="bg-surface-elevated border border-dashed border-border-secondary rounded-lg p-8 opacity-60 cursor-default">
                  <div className="w-16 h-16 bg-text-tertiary/10 rounded-lg overflow-hidden mx-auto mb-4 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-text-tertiary" />
                  </div>
                  <h4 className="font-semibold text-text-secondary">
                    Más Procesadores
                  </h4>
                  <p className="text-xs text-text-tertiary mt-2">Próximamente</p>
                </div>
              </div>
              
              <p className="text-xs text-text-secondary">
                Haz clic en MercadoPago para configurar una nueva cuenta
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Service Fees Section */}
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-interactive-primary/10 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-interactive-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Tarifas de Servicio</h2>
              <p className="text-sm text-text-secondary">Comprende las comisiones por tipo de procesamiento</p>
            </div>
          </div>

          {/* Pricing Table Comparison */}
          <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl overflow-visible">
            {/* Header */}
            <div className="grid grid-cols-3 border-b border-border-secondary">
              <div className="p-5 flex items-center bg-surface-elevated rounded-tl-xl">
                <div>
                  <h3 className="text-base font-bold text-white">Características</h3>
                  <p className="text-xs text-white">Compara nuestros planes</p>
                </div>
              </div>
              
              {/* Pasarela Propia Column */}
              <div className="relative p-5 bg-surface-primary border-l border-border-primary">
                {/* Recommended Badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-interactive-primary px-2 py-0.5 rounded-full text-xs font-medium text-text-inverse shadow-lg">
                    Recomendado
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Pasarela Propia</h3>
                    <p className="text-xs text-white">Con tus cuentas</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">2.5%</div>
                    <div className="text-xs text-white">+ Procesador</div>
                  </div>
                </div>
              </div>
              
              {/* Recolección Hunt Column */}
              <div className="p-5 border-l border-border-primary bg-surface-elevated rounded-tr-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Recolección Hunt</h3>
                    <p className="text-xs text-white">Procesamos nosotros por ti</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">10%</div>
                    <div className="relative group">
                      <div className="text-xs text-white underline decoration-dotted cursor-help">+ Impuestos</div>
                      <div className="absolute bottom-full right-0 mb-2 px-4 py-3 bg-gray-900 text-white text-xs rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64 z-50">
                        La tarifa del impuesto se aplica sobre nuestro valor del 10% según el IVA o impuesto de cada país
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Comparison */}
            <div className="divide-y divide-border-secondary">
              {/* Disponibilidad de fondos */}
              <div className="grid grid-cols-3 py-4 px-6">
                <div className="text-sm text-white">Disponibilidad de fondos</div>
                <div className="text-center text-xs text-white">Inmediatas</div>
                <div className="text-center text-xs text-white">2 días hábiles finalizado el evento</div>
              </div>

              {/* Control de fondos */}
              <div className="grid grid-cols-3 py-4 px-6">
                <div className="text-sm text-white">Control total de tus fondos</div>
                <div className="text-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                </div>
                <div className="text-center">
                  <span className="text-xs text-white">Nosotros gestionamos</span>
                </div>
              </div>

              {/* Soporte completo */}
              <div className="grid grid-cols-3 py-4 px-6">
                <div className="text-sm text-white">Soporte completo</div>
                <div className="text-center text-xs text-white">Básico</div>
                <div className="text-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                </div>
              </div>

              {/* Manejo de disputas */}
              <div className="grid grid-cols-3 py-4 px-6">
                <div className="text-sm text-white">Manejo de disputas y reembolsos</div>
                <div className="text-center text-xs text-white">Manual</div>
                <div className="text-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                </div>
              </div>

              {/* Tarifas competitivas */}
              <div className="grid grid-cols-3 py-4 px-6">
                <div className="text-sm text-white">Tarifas más competitivas</div>
                <div className="text-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                </div>
                <div className="text-center">
                  <span className="text-xs text-white">Tarifa fija</span>
                </div>
              </div>

              {/* Configuración personalizada */}
              <div className="grid grid-cols-3 py-4 px-6">
                <div className="text-sm text-white">Configuración personalizada</div>
                <div className="text-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                </div>
                <div className="text-center">
                  <span className="text-xs text-white">Estándar</span>
                </div>
              </div>

              {/* Control de flujo de dinero */}
              <div className="grid grid-cols-3 py-4 px-6">
                <div className="text-sm text-white">Control de flujo de dinero</div>
                <div className="text-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                </div>
                <div className="text-center text-xs text-white">Delegado a Hunt</div>
              </div>

              {/* Configuración automática */}
              <div className="grid grid-cols-3 py-4 px-6">
                <div className="text-sm text-white">Configuración automática</div>
                <div className="text-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                </div>
                <div className="text-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                </div>
              </div>

              {/* Reportes detallados */}
              <div className="grid grid-cols-3 py-4 px-6 pb-6">
                <div className="text-sm text-white">Reportes detallados</div>
                <div className="text-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                </div>
                <div className="text-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-interactive-primary/10 rounded-lg flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-interactive-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Preguntas Frecuentes</h2>
              <p className="text-sm text-text-secondary">Resuelve tus dudas sobre cuentas de pago</p>
            </div>
          </div>

          <div className="space-y-3">
            {faqData.map((faq) => (
              <div key={faq.id} className="bg-surface-elevated border border-border-secondary rounded-lg">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-4 text-left hover:bg-surface-primary/50 transition-colors rounded-lg flex items-center justify-between"
                >
                  <h3 className="text-sm font-medium text-text-primary">{faq.question}</h3>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="h-4 w-4 text-text-secondary" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-text-secondary" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-border-secondary pt-3">
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}