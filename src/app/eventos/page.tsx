"use client"

import { useState } from "react";
import { Calendar, Plus, MapPin, Users, DollarSign, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, BarChart3, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function EventosPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<'proximos' | 'pasados' | 'draft'>('proximos');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const revenueData = [
    { month: 'Ene', revenue: 45000, events: 3 },
    { month: 'Feb', revenue: 52000, events: 4 },
    { month: 'Mar', revenue: 38000, events: 2 },
    { month: 'Abr', revenue: 67000, events: 5 },
    { month: 'May', revenue: 58000, events: 4 },
    { month: 'Jun', revenue: 72000, events: 6 },
    { month: 'Jul', revenue: 85000, events: 7 },
    { month: 'Ago', revenue: 76000, events: 5 },
    { month: 'Sep', revenue: 63000, events: 4 },
    { month: 'Oct', revenue: 81000, events: 6 },
    { month: 'Nov', revenue: 74000, events: 5 },
    { month: 'Dic', revenue: 92000, events: 8 }
  ];

  // Available currencies
  const availableCurrencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'MXN', symbol: '$', name: 'Peso Mexicano' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' }
  ];

  // Convert revenue data based on selected currency (mock conversion)
  const getConvertedRevenue = (amount: number, targetCurrency: string) => {
    const exchangeRates: Record<string, number> = {
      'USD': 1,
      'MXN': 18.5,
      'EUR': 0.85,
      'GBP': 0.73
    };
    
    // Convert from MXN (base) to target currency
    const baseAmount = amount / (exchangeRates['MXN'] || 1); // Convert to USD first
    return baseAmount * (exchangeRates[targetCurrency] || 1);
  };

  // Get currency symbol
  const getCurrencySymbol = (code: string) => {
    return availableCurrencies.find(c => c.code === code)?.symbol || '$';
  };

  // Process revenue data with conversion
  const processedRevenueData = revenueData.map(item => ({
    ...item,
    revenue: Math.round(getConvertedRevenue(item.revenue, selectedCurrency))
  }));

  // Mock event data
  const allEvents = [
    {
      id: 1,
      title: "Concierto Rock Nacional",
      date: "2024-12-15",
      location: "Arena Central",
      attendees: 2500,
      revenue: 125000,
      status: "published",
      category: "proximos"
    },
    {
      id: 2,
      title: "Festival de Jazz",
      date: "2024-11-30",
      location: "Teatro Principal",
      attendees: 800,
      revenue: 64000,
      status: "published", 
      category: "proximos"
    },
    {
      id: 3,
      title: "Concierto Clásico",
      date: "2024-10-20",
      location: "Auditorio Nacional",
      attendees: 1200,
      revenue: 96000,
      status: "ended",
      category: "pasados"
    },
    {
      id: 4,
      title: "Festival Electrónico",
      date: "2024-10-15",
      location: "Parque Central",
      attendees: 3000,
      revenue: 180000,
      status: "ended",
      category: "pasados"
    },
    {
      id: 5,
      title: "Evento de Prueba",
      date: "2024-12-25",
      location: "Por definir",
      attendees: 0,
      revenue: 0,
      status: "draft",
      category: "draft"
    }
  ];

  const filteredEvents = allEvents.filter(event => event.category === activeTab);
  const eventsPerPage = 3;
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const currentEvents = filteredEvents.slice(currentIndex * eventsPerPage, (currentIndex + 1) * eventsPerPage);

  const nextPage = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Calculate summary stats
  const totalRevenue = processedRevenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalEvents = revenueData.reduce((sum, item) => sum + item.events, 0);
  const avgRevenuePerEvent = totalEvents > 0 ? totalRevenue / totalEvents : 0;
  
  // Revenue trend (comparing last 3 months vs previous 3)
  const lastThreeMonths = processedRevenueData.slice(-3).reduce((sum, item) => sum + item.revenue, 0);
  const previousThreeMonths = processedRevenueData.slice(-6, -3).reduce((sum, item) => sum + item.revenue, 0);
  const revenueTrend = previousThreeMonths > 0 ? ((lastThreeMonths - previousThreeMonths) / previousThreeMonths) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Eventos</h1>
          <p className="text-text-secondary mt-2">
            Gestiona y analiza tus eventos en tiempo real
          </p>
        </div>
        <Button asChild className="bg-interactive-primary text-text-inverse hover:bg-interactive-active">
          <a href="/eventos/crear">
            <Plus className="mr-2 h-4 w-4" />
            Crear Evento
          </a>
        </Button>
      </div>

      {/* Analytics Section */}
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-interactive-primary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-interactive-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Analytics {selectedYear}</h2>
                <p className="text-sm text-text-secondary">Rendimiento de tus eventos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="w-32 bg-surface-elevated border-border-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableCurrencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="w-24 bg-surface-elevated border-border-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-surface-elevated border border-border-secondary rounded-lg p-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-text-secondary">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {getCurrencySymbol(selectedCurrency)}{totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-surface-elevated border border-border-secondary rounded-lg p-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-text-secondary">Eventos Totales</p>
                  <p className="text-2xl font-bold text-text-primary">{totalEvents}</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-elevated border border-border-secondary rounded-lg p-6">
              <div className="flex items-center gap-3">
                <Ticket className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-text-secondary">Promedio por Evento</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {getCurrencySymbol(selectedCurrency)}{Math.round(avgRevenuePerEvent).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-surface-elevated border border-border-secondary rounded-lg p-6">
              <div className="flex items-center gap-3">
                {revenueTrend >= 0 ? (
                  <TrendingUp className="h-8 w-8 text-green-500" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-text-secondary">Tendencia</p>
                  <p className={`text-2xl font-bold ${revenueTrend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {revenueTrend >= 0 ? '+' : ''}{revenueTrend.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={processedRevenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.8)',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-interactive-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-interactive-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Mis Eventos</h2>
              <p className="text-sm text-text-secondary">Administra tus eventos</p>
            </div>
          </div>

          {/* Event Tabs */}
          <div className="flex space-x-1 bg-surface-elevated p-1 rounded-lg mb-6">
            {[
              { id: 'proximos' as const, label: 'Próximos', count: allEvents.filter(e => e.category === 'proximos').length },
              { id: 'pasados' as const, label: 'Pasados', count: allEvents.filter(e => e.category === 'pasados').length },
              { id: 'draft' as const, label: 'Borradores', count: allEvents.filter(e => e.category === 'draft').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentIndex(0);
                }}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-interactive-primary text-text-inverse'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-primary'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {currentEvents.map((event) => (
              <div key={event.id} className="bg-surface-elevated border border-border-secondary rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-text-primary">{event.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.status === 'published' ? 'bg-green-100 text-green-700' :
                        event.status === 'ended' ? 'bg-gray-100 text-gray-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {event.status === 'published' ? 'Publicado' :
                         event.status === 'ended' ? 'Finalizado' : 'Borrador'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.attendees} asistentes
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-text-primary">
                      {getCurrencySymbol(selectedCurrency)}{Math.round(getConvertedRevenue(event.revenue, selectedCurrency)).toLocaleString()}
                    </p>
                    <p className="text-sm text-text-secondary">Ingresos</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={prevPage}
                disabled={currentIndex === 0}
                className="border-border-secondary"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              <span className="text-sm text-text-secondary">
                Página {currentIndex + 1} de {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={nextPage}
                disabled={currentIndex === totalPages - 1}
                className="border-border-secondary"
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}