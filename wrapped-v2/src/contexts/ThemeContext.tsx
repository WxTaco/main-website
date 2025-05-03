import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Theme types
export type ColorScheme = 'pink' | 'blue' | 'green' | 'purple' | 'cyberpunk' | 'red' | 'teal' | 'orange' | 'rose' | 'indigo' | 'slate' | 'lime' | 'amber' | 'sky' | 'fuchsia';

export type ThemeCategory = 'primary' | 'cool' | 'warm' | 'nature' | 'vibrant';

export interface ThemeSettings {
  colorScheme: ColorScheme;
  darkMode: boolean;
}

export interface ThemeContextType {
  theme: ThemeSettings;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleDarkMode: () => void;
  setTheme: (settings: ThemeSettings) => void;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: {
    colorScheme: 'pink',
    darkMode: false,
  },
  setColorScheme: () => {},
  toggleDarkMode: () => {},
  setTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeSettings>(() => {
    // Load theme from localStorage if available
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      try {
        return JSON.parse(savedTheme);
      } catch (e) {
        console.error('Failed to parse saved theme', e);
      }
    }
    
    // Default theme
    return {
      colorScheme: 'pink',
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    };
  });

  // Apply theme changes to document
  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('theme', JSON.stringify(theme));
    
    // Apply dark mode
    if (theme.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply color scheme
    document.documentElement.setAttribute('data-color-scheme', theme.colorScheme);
  }, [theme]);

  const setColorScheme = (colorScheme: ColorScheme) => {
    setThemeState(prev => ({ ...prev, colorScheme }));
  };

  const toggleDarkMode = () => {
    setThemeState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const setTheme = (settings: ThemeSettings) => {
    setThemeState(settings);
  };

  return (
    <ThemeContext.Provider value={{ theme, setColorScheme, toggleDarkMode, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

