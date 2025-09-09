"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Calendar, Building2, Settings, LogOut, DollarSign, Globe, CreditCard, Users, Wallet, Zap, Megaphone } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const ThemeToggle = dynamic(() => import('@/components/ui/ThemeToggle').then(mod => ({ default: mod.ThemeToggle })), {
  ssr: false,
  loading: () => (
    <div className="p-2 rounded-lg bg-surface-elevated border border-border-primary/20 w-10 h-10 flex items-center justify-center">
      <div className="w-4 h-4 bg-text-secondary/20 rounded animate-pulse"></div>
    </div>
  )
});

const navigation = [
  // Main sections
  { name: 'Eventos', href: '/eventos', section: 'main', icon: Calendar },
  { name: 'Referidos', href: '/referidos', section: 'main', icon: Users },
  { name: 'Organizaciones', href: '/perfil', section: 'main', icon: Building2 },
  { name: 'Marketing', href: '/marketing', section: 'main', icon: Megaphone },
  { name: 'Payment Gateway', href: '/payment-gateway', section: 'main', icon: Wallet },
  { name: 'Integraciones', href: '/integraciones', section: 'main', icon: Zap },
  
  // Currencies & Countries
  { name: 'Monedas & Países', href: '/currencies', section: 'currencies', icon: DollarSign },
  { name: 'Facturas', href: '/invoices', section: 'currencies', icon: CreditCard },
  
  // Settings
  { name: 'Configuración', href: '/configuracion', section: 'settings', icon: Settings },
];

const navigationSections = {
  main: { title: 'Principal', items: navigation.filter(item => item.section === 'main') },
  'currencies': { title: 'Monedas & Países', items: navigation.filter(item => item.section === 'currencies') },
  settings: { title: 'Sistema', items: navigation.filter(item => item.section === 'settings') },
};

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() 
    : user?.email?.[0]?.toUpperCase() || '';

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-surface-secondary border-r border-border-primary flex flex-col z-40">
      {/* Header Section - Fixed */}
      <div className="flex-shrink-0 p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-interactive-primary to-chart-3 flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <div className="font-bold text-text-primary">Hunt Admin</div>
          </div>
          
          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
      
      {/* Navigation Section - Scrollable */}
      <div className="flex-1 overflow-auto px-6">
        <nav className="space-y-6">
          {Object.entries(navigationSections).map(([sectionKey, section]) => (
            <div key={sectionKey}>
              <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-interactive-primary text-text-inverse'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* User Section - Fixed at Bottom */}
      {user && (
        <div className="flex-shrink-0 p-6 pt-4 border-t border-border-primary">
          {/* User profile display */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-elevated mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-interactive-primary to-chart-3 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xs">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
              <p className="text-xs text-text-secondary truncate">{user.email}</p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-text-secondary hover:text-text-primary hover:bg-surface-elevated w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      )}
    </div>
  );
}