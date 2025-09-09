"use client"

import { createContext, useContext, useState, ReactNode } from 'react';
import type { TabId } from '@/types/tabs';

interface ProfileTabContextValue {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

const ProfileTabContext = createContext<ProfileTabContextValue | undefined>(undefined);

export function ProfileTabProvider({ 
  children,
  defaultTab = 'team'
}: { 
  children: ReactNode;
  defaultTab?: TabId;
}) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  return (
    <ProfileTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ProfileTabContext.Provider>
  );
}

export function useProfileTab() {
  const context = useContext(ProfileTabContext);
  if (context === undefined) {
    throw new Error('useProfileTab must be used within a ProfileTabProvider');
  }
  return context;
}