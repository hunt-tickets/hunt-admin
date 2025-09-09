"use client"

import { useState, useEffect } from "react";
import { Calendar, BarChart3, Users, Megaphone, UserCheck, Settings, LogOut, Building2, ChevronLeft, ChevronRight, Sun, Moon, Monitor } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { SidebarControls } from "@/components/sidebar-controls";
import { VerticalTabsNavigation } from "@/components/profile/vertical-tabs-navigation";
import { usePathname } from "next/navigation";
import type { Theme } from "@/hooks/use-theme";

const mainNavigation = [
  { id: "eventos", title: "Eventos", url: "/eventos", icon: Calendar },
  { id: "perfil", title: "Perfil", url: "/perfil", icon: Building2, hasSubmenu: true },
];

export function CombinedSidebar() {
  const { sidebarState, setSidebarState, isHydrated } = useSidebarState();
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const showExpanded = isHydrated && (sidebarState === 'expanded' || (sidebarState === 'hover' && isHovering));
  const showSubmenu = pathname === '/perfil';
  
  const toggleSidebar = () => {
    if (sidebarState === 'expanded') {
      setSidebarState('collapsed');
    } else {
      setSidebarState('expanded');
    }
  };

  const handleMouseEnter = () => {
    if (!isHydrated || sidebarState !== 'hover') return;
    
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    
    const timeout = setTimeout(() => {
      setIsHovering(true);
    }, 150); // Delay para evitar flickering
    
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (!isHydrated || sidebarState !== 'hover') return;
    
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    
    const timeout = setTimeout(() => {
      setIsHovering(false);
    }, 300); // Delay más largo para salir
    
    setHoverTimeout(timeout);
  };
  


  const initials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() 
    : user?.email?.[0]?.toUpperCase() || '';

  return (
    <div className="flex h-screen">
      {/* Main Sidebar */}
      <div 
        className={`bg-sidebar border-r border-sidebar-border transition-[width] duration-200 ease-in-out flex flex-col ${
          showExpanded ? 'w-64' : 'w-16'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-surface-primary rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">H</span>
              </div>
              <span className={`font-semibold text-lg text-sidebar-foreground transition-opacity duration-200 delay-50 ${
                showExpanded ? 'opacity-100' : 'opacity-0'
              }`}>Hunt</span>
            </div>
            {isHydrated && showExpanded && (
              <button
                onClick={toggleSidebar}
                className="p-1 hover:bg-sidebar-accent rounded transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-sidebar-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-2">
          <nav className="space-y-3">
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.url;
              
              return (
                <a
                  key={item.id}
                  href={item.url}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg group ${
                    isActive 
                      ? 'bg-sidebar-accent text-sidebar-foreground border border-sidebar-border' 
                      : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-sidebar-foreground drop-shadow-lg' : 'text-sidebar-foreground/70'
                  }`} strokeWidth={1} />
                  <span className={`font-medium transition-[opacity,transform] duration-200 delay-50 ${
                    showExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                  }`}>{item.title}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Sidebar State Control */}
        {isHydrated && (
          showExpanded ? (
            <SidebarControls 
              sidebarState={sidebarState}
              setSidebarState={setSidebarState}
              isHydrated={isHydrated}
            />
          ) : (
            // Mini control cuando está colapsado
            <div className="p-2 border-t border-sidebar-border">
              <button
                onClick={toggleSidebar}
                className="w-full p-2 hover:bg-sidebar-accent rounded transition-colors flex justify-center"
                title="Expandir menú"
              >
                <ChevronRight className="h-4 w-4 text-sidebar-foreground" />
              </button>
            </div>
          )
        )}

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-4">
          {/* Theme Selector */}
          {showExpanded && (
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-3">Tema</span>
              <div className="flex gap-1">
                {[
                  { value: 'light', icon: Sun, label: 'Claro' },
                  { value: 'dark', icon: Moon, label: 'Oscuro' },
                  { value: 'system', icon: Monitor, label: 'Sistema' }
                ].map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value as Theme)}
                    className={`flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-xs font-medium ${
                      theme === value
                        ? 'bg-sidebar-accent text-sidebar-foreground border border-sidebar-border'
                        : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }`}
                    title={label}
                  >
                    <Icon className="h-3 w-3 flex-shrink-0" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          <a
            href="/configuracion"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <Settings className="h-4 w-4 flex-shrink-0" />
            <span className={`font-medium transition-[opacity,transform] duration-200 delay-50 ${
              showExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
            }`}>Configuración</span>
          </a>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-destructive hover:bg-sidebar-accent/50 transition-colors w-full"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span className={`font-medium transition-[opacity,transform] duration-200 delay-50 whitespace-nowrap ${
              showExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
            }`}>Cerrar Sesión</span>
          </button>

          {/* User Profile */}
          {showExpanded && user && (
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-sidebar-accent/50">
              <div className="w-8 h-8 bg-gradient-to-r from-chart-1 to-chart-2 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-xs">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Submenu - Navigation Only */}
      {showSubmenu && (
        <div className="w-80 bg-sidebar border-r border-sidebar-border">
          <div className="p-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              Navegación del Perfil
            </h3>
            <VerticalTabsNavigation />
          </div>
        </div>
      )}
    </div>
  );
}

export default CombinedSidebar;