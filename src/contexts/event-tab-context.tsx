"use client"

import React, { createContext, useContext, useState } from 'react';
import type { EventTabId } from '@/types/event-tabs';

interface EventTabContextType {
  activeTab: EventTabId;
  setActiveTab: (tab: EventTabId) => void;
}

const EventTabContext = createContext<EventTabContextType | undefined>(undefined);

export function EventTabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<EventTabId>('general');

  return (
    <EventTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </EventTabContext.Provider>
  );
}

export function useEventTab() {
  const context = useContext(EventTabContext);
  if (context === undefined) {
    throw new Error('useEventTab must be used within an EventTabProvider');
  }
  return context;
}