"use client"

import { useState, useEffect } from 'react';

type SidebarState = 'collapsed' | 'expanded' | 'hover';

export function useSidebarState() {
  const [sidebarState, setSidebarState] = useState<SidebarState>('hover');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const savedState = localStorage.getItem('hunt-sidebar-state') as SidebarState;
    if (savedState && ['collapsed', 'expanded', 'hover'].includes(savedState)) {
      setSidebarState(savedState);
    } else {
      setSidebarState('hover');
    }
  }, []);

  const updateSidebarState = (state: SidebarState) => {
    setSidebarState(state);
    if (isHydrated) {
      localStorage.setItem('hunt-sidebar-state', state);
    }
  };

  return {
    sidebarState,
    setSidebarState: updateSidebarState,
    isHydrated
  };
}