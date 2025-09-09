"use client"

import { useState } from "react";
import { 
  Calendar, 
  BarChart3, 
  Settings, 
  Users, 
  CreditCard,
  FileText,
  Share2,
  Palette,
  Shield,
  Globe
} from "lucide-react";
import { TabNavigation } from "./tab-navigation";
import { TabContentRenderer } from "./tab-content-renderer";
import type { TabItem, TabId, VerticalTabsProps } from "@/types/tabs";

const tabItems: TabItem[] = [
  { id: "events", label: "Eventos", icon: Calendar },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "customers", label: "Clientes", icon: Users },
  { id: "billing", label: "Facturación", icon: CreditCard },
  { id: "reports", label: "Reportes", icon: FileText },
  { id: "social", label: "Redes Sociales", icon: Share2 },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "politicas", label: "Políticas", icon: Shield },
  { id: "website", label: "Website", icon: Globe },
  { id: "settings", label: "Configuración", icon: Settings },
];

export function VerticalTabsContainer({ 
  defaultTab = "events", 
  onTabChange, 
  producerId, 
  currentProducer 
}: VerticalTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className="flex gap-6">
      <TabNavigation
        tabs={tabItems}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      <TabContentRenderer
        activeTab={activeTab}
        producerId={producerId}
        currentProducer={currentProducer}
      />
    </div>
  );
}