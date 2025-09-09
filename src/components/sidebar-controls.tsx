"use client"

import { useState } from "react";
import { Menu } from "lucide-react";

type SidebarState = 'collapsed' | 'expanded' | 'hover';

interface SidebarControlsProps {
  sidebarState: SidebarState;
  setSidebarState: (state: SidebarState) => void;
  isHydrated: boolean;
}

export function SidebarControls({ sidebarState, setSidebarState, isHydrated }: SidebarControlsProps) {
  const [showMenu, setShowMenu] = useState(false);

  if (!isHydrated) {
    return (
      <div className="p-3 border-t border-border-primary">
        <div className="flex justify-center">
          <div className="w-6 h-6 bg-interactive-secondary rounded flex items-center justify-center">
            <Menu className="h-3 w-3 text-white/40" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 border-t border-border-primary relative">
      <div className="flex justify-center">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-6 h-6 bg-interactive-secondary hover:bg-white/20 rounded flex items-center justify-center transition-colors"
        >
          <Menu className="h-3 w-3 text-text-primary" />
        </button>
      </div>

      {/* Popup Menu */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20 bg-surface-primary border border-border-secondary rounded-xl p-3 shadow-xl min-w-48 animate-in slide-in-from-bottom-2 fade-in duration-200">
            <div className="text-xs text-muted-foreground mb-3 text-center">Sidebar control</div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSidebarState('expanded');
                  setShowMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  sidebarState === 'expanded' 
                    ? 'bg-white/20 text-text-primary' 
                    : 'text-muted-foreground hover:text-text-primary hover:bg-interactive-secondary'
                }`}
              >
                Expanded
              </button>
              <button
                onClick={() => {
                  setSidebarState('collapsed');
                  setShowMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  sidebarState === 'collapsed' 
                    ? 'bg-white/20 text-text-primary' 
                    : 'text-muted-foreground hover:text-text-primary hover:bg-interactive-secondary'
                }`}
              >
                Collapsed
              </button>
              <button
                onClick={() => {
                  setSidebarState('hover');
                  setShowMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  sidebarState === 'hover' 
                    ? 'bg-white/20 text-text-primary' 
                    : 'text-muted-foreground hover:text-text-primary hover:bg-interactive-secondary'
                }`}
              >
                <div className="w-2 h-2 bg-current rounded-full opacity-60" />
                Expand on hover
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}