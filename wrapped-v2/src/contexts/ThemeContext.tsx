import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ColorScheme, ThemeSettings, ThemeContextType } from '../types/theme';

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: {
    colorScheme: 'pink',
  },
  setColorScheme: () => {},
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
        const parsedTheme = JSON.parse(savedTheme);
        return { colorScheme: parsedTheme.colorScheme };
      } catch (e) {
        console.error('Failed to parse saved theme', e);
      }
    }
    
    // Default theme
    return {
      colorScheme: 'pink',
    };
  });

  // Apply theme changes to document
  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('theme', JSON.stringify(theme));
    
    // Always apply dark mode
    document.documentElement.classList.add('dark');
    
    // Apply color scheme
    document.documentElement.setAttribute('data-color-scheme', theme.colorScheme);
  }, [theme]);

  const setColorScheme = (colorScheme: ColorScheme) => {
    setThemeState(prev => ({ ...prev, colorScheme }));
  };

  const setTheme = (settings: ThemeSettings) => {
    setThemeState(settings);
  };

  return (
    <ThemeContext.Provider value={{ theme, setColorScheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);






