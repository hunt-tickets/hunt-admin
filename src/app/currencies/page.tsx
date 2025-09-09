"use client"

import { useState } from "react";
import { DollarSign, Globe, Plus, ExternalLink, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { CreateCurrencyForm } from "@/components/create-currency-form";
import { CreateCountryForm } from "@/components/create-country-form";
import { EditCurrencyForm } from "@/components/edit-currency-form";
import { EditCountryForm } from "@/components/edit-country-form";
import { useCurrencies } from "@/hooks/use-currencies";
import { useCountries } from "@/hooks/use-countries";
import { Currency, Country } from "@/lib/db";
import { CurrenciesProvider } from "@/contexts/currencies-context";

function AdminGlobalPageContent() {
  const { currencies, loading: currenciesLoading, error: currenciesError, createCurrency } = useCurrencies()
  const { countries, loading: countriesLoading, error: countriesError, createCountry } = useCountries()

  const [showCreateCurrency, setShowCreateCurrency] = useState(false);
  const [showCreateCountry, setShowCreateCountry] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  // Helper function to get currency by id
  const getCurrencyById = (id: string | null) => {
    if (!id) return null;
    return currencies.find(c => c.id === id);
  };

  // Handle successful creation
  const handleCurrencyCreated = (currency: Currency) => {
    setShowCreateCurrency(false);
    // The hook automatically updates the currencies list
  };

  const handleCountryCreated = (country: Country) => {
    setShowCreateCountry(false);
    // The hook automatically updates the countries list
  };

  // Handle successful editing
  const handleCurrencyUpdated = (currency: Currency) => {
    setEditingCurrency(null);
    // The hook automatically updates the currencies list
  };

  const handleCountryUpdated = (country: Country) => {
    setEditingCountry(null);
    // The hook automatically updates the countries list
  };

  // Handle card clicks for editing
  const handleCurrencyClick = (currency: Currency) => {
    setEditingCurrency(currency);
  };

  const handleCountryClick = (country: Country) => {
    setEditingCountry(country);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Monedas & Países</h1>
        <p className="text-text-secondary mt-2">
          Administra las monedas y países disponibles para toda la plataforma Hunt Tickets.
        </p>
      </div>

      {/* Currencies Section */}
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-interactive-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-interactive-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Monedas</h2>
                <p className="text-sm text-text-secondary">Gestiona las monedas disponibles</p>
              </div>
            </div>
            <Sheet open={showCreateCurrency} onOpenChange={setShowCreateCurrency}>
              <SheetTrigger asChild>
                <Button size="icon" className="bg-interactive-primary text-text-inverse hover:bg-interactive-active">
                  <Plus className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <CreateCurrencyForm
                onSuccess={handleCurrencyCreated}
                onCancel={() => setShowCreateCurrency(false)}
              />
            </Sheet>
          </div>
        </div>
        
        <div className="p-6">
          {currenciesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.from({ length: 12 }).map((_, index) => (
                <div 
                  key={index} 
                  className="bg-surface-elevated border border-border-secondary rounded-lg p-4 animate-pulse"
                >
                  <div className="flex flex-col items-center space-y-3">
                    {/* Currency symbol skeleton */}
                    <div className="w-12 h-12 bg-surface-tertiary rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-surface-tertiary/50 rounded"></div>
                    </div>
                    <div className="text-center space-y-1">
                      {/* Currency code skeleton */}
                      <div className="h-4 bg-surface-tertiary rounded w-8 mx-auto"></div>
                      {/* Currency name skeleton */}
                      <div className="h-3 bg-surface-tertiary rounded w-16 mx-auto"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : currenciesError ? (
            <div className="flex items-center justify-center py-12 text-red-500">
              Error: {currenciesError}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {currencies.map((currency) => {
                const getName = () => {
                  if (typeof currency.name === 'string') {
                    return currency.name;
                  }
                  if (currency.name && typeof currency.name === 'object') {
                    return currency.name.es || currency.name.en || JSON.stringify(currency.name);
                  }
                  return 'N/A';
                };
                
                return (
                  <div 
                    key={currency.id} 
                    onClick={() => handleCurrencyClick(currency)}
                    className="bg-surface-elevated border border-border-secondary rounded-lg p-4 hover:bg-surface-primary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 bg-interactive-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-interactive-primary">{currency.symbol}</span>
                      </div>
                      <div className="text-center">
                        <p className="font-mono font-bold text-sm">{currency.code}</p>
                        <p className="text-xs text-text-secondary truncate">{getName()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Countries Section */}
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary rounded-xl">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-interactive-primary/10 rounded-lg flex items-center justify-center">
                <Globe className="h-5 w-5 text-interactive-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Países</h2>
                <p className="text-sm text-text-secondary">Gestiona los países disponibles</p>
              </div>
            </div>
            <Sheet open={showCreateCountry} onOpenChange={setShowCreateCountry}>
              <SheetTrigger asChild>
                <Button size="icon" className="bg-interactive-primary text-text-inverse hover:bg-interactive-active">
                  <Plus className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <CreateCountryForm
                currencies={currencies}
                onSuccess={handleCountryCreated}
                onCancel={() => setShowCreateCountry(false)}
              />
            </Sheet>
          </div>
        </div>
        
        <div className="p-6">
          {countriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.from({ length: 12 }).map((_, index) => (
                <div 
                  key={index} 
                  className="bg-surface-elevated border border-border-secondary rounded-lg p-4 animate-pulse"
                >
                  <div className="flex flex-col items-center space-y-3">
                    {/* Country icon skeleton */}
                    <div className="w-12 h-12 bg-surface-tertiary rounded-full flex items-center justify-center">
                      <div className="w-5 h-5 bg-surface-tertiary/50 rounded"></div>
                    </div>
                    <div className="text-center space-y-1">
                      {/* Country name skeleton */}
                      <div className="h-4 bg-surface-tertiary rounded w-20 mx-auto"></div>
                      {/* Country code skeleton */}
                      <div className="h-3 bg-surface-tertiary rounded w-8 mx-auto"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : countriesError ? (
            <div className="flex items-center justify-center py-12 text-red-500">
              Error: {countriesError}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {countries.map((country) => {
                const defaultCurrency = !currenciesLoading ? getCurrencyById(country.default_currency_id) : null;
                return (
                  <div 
                    key={country.id} 
                    onClick={() => handleCountryClick(country)}
                    className="bg-surface-elevated border border-border-secondary rounded-lg p-4 hover:bg-surface-primary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 bg-interactive-primary/10 rounded-full flex items-center justify-center">
                        <Globe className="h-5 w-5 text-interactive-primary" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-sm">{country.name}</p>
                        <p className="text-xs font-mono text-text-secondary">{country.code}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modals */}
      <Sheet open={!!editingCurrency} onOpenChange={() => setEditingCurrency(null)}>
        {editingCurrency && (
          <EditCurrencyForm
            currency={editingCurrency}
            onSuccess={handleCurrencyUpdated}
            onCancel={() => setEditingCurrency(null)}
          />
        )}
      </Sheet>

      <Sheet open={!!editingCountry} onOpenChange={() => setEditingCountry(null)}>
        {editingCountry && (
          <EditCountryForm
            country={editingCountry}
            currencies={currencies}
            onSuccess={handleCountryUpdated}
            onCancel={() => setEditingCountry(null)}
          />
        )}
      </Sheet>
    </div>
  );
}

export default function AdminGlobalPage() {
  return (
    <CurrenciesProvider>
      <AdminGlobalPageContent />
    </CurrenciesProvider>
  );
}