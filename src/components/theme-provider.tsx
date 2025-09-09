"use client"

import { useState, useEffect, useLayoutEffect } from 'react';
import { ThemeContext, type Theme, type ThemeContextType } from '@/hooks/use-theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

function getInitialTheme(): { theme: Theme; actualTheme: 'light' | 'dark' } {
  if (typeof window === 'undefined') {
    return { theme: 'system', actualTheme: 'dark' };
  }
  
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  const theme = savedTheme && ['system', 'light', 'dark'].includes(savedTheme) ? savedTheme : 'system';
  
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const actualTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : (theme === 'dark' ? 'dark' : 'light');
  
  return { theme, actualTheme };
}

function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  let actualTheme: 'light' | 'dark';
  
  if (theme === 'system') {
    actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } else {
    actualTheme = theme === 'dark' ? 'dark' : 'light';
  }
  
  if (actualTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  return actualTheme;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initialize theme state based on what's available during SSR/client render
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    const initial = getInitialTheme();
    // Apply theme immediately on client-side to prevent flickering
    applyTheme(initial.theme);
    return initial.theme;
  });
  
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return getInitialTheme().actualTheme;
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };

  // Use useLayoutEffect to synchronously apply theme changes before paint
  useLayoutEffect(() => {
    const newActualTheme = applyTheme(theme);
    if (newActualTheme) {
      setActualTheme(newActualTheme);
    }
  }, [theme]);

  // Set up system theme change listener
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const newActualTheme = applyTheme(theme);
        if (newActualTheme) {
          setActualTheme(newActualTheme);
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    actualTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}