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
  Shield,
  Globe,
  Wallet,
  ChevronRight,
  MailX,
  Receipt,
  Mail
} from "lucide-react";
import { useProfileTab } from "@/contexts/profile-tab-context";
import { ProfileSelector } from "./profile-selector";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { TabItem, TabId } from "@/types/tabs";
import type { Producer } from "@/types/producer";

const tabItems: TabItem[] = [
  { id: "team", label: "Equipo", icon: UserPlus },
  { id: "social", label: "Redes Sociales", icon: Share2 },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "politicas", label: "Políticas", icon: Shield },
  { id: "website", label: "Website", icon: Globe },
  { id: "emails-bloqueados", label: "Emails Bloqueados", icon: MailX },
  { id: "plantillas-emails", label: "Plantillas Emails", icon: Mail },
  { id: "checkout-fees", label: "Tarifas de Checkout", icon: Receipt },
  { id: "settings", label: "Configuración", icon: Settings },
];

interface ProfileSidebarProps {
  producers: Producer[];
  currentProducerId: string;
  onSelectionChange?: (producerId: string) => void;
  onProducerAdded?: (producer: Producer) => void;
}

export function ProfileSidebar({ 
  producers, 
  currentProducerId, 
  onSelectionChange, 
  onProducerAdded 
}: ProfileSidebarProps) {
  const { activeTab, setActiveTab } = useProfileTab();

  // Get current tab label
  const getCurrentTabLabel = () => {
    const currentTab = tabItems.find(item => item.id === activeTab);
    return currentTab?.label || 'Sección';
  };

  return (
    <div className="fixed left-64 top-0 w-64 h-screen bg-surface-secondary border-r border-border-primary z-30">
      <div className="p-6">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList className="text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink 
                  href="/" 
                  className="text-text-tertiary hover:text-text-secondary"
                >
                  Panel
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-text-tertiary">
                <ChevronRight className="h-3 w-3" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-text-secondary font-medium">
                  {getCurrentTabLabel()}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Profile Selector */}
        <div className="mb-6">
          <ProfileSelector 
            producers={producers}
            currentProducerId={currentProducerId}
            onSelectionChange={onSelectionChange}
            onProducerAdded={onProducerAdded}
          />
        </div>
        
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
            Organizaciones
          </h3>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-1">
          {tabItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabId)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                  isActive
                    ? 'bg-interactive-primary text-text-inverse'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}