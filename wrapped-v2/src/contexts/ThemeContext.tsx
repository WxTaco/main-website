import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ColorScheme, ThemeSettings, ThemeContextType } from '../types/theme';

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: {
    colorScheme: 'pink',
  },
  setColorScheme: () => {},
  setTheme: () => {},
  applyCustomTheme: () => {},
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

  // Load custom theme colors on initialization
  useEffect(() => {
    // If the saved theme is 'custom', load the custom theme colors
    if (theme.colorScheme === 'custom') {
      const savedCustomThemes = localStorage.getItem('customThemes');
      if (savedCustomThemes) {
        try {
          const customThemes = JSON.parse(savedCustomThemes);
          // Find the active custom theme (for now, just use the first one)
          const activeThemeName = localStorage.getItem('activeCustomTheme');
          if (activeThemeName && customThemes[activeThemeName]) {
            const activeTheme = customThemes[activeThemeName];
            document.documentElement.style.setProperty('--custom-primary', activeTheme.primaryColor);
            document.documentElement.style.setProperty('--custom-secondary', activeTheme.secondaryColor);
            document.documentElement.style.setProperty('--custom-accent', activeTheme.accentColor);
          } else if (Object.keys(customThemes).length > 0) {
            // If no active theme is set, use the first one
            const firstTheme = customThemes[Object.keys(customThemes)[0]];
            document.documentElement.style.setProperty('--custom-primary', firstTheme.primaryColor);
            document.documentElement.style.setProperty('--custom-secondary', firstTheme.secondaryColor);
            document.documentElement.style.setProperty('--custom-accent', firstTheme.accentColor);
            // Save this as the active theme
            localStorage.setItem('activeCustomTheme', Object.keys(customThemes)[0]);
          }
        } catch (e) {
          console.error('Failed to load custom theme colors', e);
        }
      }
    }
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('theme', JSON.stringify(theme));

    // Always apply dark mode
    document.documentElement.classList.add('dark');

    // Apply color scheme
    document.documentElement.setAttribute('data-color-scheme', theme.colorScheme);
  }, [theme]);

  const setColorScheme = useCallback((colorScheme: ColorScheme) => {
    setThemeState(prev => ({ ...prev, colorScheme }));
  }, []);

  const setTheme = useCallback((settings: ThemeSettings) => {
    setThemeState(settings);
  }, []);

  const applyCustomTheme = useCallback((primary: string, secondary: string, accent: string) => {
    document.documentElement.style.setProperty('--custom-primary', primary);
    document.documentElement.style.setProperty('--custom-secondary', secondary);
    document.documentElement.style.setProperty('--custom-accent', accent);

    // Set the color scheme to custom after setting the custom colors
    setColorScheme('custom');
  }, [setColorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, setColorScheme, setTheme, applyCustomTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);






