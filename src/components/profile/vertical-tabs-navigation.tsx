"use client"

import { 
  Calendar, 
  BarChart3, 
  Settings, 
  Users, 
  UserPlus,
  CreditCard,
  FileText,
  Share2,
  Palette,
  Shield
} from "lucide-react";
import { useProfileTab } from "@/contexts/profile-tab-context";
import type { TabItem, TabId } from "@/types/tabs";

const tabItems: TabItem[] = [
  { id: "events", label: "Eventos", icon: Calendar },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "customers", label: "Clientes", icon: Users },
  { id: "team", label: "Equipo", icon: UserPlus },
  { id: "billing", label: "Facturación", icon: CreditCard },
  { id: "reports", label: "Reportes", icon: FileText },
  { id: "social", label: "Redes Sociales", icon: Share2 },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "politicas", label: "Políticas", icon: Shield },
  { id: "settings", label: "Configuración", icon: Settings },
];

export function VerticalTabsNavigation() {
  const { activeTab, setActiveTab } = useProfileTab();

  return (
    <div className="space-y-1">
      {tabItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as TabId)}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
              transition-all duration-200
              ${isActive 
                ? 'bg-sidebar-accent text-sidebar-foreground border border-sidebar-border' 
                : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              }
            `}
          >
            <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-sidebar-foreground drop-shadow-lg' : 'text-sidebar-foreground/70'}`} strokeWidth={1} />
            <span className="font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}