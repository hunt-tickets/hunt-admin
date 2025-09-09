"use client"

import { Card } from "@/components/ui/card";
import type { TabItem, TabId } from "@/types/tabs";

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

export function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="w-64 flex-shrink-0">
      <Card className="p-2">
        <div className="space-y-1">
          {tabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as TabId)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left
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
      </Card>
    </div>
  );
}