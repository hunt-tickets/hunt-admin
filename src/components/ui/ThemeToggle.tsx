"use client"

import { useTheme } from '@/hooks/use-theme';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ThemeToggle = () => {
  const { theme, setTheme, actualTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('light');
    } else {
      // If system, set opposite of current actual theme
      setTheme(actualTheme === 'dark' ? 'light' : 'dark');
    }
  };

  if (!mounted) {
    return (
      <div className="p-2 rounded-lg bg-surface-elevated border border-border-primary/20 w-10 h-10 flex items-center justify-center">
        <div className="w-4 h-4 bg-text-secondary/20 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg bg-surface-elevated hover:bg-surface-tertiary border border-border-primary/20 transition-colors"
      title={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} theme`}
    >
      {actualTheme === 'light' ? (
        <Moon className="w-4 h-4 text-text-secondary" />
      ) : (
        <Sun className="w-4 h-4 text-text-secondary" />
      )}
    </button>
  );
};