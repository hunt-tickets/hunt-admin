"use client"

import { 
  Mail, 
  MessageSquare, 
  Tag,
  ChevronRight
} from "lucide-react";
import { useMarketingTab } from "@/contexts/marketing-tab-context";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { MarketingTabItem, MarketingTabId } from "@/types/marketing-tabs";

const marketingTabItems: MarketingTabItem[] = [
  { id: "email-campaigns", label: "Email Campaigns", icon: Mail },
  { id: "sms-campaigns", label: "SMS/WhatsApp Campaigns", icon: MessageSquare },
  { id: "discount-codes", label: "Discount Codes", icon: Tag },
];

export function MarketingSidebar() {
  const { activeTab, setActiveTab } = useMarketingTab();

  // Get current tab label
  const getCurrentTabLabel = () => {
    const currentTab = marketingTabItems.find(item => item.id === activeTab);
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
        
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
            Marketing
          </h3>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-1">
          {marketingTabItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as MarketingTabId)}
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