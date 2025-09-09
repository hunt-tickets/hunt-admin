"use client"

import { createContext, useContext, useState } from 'react';

export type MarketingTabId = 
  | 'email-campaigns'
  | 'sms-campaigns' 
  | 'discount-codes';

interface MarketingTabContextType {
  activeTab: MarketingTabId;
  setActiveTab: (tab: MarketingTabId) => void;
}

const MarketingTabContext = createContext<MarketingTabContextType | undefined>(undefined);

export function MarketingTabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<MarketingTabId>('email-campaigns');

  return (
    <MarketingTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </MarketingTabContext.Provider>
  );
}

export function useMarketingTab() {
  const context = useContext(MarketingTabContext);
  if (context === undefined) {
    throw new Error('useMarketingTab must be used within a MarketingTabProvider');
  }
  return context;
}