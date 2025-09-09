"use client"

import { useState } from "react";
import { BarChart3, ChevronLeft, ChevronRight, Calendar, DollarSign, Receipt, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { Invoice } from "@/lib/db";
import { useCurrencyConversion } from "@/hooks/use-currency-conversion";

interface InvoiceAnalyticsProps {
  invoices: Invoice[];
  onCurrencyChange?: (currency: string) => void;
  onFilterChange?: (includeExternal: boolean) => void;
}

interface MonthlyData {
  month: string;
  year: number;
  currencies: Record<string, { paid: number; pending: number; symbol: string }>;
  total: number;
}

export function InvoiceAnalytics({ invoices, onCurrencyChange, onFilterChange }: InvoiceAnalyticsProps) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [includeExternalPayments, setIncludeExternalPayments] = useState(false);
  
  // Use the currency conversion hook
  const {
    currencies,
    loading: currencyLoading,
    error: currencyError,
    getCurrencyInfo,
    convertToBaseCurrency,
    formatCurrencyAmount,
    getCurrencySymbol,
    getActiveCurrencies,
  } = useCurrencyConversion(baseCurrency);

  // Filtrar facturas según el toggle de pagos externos
  const filteredInvoices = includeExternalPayments 
    ? invoices 
    : invoices.filter(invoice => !invoice.ignore);

  // Obtener todas las monedas únicas
  const allCurrencies = Array.from(
    new Set(filteredInvoices.map(invoice => invoice.currency || 'USD'))
  ).sort();

  // Procesar datos para Recharts
  const processChartData = () => {
    const monthlyMap: Record<string, any> = {};
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    for (let i = 0; i < 12; i++) {
      const monthIndex = i;
      const monthKey = `${selectedYear}-${monthIndex.toString().padStart(2, '0')}`;
      
      monthlyMap[monthKey] = {
        month: months[monthIndex],
        year: selectedYear,
        total: 0,
        currencies: {},
      };
    }

    // Procesar facturas - solo las que están pagadas
    filteredInvoices.forEach(invoice => {
      // Solo procesar facturas que tienen paid_at (están pagadas)
      if (invoice.paid_at) {
        const date = new Date(invoice.paid_at);
        if (date.getFullYear() === selectedYear) {
          const monthKey = `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}`;
          
          if (monthlyMap[monthKey]) {
            const currencyCode = invoice.currency || 'USD';
            const originalAmount = typeof invoice.total === 'number' ? invoice.total : parseFloat(invoice.total as string) || 0;
            const convertedAmount = convertToBaseCurrency(originalAmount, currencyCode);

            if (!monthlyMap[monthKey].currencies[currencyCode]) {
              monthlyMap[monthKey].currencies[currencyCode] = 0;
            }

            monthlyMap[monthKey].currencies[currencyCode] += originalAmount; // Guardar original para tooltip
            monthlyMap[monthKey].total += convertedAmount; // Usar convertido para total
          }
        }
      }
    });

    return Object.values(monthlyMap).sort((a, b) => {
      const monthOrder = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });
  };

  const chartData = processChartData();

  // Calcular estadísticas específicas (convertidos a moneda base)
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Gastos del mes actual (facturas pagadas este mes)
  const currentMonthAmount = filteredInvoices.filter(inv => {
    if (!inv.paid_at) return false;
    const paidDate = new Date(inv.paid_at);
    return paidDate.getMonth() === currentMonth && paidDate.getFullYear() === currentYear;
  }).reduce((sum, inv) => {
    const amount = typeof inv.total === 'number' ? inv.total : parseFloat(inv.total as string) || 0;
    const convertedAmount = convertToBaseCurrency(amount, inv.currency || 'USD');
    return sum + convertedAmount;
  }, 0);
  
  // Proyección estimada basada en tendencia histórica
  const calculateProjection = () => {
    // Obtener gastos de los últimos 3 meses para calcular promedio
    const last3Months = [];
    const now = new Date();
    
    for (let i = 1; i <= 3; i++) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthAmount = filteredInvoices.filter(inv => {
        if (!inv.paid_at) return false;
        const paidDate = new Date(inv.paid_at);
        return paidDate.getMonth() === targetDate.getMonth() && 
               paidDate.getFullYear() === targetDate.getFullYear();
      }).reduce((sum, inv) => {
        const amount = typeof inv.total === 'number' ? inv.total : parseFloat(inv.total as string) || 0;
        return sum + convertToBaseCurrency(amount, inv.currency || 'USD');
      }, 0);
      
      last3Months.push(monthAmount);
    }
    
    // Calcular promedio de los últimos 3 meses
    const averageMonthly = last3Months.reduce((sum, amount) => sum + amount, 0) / 3;
    
    // Retornar promedio como proyección del próximo mes
    return averageMonthly;
  };
  
  const projectionAmount = calculateProjection();

  // Colores para las barras
  const currencyColors = ['#334155', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'];

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (currencyLoading) {
    return (
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl">
        {/* Controls Skeleton */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-3 animate-pulse">
              {/* Year controls skeleton */}
              <div className="flex items-center gap-1">
                <div className="h-8 w-8 bg-surface-tertiary rounded border border-border-secondary"></div>
                <div className="h-6 w-12 bg-surface-tertiary rounded px-3"></div>
                <div className="h-8 w-8 bg-surface-tertiary rounded border border-border-secondary"></div>
              </div>
              
              {/* Currency selector skeleton */}
              <div className="w-28 h-8 bg-surface-elevated border border-border-secondary rounded"></div>
            </div>
          </div>
        </div>

        {/* Chart Skeleton */}
        <div className="p-6">
          <div className="h-80 relative">
            {/* Y-axis skeleton */}
            <div className="absolute left-0 top-0 bottom-12 w-12 flex flex-col justify-between py-4 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-3 bg-surface-tertiary rounded w-8"></div>
              ))}
            </div>
            
            {/* Chart area skeleton */}
            <div className="ml-12 h-full relative bg-surface-tertiary/10 rounded-lg">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-px bg-surface-tertiary/30"></div>
                ))}
              </div>
              
              {/* Bars skeleton */}
              <div className="absolute inset-0 flex items-end justify-between px-8 pb-12 animate-pulse">
                {Array.from({ length: 12 }).map((_, i) => {
                  const heights = [25, 45, 30, 60, 40, 35, 55, 20, 50, 40, 30, 45] // Predefined heights for consistency
                  return (
                    <div 
                      key={i} 
                      className="bg-surface-tertiary/60 rounded-t-sm transition-all duration-700 ease-in-out"
                      style={{ 
                        height: `${heights[i]}%`,
                        width: '6%',
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  )
                })}
              </div>
              
              {/* X-axis labels skeleton */}
              <div className="absolute bottom-0 left-8 right-8 flex justify-between animate-pulse">
                {['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((month, i) => (
                  <div key={i} className="h-4 w-4 bg-surface-tertiary/40 rounded text-center text-xs flex items-center justify-center">
                    <span className="text-surface-tertiary">{month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-border-secondary">
            <div className="bg-surface-elevated border border-border-secondary p-4 rounded-lg animate-pulse">
              <div className="h-4 bg-surface-tertiary/60 rounded-full w-2/3 mb-3"></div>
              <div className="h-8 bg-surface-tertiary/80 rounded-lg w-1/2 mb-1"></div>
              <div className="h-3 bg-surface-tertiary/40 rounded-full w-1/3"></div>
            </div>
            
            <div className="bg-surface-elevated border border-border-secondary p-4 rounded-lg animate-pulse" style={{animationDelay: '0.2s'}}>
              <div className="h-4 bg-surface-tertiary/60 rounded-full w-2/3 mb-3"></div>
              <div className="h-8 bg-surface-tertiary/80 rounded-lg w-1/2 mb-1"></div>
              <div className="h-3 bg-surface-tertiary/40 rounded-full w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currencyError) {
    return (
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl p-8">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-text-secondary mx-auto mb-4" />
          <p className="text-red-500 mb-2">Error cargando monedas</p>
          <p className="text-text-secondary text-sm">{currencyError}</p>
        </div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl p-8">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No hay facturas disponibles para mostrar analítica</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl">

      {/* Header with Title and Controls */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-interactive-primary/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-interactive-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Análisis de Gastos</h2>
              <p className="text-sm text-text-secondary">Gastos mensuales por fecha de pago</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Toggle Pagos Externos */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-secondary">Incluir externos</span>
              <button
                onClick={() => {
                  const newValue = !includeExternalPayments;
                  setIncludeExternalPayments(newValue);
                  onFilterChange?.(newValue);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full border-2 transition-all focus:outline-none ${
                  includeExternalPayments 
                    ? 'bg-interactive-primary border-interactive-primary' 
                    : 'bg-surface-elevated border-border-secondary hover:border-border-primary'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 rounded-full transition-all duration-200 shadow-sm ${
                    includeExternalPayments 
                      ? 'translate-x-6 bg-gray-800 border border-gray-700' 
                      : 'translate-x-1 bg-text-secondary'
                  }`}
                />
              </button>
            </div>

            {/* Año */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedYear(prev => prev - 1)}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-text-primary px-3">
                {selectedYear}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedYear(prev => prev + 1)}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Moneda base */}
            <Select value={baseCurrency} onValueChange={(currency) => {
              setBaseCurrency(currency);
              onCurrencyChange?.(currency);
            }}>
              <SelectTrigger className="w-28 h-8 text-sm bg-surface-elevated border-border-secondary hover:bg-surface-primary/50 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getActiveCurrencies().map((currency) => (
                  <SelectItem key={currency.id} value={currency.code}>
                    {currency.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <style jsx>{`
          .recharts-bar-rectangle:hover {
            filter: brightness(0.9);
          }
          .recharts-active-bar {
            filter: brightness(0.9);
          }
          .recharts-cartesian-grid-horizontal line,
          .recharts-cartesian-grid-vertical line {
            stroke: hsl(var(--border-secondary));
            opacity: 0.3;
          }
        `}</style>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-secondary))" />
              
              <XAxis 
                dataKey="month" 
                tick={{ 
                  fill: 'currentColor',
                  fontSize: 14,
                  opacity: 0.7
                }}
                stroke="currentColor"
                className="text-text-secondary"
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              
              <YAxis 
                tick={{ 
                  fill: 'currentColor',
                  fontSize: 14,
                  opacity: 0.7
                }}
                stroke="currentColor"
                className="text-text-secondary"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${formatNumber(value)}`}
                dx={-5}
                width={50}
              />
              
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null
                  
                  // Encontrar los datos del mes para mostrar el desglose por moneda
                  const monthData = chartData.find(item => item.month === label);
                  if (!monthData || !monthData.currencies) return null;

                  const currenciesWithAmounts = Object.entries(monthData.currencies)
                    .filter(([_, amount]) => (amount as number) > 0)
                    .sort(([, a], [, b]) => (b as number) - (a as number));
                  
                  return (
                    <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-lg p-4 shadow-lg">
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-text-primary mb-2">
                          {label} {selectedYear}
                        </div>
                        
                        <div className="space-y-2">
                          {currenciesWithAmounts.map(([currency, amount], index) => {
                            return (
                              <div key={currency} className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-2 text-xs">
                                  <div className="w-2 h-2 rounded bg-status-error"></div>
                                  <span className="text-text-secondary">
                                    {currency.toUpperCase()}
                                  </span>
                                </span>
                                <span className="font-semibold text-sm text-status-error">
                                  {getCurrencySymbol(currency)}{formatCurrencyAmount(amount as number, currency)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="border-t border-border-secondary pt-2 mt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-text-primary">Total ({baseCurrency}):</span>
                            <span className="text-sm font-bold text-text-primary">
                              {getCurrencySymbol(baseCurrency)}{formatNumber(monthData.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }}
              />

              {/* Barra simple de gastos totales */}
              <Bar
                dataKey="total"
                fill="#ef4444"
                name="Gastos del mes"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

// Exportar también los stats para usar fuera del componente
export function InvoiceSummaryStats({ 
  invoices, 
  baseCurrency = 'USD', 
  includeExternalPayments = false 
}: { 
  invoices: Invoice[], 
  baseCurrency?: string,
  includeExternalPayments?: boolean 
}) {
  const { convertToBaseCurrency, formatCurrencyAmount, getCurrencySymbol } = useCurrencyConversion(baseCurrency);
  
  // Filtrar facturas según el toggle de pagos externos
  const filteredInvoices = includeExternalPayments 
    ? invoices 
    : invoices.filter(invoice => !invoice.ignore);
  
  // Calcular estadísticas específicas (convertidos a moneda base)
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Gastos del mes actual (facturas pagadas este mes)
  const currentMonthAmount = filteredInvoices.filter(inv => {
    if (!inv.paid_at) return false;
    const paidDate = new Date(inv.paid_at);
    return paidDate.getMonth() === currentMonth && paidDate.getFullYear() === currentYear;
  }).reduce((sum, inv) => {
    const amount = typeof inv.total === 'number' ? inv.total : parseFloat(inv.total as string) || 0;
    const convertedAmount = convertToBaseCurrency(amount, inv.currency || 'USD');
    return sum + convertedAmount;
  }, 0);
  
  // Proyección estimada basada en tendencia histórica
  const calculateProjection = () => {
    // Obtener gastos de los últimos 3 meses para calcular promedio
    const last3Months = [];
    const now = new Date();
    
    for (let i = 1; i <= 3; i++) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthAmount = filteredInvoices.filter(inv => {
        if (!inv.paid_at) return false;
        const paidDate = new Date(inv.paid_at);
        return paidDate.getMonth() === targetDate.getMonth() && 
               paidDate.getFullYear() === targetDate.getFullYear();
      }).reduce((sum, inv) => {
        const amount = typeof inv.total === 'number' ? inv.total : parseFloat(inv.total as string) || 0;
        return sum + convertToBaseCurrency(amount, inv.currency || 'USD');
      }, 0);
      
      last3Months.push(monthAmount);
    }
    
    // Calcular promedio de los últimos 3 meses
    const averageMonthly = last3Months.reduce((sum, amount) => sum + amount, 0) / 3;
    
    // Retornar promedio como proyección del próximo mes
    return averageMonthly;
  };
  
  const projectionAmount = calculateProjection();

  // Gastos del año actual acumulado (facturas pagadas este año)
  const currentYearAmount = filteredInvoices.filter(inv => {
    if (!inv.paid_at) return false;
    const paidDate = new Date(inv.paid_at);
    return paidDate.getFullYear() === currentYear;
  }).reduce((sum, inv) => {
    const amount = typeof inv.total === 'number' ? inv.total : parseFloat(inv.total as string) || 0;
    const convertedAmount = convertToBaseCurrency(amount, inv.currency || 'USD');
    return sum + convertedAmount;
  }, 0);

  // Comparaciones con períodos anteriores
  // Gastos del mes anterior (mismo mes año pasado)
  const previousMonthAmount = filteredInvoices.filter(inv => {
    if (!inv.paid_at) return false;
    const paidDate = new Date(inv.paid_at);
    return paidDate.getMonth() === currentMonth && paidDate.getFullYear() === (currentYear - 1);
  }).reduce((sum, inv) => {
    const amount = typeof inv.total === 'number' ? inv.total : parseFloat(inv.total as string) || 0;
    const convertedAmount = convertToBaseCurrency(amount, inv.currency || 'USD');
    return sum + convertedAmount;
  }, 0);

  // Gastos del año anterior (mismo período acumulado)
  const previousYearAmount = filteredInvoices.filter(inv => {
    if (!inv.paid_at) return false;
    const paidDate = new Date(inv.paid_at);
    return paidDate.getFullYear() === (currentYear - 1) && paidDate.getMonth() <= currentMonth;
  }).reduce((sum, inv) => {
    const amount = typeof inv.total === 'number' ? inv.total : parseFloat(inv.total as string) || 0;
    const convertedAmount = convertToBaseCurrency(amount, inv.currency || 'USD');
    return sum + convertedAmount;
  }, 0);

  // Proyección anterior (promedio de meses 2-4 anteriores)
  const calculatePreviousProjection = () => {
    // Obtener gastos de 3 meses anteriores al mes pasado para comparar proyecciones
    const last3MonthsPrevious = [];
    const now = new Date();
    
    for (let i = 2; i <= 4; i++) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthAmount = filteredInvoices.filter(inv => {
        if (!inv.paid_at) return false;
        const paidDate = new Date(inv.paid_at);
        return paidDate.getMonth() === targetDate.getMonth() && 
               paidDate.getFullYear() === targetDate.getFullYear();
      }).reduce((sum, inv) => {
        const amount = typeof inv.total === 'number' ? inv.total : parseFloat(inv.total as string) || 0;
        return sum + convertToBaseCurrency(amount, inv.currency || 'USD');
      }, 0);
      
      last3MonthsPrevious.push(monthAmount);
    }
    
    // Promedio mensual anterior
    return last3MonthsPrevious.reduce((sum, amount) => sum + amount, 0) / 3;
  };
  
  const previousProjectionAmount = calculatePreviousProjection();

  // Función para calcular cambio porcentual y determinar color (inverso para gastos)
  const getComparison = (current: number, previous: number, isExpense: boolean = true) => {
    if (previous === 0) return { percentage: 0, isPositive: false, text: 'Sin datos previos' };
    
    const percentage = ((current - previous) / previous) * 100;
    const isPositive = isExpense ? percentage < 0 : percentage > 0; // Inverso para gastos
    
    let text = '';
    if (percentage === 0) {
      text = 'Sin cambios';
    } else {
      const absPercentage = Math.abs(percentage).toFixed(1);
      text = `${percentage > 0 ? '+' : ''}${absPercentage}% vs período anterior`;
    }
    
    return { percentage: Math.abs(percentage), isPositive, text };
  };

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calcular datos de tendencia para los últimos 6 meses
  const getTrendData = () => {
    const months = [];
    const now = new Date();
    
    // Generar últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.getMonth(),
        year: date.getFullYear(),
        monthLabel: date.toLocaleDateString('es-ES', { month: 'short' })
      });
    }

    return months.map(({ month, year, monthLabel }) => {
      // Gastos del mes
      const monthlyAmount = filteredInvoices.filter(inv => {
        if (!inv.paid_at) return false;
        const paidDate = new Date(inv.paid_at);
        return paidDate.getMonth() === month && paidDate.getFullYear() === year;
      }).reduce((sum, inv) => {
        const amount = typeof inv.total === 'number' ? inv.total : parseFloat(inv.total as string) || 0;
        return sum + convertToBaseCurrency(amount, inv.currency || 'USD');
      }, 0);

      // Facturas pendientes al final del mes (aproximación)
      const pendingAtMonth = filteredInvoices.filter(inv => {
        if (inv.paid_at) return false;
        const createdDate = new Date(inv.created_at);
        return createdDate.getMonth() <= month && createdDate.getFullYear() <= year;
      }).reduce((sum, inv) => {
        const amount = typeof inv.total === 'number' ? inv.total : parseFloat(inv.total as string) || 0;
        return sum + convertToBaseCurrency(amount, inv.currency || 'USD');
      }, 0);

      // Gastos acumulados del año hasta ese mes
      const yearlyAmount = filteredInvoices.filter(inv => {
        if (!inv.paid_at) return false;
        const paidDate = new Date(inv.paid_at);
        return paidDate.getFullYear() === year && paidDate.getMonth() <= month;
      }).reduce((sum, inv) => {
        const amount = typeof inv.total === 'number' ? inv.total : parseFloat(inv.total as string) || 0;
        return sum + convertToBaseCurrency(amount, inv.currency || 'USD');
      }, 0);

      return {
        month: monthLabel,
        monthlySpent: monthlyAmount,
        yearlySpent: yearlyAmount,
        pending: pendingAtMonth
      };
    });
  };

  const trendData = getTrendData();

  // Función para determinar el tamaño de fuente basado en la longitud del texto
  const getResponsiveFontSize = (amount: number, currency: string) => {
    const fullText = `${getCurrencySymbol(currency)}${formatNumber(amount)}`;
    const length = fullText.length;
    
    if (length <= 8) return 'text-3xl'; // Números cortos
    if (length <= 12) return 'text-2xl'; // Números medianos
    if (length <= 16) return 'text-xl';  // Números largos
    return 'text-lg'; // Números muy largos
  };

  // Componente mini gráfico
  const MiniChart = ({ data, dataKey, color, type = 'area' }: { 
    data: any[], 
    dataKey: string, 
    color: string,
    type?: 'area' | 'line' 
  }) => (
    <div className="h-12 w-20">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' ? (
          <AreaChart data={data}>
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              fill={color}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Gastado Este Mes */}
      <div className="relative bg-gradient-to-br from-surface-elevated/90 to-surface-secondary/70 backdrop-blur-xl border border-border-secondary/60 rounded-xl p-6 overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg flex items-center justify-center shadow-lg">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Gastado Este Mes</p>
            </div>
          </div>
          <div className="flex items-end justify-between mb-2">
            <p className={`${getResponsiveFontSize(currentMonthAmount, baseCurrency)} font-bold text-white`}>{getCurrencySymbol(baseCurrency)}{formatNumber(currentMonthAmount)}</p>
            {(() => {
              const comparison = getComparison(currentMonthAmount, previousMonthAmount, true);
              const chartColor = comparison.isPositive ? '#10b981' : '#ef4444';
              return <MiniChart data={trendData} dataKey="monthlySpent" color={chartColor} type="area" />;
            })()}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-text-secondary">{new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</p>
            {(() => {
              const comparison = getComparison(currentMonthAmount, previousMonthAmount, true);
              return (
                <div className={`flex items-center gap-1 text-xs ${comparison.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {comparison.isPositive ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                  <span>{comparison.percentage.toFixed(1)}%</span>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
      
      {/* Gastado Este Año */}
      <div className="relative bg-gradient-to-br from-surface-elevated/90 to-surface-secondary/70 backdrop-blur-xl border border-border-secondary/60 rounded-xl p-6 overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg flex items-center justify-center shadow-lg">
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Gastado Este Año</p>
            </div>
          </div>
          <div className="flex items-end justify-between mb-2">
            <p className={`${getResponsiveFontSize(currentYearAmount, baseCurrency)} font-bold text-white`}>{getCurrencySymbol(baseCurrency)}{formatNumber(currentYearAmount)}</p>
            {(() => {
              const comparison = getComparison(currentYearAmount, previousYearAmount, true);
              const chartColor = comparison.isPositive ? '#10b981' : '#ef4444';
              return <MiniChart data={trendData} dataKey="yearlySpent" color={chartColor} type="line" />;
            })()}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-text-secondary">Acumulado {currentYear}</p>
            {(() => {
              const comparison = getComparison(currentYearAmount, previousYearAmount, true);
              return (
                <div className={`flex items-center gap-1 text-xs ${comparison.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {comparison.isPositive ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                  <span>{comparison.percentage.toFixed(1)}%</span>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Proyección Pendiente */}
      <div className="relative bg-gradient-to-br from-surface-elevated/90 to-surface-secondary/70 backdrop-blur-xl border border-border-secondary/60 rounded-xl p-6 overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg flex items-center justify-center shadow-lg">
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Proyección Próximo Mes</p>
            </div>
          </div>
          <div className="flex items-end justify-between mb-2">
            <p className={`${getResponsiveFontSize(projectionAmount, baseCurrency)} font-bold text-white`}>{getCurrencySymbol(baseCurrency)}{formatNumber(projectionAmount)}</p>
            {(() => {
              const comparison = getComparison(projectionAmount, previousProjectionAmount, true);
              const chartColor = comparison.isPositive ? '#10b981' : '#ef4444';
              return <MiniChart data={trendData} dataKey="pending" color={chartColor} type="area" />;
            })()}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-text-secondary">Basado en últimos 3 meses</p>
            {(() => {
              const comparison = getComparison(projectionAmount, previousProjectionAmount, true);
              return (
                <div className={`flex items-center gap-1 text-xs ${comparison.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {comparison.isPositive ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                  <span>{comparison.percentage.toFixed(1)}%</span>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export function InvoicePieCharts({ 
  invoices, 
  baseCurrency = 'USD', 
  includeExternalPayments = false 
}: { 
  invoices: Invoice[], 
  baseCurrency?: string,
  includeExternalPayments?: boolean 
}) {
  const { convertToBaseCurrency, getCurrencySymbol } = useCurrencyConversion(baseCurrency);
  
  // Estados para trackear hover en cada pie chart
  const [hoveredCompanyIndex, setHoveredCompanyIndex] = useState<number | null>(null);
  const [hoveredCurrencyIndex, setHoveredCurrencyIndex] = useState<number | null>(null);
  
  // Filtrar facturas según el toggle de pagos externos
  const filteredInvoices = includeExternalPayments 
    ? invoices 
    : invoices.filter(invoice => !invoice.ignore);

  // Solo facturas pagadas para los pie charts
  const paidInvoices = filteredInvoices.filter(inv => inv.paid_at);

  // Datos para el pie chart de compañías
  const companyData = paidInvoices.reduce((acc, invoice) => {
    const company = invoice.company_name || 'Sin nombre';
    const amount = typeof invoice.total === 'number' ? invoice.total : parseFloat(invoice.total as string) || 0;
    const convertedAmount = convertToBaseCurrency(amount, invoice.currency || 'USD');
    
    if (acc[company]) {
      acc[company] += convertedAmount;
    } else {
      acc[company] = convertedAmount;
    }
    
    return acc;
  }, {} as Record<string, number>);

  // Convertir a array y tomar top 6 compañías
  const companyChartData = Object.entries(companyData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)
    .map((item, index) => ({
      ...item,
      color: ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fed7d7', '#fee2e2'][index]
    }));

  // Datos para el pie chart de monedas
  const currencyData = paidInvoices.reduce((acc, invoice) => {
    const currency = invoice.currency || 'USD';
    const amount = typeof invoice.total === 'number' ? invoice.total : parseFloat(invoice.total as string) || 0;
    
    if (acc[currency]) {
      acc[currency] += amount;
    } else {
      acc[currency] = amount;
    }
    
    return acc;
  }, {} as Record<string, number>);

  const currencyChartData = Object.entries(currencyData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .map((item, index) => ({
      ...item,
      color: ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fed7d7', '#fee2e2'][index % 6]
    }));

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };


  if (paidInvoices.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl p-8">
          <div className="text-center">
            <Receipt className="h-12 w-12 text-text-secondary/50 mx-auto mb-4" />
            <p className="text-text-secondary text-sm">No hay datos de gastos por compañía</p>
          </div>
        </div>
        <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl p-8">
          <div className="text-center">
            <DollarSign className="h-12 w-12 text-text-secondary/50 mx-auto mb-4" />
            <p className="text-text-secondary text-sm">No hay datos de gastos por moneda</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Pie Chart 1: Gastos por Compañía */}
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-interactive-primary/10 rounded-lg flex items-center justify-center">
            <Receipt className="h-4 w-4 text-interactive-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary">Compañía</h3>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={companyChartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={156}
                cornerRadius={8}
                fill="#8884d8"
                dataKey="value"
                stroke="hsl(var(--surface-secondary))"
                strokeWidth={2}
                paddingAngle={6}
                onMouseEnter={(_, index) => setHoveredCompanyIndex(index)}
                onMouseLeave={() => setHoveredCompanyIndex(null)}
              >
                {companyChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="hsl(var(--surface-primary))"
                    strokeWidth={1}
                    opacity={hoveredCompanyIndex === null ? 1.0 : hoveredCompanyIndex === index ? 1.0 : 0.3}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Información estática debajo del gráfico */}
        <div className="mt-4 h-8 flex items-center justify-center">
          {hoveredCompanyIndex !== null && hoveredCompanyIndex < companyChartData.length ? (
            (() => {
              const data = companyChartData[hoveredCompanyIndex];
              const total = companyChartData.reduce((sum, entry) => sum + entry.value, 0);
              const percentage = ((data.value / total) * 100).toFixed(1);
              return (
                <p className="text-sm text-text-primary font-medium">
                  {data.name} - {getCurrencySymbol(baseCurrency)}{formatNumber(data.value)} ({percentage}%)
                </p>
              );
            })()
          ) : (
            <p className="text-sm text-text-secondary">
              Pasa el cursor sobre un sector para ver detalles
            </p>
          )}
        </div>
      </div>

      {/* Pie Chart 2: Gastos por Moneda */}
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-interactive-primary/10 rounded-lg flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-interactive-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary">Categoría</h3>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={currencyChartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={156}
                cornerRadius={8}
                fill="#8884d8"
                dataKey="value"
                stroke="hsl(var(--surface-secondary))"
                strokeWidth={2}
                paddingAngle={6}
                onMouseEnter={(_, index) => setHoveredCurrencyIndex(index)}
                onMouseLeave={() => setHoveredCurrencyIndex(null)}
              >
                {currencyChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="hsl(var(--surface-primary))"
                    strokeWidth={1}
                    opacity={hoveredCurrencyIndex === null ? 1.0 : hoveredCurrencyIndex === index ? 1.0 : 0.3}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Información estática debajo del gráfico */}
        <div className="mt-4 h-8 flex items-center justify-center">
          {hoveredCurrencyIndex !== null && hoveredCurrencyIndex < currencyChartData.length ? (
            (() => {
              const data = currencyChartData[hoveredCurrencyIndex];
              const total = currencyChartData.reduce((sum, entry) => sum + entry.value, 0);
              const percentage = ((data.value / total) * 100).toFixed(1);
              return (
                <p className="text-sm text-text-primary font-medium">
                  {data.name} - {getCurrencySymbol(data.name)}{formatNumber(data.value)} ({percentage}%)
                </p>
              );
            })()
          ) : (
            <p className="text-sm text-text-secondary">
              Pasa el cursor sobre un sector para ver detalles
            </p>
          )}
        </div>
      </div>
    </div>
  );
}