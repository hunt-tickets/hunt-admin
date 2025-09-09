"use client"

import { useState } from "react";
import { CreditCard, Plus, Receipt, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { CreateInvoiceForm } from "@/components/create-invoice-form";
import { EditInvoiceForm } from "@/components/edit-invoice-form";
import { InvoiceAnalytics, InvoiceSummaryStats, InvoicePieCharts } from "@/components/invoices/invoice-analytics";
import { useInvoices } from "@/hooks/use-invoices";
import { Invoice } from "@/lib/db";
import { InvoicesProvider } from "@/contexts/invoices-context";

function InvoicesPageContent() {
  const { invoices, loading, error } = useInvoices()

  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [includeExternalPayments, setIncludeExternalPayments] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // Combined loading state for unified skeleton
  const isLoading = loading || isFilterLoading;

  // Handle currency change with loading state
  const handleCurrencyChange = (currency: string) => {
    setIsFilterLoading(true);
    setSelectedCurrency(currency);
    // Simulate loading delay for currency conversion
    setTimeout(() => {
      setIsFilterLoading(false);
    }, 500);
  };

  // Handle filter change with loading state
  const handleFilterChange = (includeExternal: boolean) => {
    setIsFilterLoading(true);
    setIncludeExternalPayments(includeExternal);
    // Simulate loading delay for filter processing
    setTimeout(() => {
      setIsFilterLoading(false);
    }, 300);
  };

  // Handle successful creation
  const handleInvoiceCreated = (invoice: Invoice) => {
    setShowCreateInvoice(false);
  };

  // Handle successful editing
  const handleInvoiceUpdated = (invoice: Invoice) => {
    setEditingInvoice(null);
  };

  // Handle card clicks for editing
  const handleInvoiceClick = (invoice: Invoice) => {
    setEditingInvoice(invoice);
  };

  // Format currency
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Facturas</h1>
        <p className="text-text-secondary mt-2">
          Gestiona las facturas y gastos de la plataforma.
        </p>
      </div>

      {/* Analytics Section */}
      {isLoading ? (
        <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl p-6">
          <div className="animate-pulse space-y-6">
            {/* Chart skeleton */}
            <div className="h-64 bg-surface-tertiary rounded-lg"></div>
            {/* Controls skeleton */}
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <div className="h-8 w-24 bg-surface-tertiary rounded"></div>
                <div className="h-8 w-32 bg-surface-tertiary rounded"></div>
              </div>
              <div className="h-8 w-20 bg-surface-tertiary rounded"></div>
            </div>
          </div>
        </div>
      ) : !error && invoices.length > 0 ? (
        <InvoiceAnalytics 
          invoices={invoices} 
          onCurrencyChange={handleCurrencyChange}
          onFilterChange={handleFilterChange}
        />
      ) : null}

      {/* Summary Stats Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="relative bg-gradient-to-br from-surface-elevated/90 to-surface-secondary/70 backdrop-blur-xl border border-border-secondary/60 rounded-xl p-6 animate-pulse">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] rounded-xl"></div>
              <div className="relative z-10 space-y-4">
                {/* Icon skeleton */}
                <div className="w-8 h-8 bg-surface-tertiary/50 rounded-lg"></div>
                {/* Title skeleton */}
                <div className="h-4 bg-surface-tertiary/50 rounded w-3/4"></div>
                {/* Amount skeleton */}
                <div className="h-8 bg-surface-tertiary/50 rounded w-2/3"></div>
                {/* Mini chart skeleton */}
                <div className="h-12 bg-surface-tertiary/50 rounded"></div>
                {/* Comparison skeleton */}
                <div className="h-4 bg-surface-tertiary/50 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : !error && invoices.length > 0 ? (
        <InvoiceSummaryStats 
          invoices={invoices} 
          baseCurrency={selectedCurrency}
          includeExternalPayments={includeExternalPayments}
        />
      ) : null}

      {/* Pie Charts Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl p-6 animate-pulse">
              <div className="space-y-6">
                {/* Title skeleton */}
                <div className="h-6 bg-surface-tertiary rounded w-1/3"></div>
                {/* Pie chart skeleton */}
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-surface-tertiary rounded-full"></div>
                </div>
                {/* Tooltip skeleton */}
                <div className="h-4 bg-surface-tertiary rounded w-2/3 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      ) : !error && invoices.length > 0 ? (
        <InvoicePieCharts 
          invoices={invoices} 
          baseCurrency={selectedCurrency}
          includeExternalPayments={includeExternalPayments}
        />
      ) : null}

      {/* Invoices Section */}
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-interactive-primary/10 rounded-lg flex items-center justify-center">
                <Receipt className="h-5 w-5 text-interactive-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Facturas</h2>
                <p className="text-sm text-text-secondary">Gestiona las facturas y gastos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Date Navigation */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    // Get months with invoices
                    const monthsWithInvoices = invoices
                      .filter(invoice => invoice.paid_at)
                      .map(invoice => {
                        const date = new Date(invoice.paid_at!);
                        return { month: date.getMonth(), year: date.getFullYear() };
                      })
                      .filter((date, index, self) => 
                        self.findIndex(d => d.month === date.month && d.year === date.year) === index
                      )
                      .sort((a, b) => (b.year - a.year) || (b.month - a.month));

                    // Find current position
                    const currentIndex = monthsWithInvoices.findIndex(
                      m => m.month === selectedMonth && m.year === selectedYear
                    );

                    // Navigate to previous month with invoices (chronologically earlier)
                    if (currentIndex < monthsWithInvoices.length - 1) {
                      const prevMonth = monthsWithInvoices[currentIndex + 1];
                      setSelectedMonth(prevMonth.month);
                      setSelectedYear(prevMonth.year);
                    }
                  }}
                  className="h-8 w-8 bg-surface-elevated border-border-secondary hover:bg-surface-primary/50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <span className="text-sm font-medium text-text-primary px-3">
                  {[
                    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                  ][selectedMonth]} {selectedYear}
                </span>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    // Get months with invoices
                    const monthsWithInvoices = invoices
                      .filter(invoice => invoice.paid_at)
                      .map(invoice => {
                        const date = new Date(invoice.paid_at!);
                        return { month: date.getMonth(), year: date.getFullYear() };
                      })
                      .filter((date, index, self) => 
                        self.findIndex(d => d.month === date.month && d.year === date.year) === index
                      )
                      .sort((a, b) => (b.year - a.year) || (b.month - a.month));

                    // Find current position
                    const currentIndex = monthsWithInvoices.findIndex(
                      m => m.month === selectedMonth && m.year === selectedYear
                    );

                    // Navigate to next month with invoices (chronologically later)
                    if (currentIndex > 0) {
                      const nextMonth = monthsWithInvoices[currentIndex - 1];
                      setSelectedMonth(nextMonth.month);
                      setSelectedYear(nextMonth.year);
                    }
                  }}
                  className="h-8 w-8 bg-surface-elevated border-border-secondary hover:bg-surface-primary/50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <Sheet open={showCreateInvoice} onOpenChange={setShowCreateInvoice}>
                <SheetTrigger asChild>
                  <Button size="icon" className="bg-interactive-primary text-text-inverse hover:bg-interactive-active">
                    <Plus className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <CreateInvoiceForm
                  onSuccess={handleInvoiceCreated}
                  onCancel={() => setShowCreateInvoice(false)}
                />
              </Sheet>
            </div>
          </div>
        </div>
        
        <div className="p-6 pt-0">
          {error ? (
            <div className="flex items-center justify-center py-12 text-red-500">
              Error: {error}
            </div>
          ) : (
            (() => {
              // Get all months that have invoices
              const monthsWithInvoices = invoices
                .filter(invoice => invoice.paid_at)
                .map(invoice => {
                  const date = new Date(invoice.paid_at!);
                  return { month: date.getMonth(), year: date.getFullYear(), date };
                })
                .filter((date, index, self) => 
                  self.findIndex(d => d.month === date.month && d.year === date.year) === index
                )
                .sort((a, b) => (b.year - a.year) || (b.month - a.month));

              // If no months with invoices, show empty state
              if (monthsWithInvoices.length === 0) {
                return (
                  <div className="col-span-full flex flex-col items-center justify-center py-12">
                    <Receipt className="h-12 w-12 text-text-secondary/50 mb-4" />
                    <p className="text-text-secondary text-sm">No hay facturas disponibles</p>
                  </div>
                );
              }

              // Check if current selection has invoices, if not set to latest month with invoices
              const currentHasInvoices = monthsWithInvoices.some(
                m => m.month === selectedMonth && m.year === selectedYear
              );
              
              let currentMonth = selectedMonth;
              let currentYear = selectedYear;
              
              if (!currentHasInvoices && !isLoading) {
                // Set to the latest month with invoices
                const latest = monthsWithInvoices[0];
                currentMonth = latest.month;
                currentYear = latest.year;
                
                // Update state without causing infinite loops
                if (selectedMonth !== currentMonth || selectedYear !== currentYear) {
                  setTimeout(() => {
                    setSelectedMonth(currentMonth);
                    setSelectedYear(currentYear);
                  }, 0);
                }
              }

              // Filter invoices based on current month and year
              const filteredInvoices = invoices.filter(invoice => {
                if (!invoice.paid_at) return false;
                const paidDate = new Date(invoice.paid_at);
                return paidDate.getMonth() === currentMonth && paidDate.getFullYear() === currentYear;
              }).sort((a, b) => {
                const dateA = new Date(a.paid_at || a.created_at);
                const dateB = new Date(b.paid_at || b.created_at);
                return dateB.getTime() - dateA.getTime();
              });

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {isLoading ? (
                    // Skeleton cards while loading with glassmorphism
                    Array.from({ length: 8 }).map((_, index) => (
                      <div 
                        key={index} 
                        className="relative bg-gradient-to-br from-surface-elevated/90 to-surface-secondary/70 backdrop-blur-xl border border-border-secondary/60 rounded-2xl p-6 animate-pulse overflow-hidden"
                      >
                        {/* Glassmorphism overlay */}
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] rounded-2xl"></div>
                        
                        {/* Content wrapper with relative positioning */}
                        <div className="relative z-10">
                          {/* Company Skeleton */}
                          <div className="mb-4">
                            <div className="h-4 bg-surface-tertiary/50 rounded w-3/4"></div>
                          </div>

                          {/* Amount Skeleton */}
                          <div className="mb-3">
                            <div className="h-8 bg-surface-tertiary/50 rounded w-2/3"></div>
                          </div>

                          {/* Footer Skeleton */}
                          <div className="flex items-center justify-between">
                            <div className="h-3 bg-surface-tertiary/50 rounded w-1/3"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    filteredInvoices.map((invoice) => (
                <div 
                  key={invoice.id} 
                  onClick={() => handleInvoiceClick(invoice)}
                  className="group relative bg-gradient-to-br from-surface-elevated/90 to-surface-secondary/70 backdrop-blur-xl border border-border-secondary/60 rounded-2xl p-6 hover:bg-surface-elevated/95 hover:border-border-secondary transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Glassmorphism overlay */}
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] rounded-2xl"></div>
                  
                  {/* Content wrapper with relative positioning */}
                  <div className="relative z-10">
                  
                    {/* Company */}
                    <div className="mb-4">
                      <h3 className="font-medium text-text-primary text-sm mb-1 truncate">
                        {invoice.company_name}
                      </h3>
                    </div>

                    {/* Amount */}
                    <div className="mb-3">
                      <span className="text-2xl font-semibold text-text-primary tracking-tight">
                        {formatAmount(invoice.total, invoice.currency)}
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">
                        {invoice.paid_at ? formatDate(invoice.paid_at) : 'Sin fecha de pago'}
                      </span>
                    </div>
                  </div>
                </div>
                    ))
                  )}
                </div>
              );
            })()
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Sheet open={!!editingInvoice} onOpenChange={() => setEditingInvoice(null)}>
        {editingInvoice && (
          <EditInvoiceForm
            invoice={editingInvoice}
            onSuccess={handleInvoiceUpdated}
            onCancel={() => setEditingInvoice(null)}
          />
        )}
      </Sheet>
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <InvoicesProvider>
      <InvoicesPageContent />
    </InvoicesProvider>
  );
}