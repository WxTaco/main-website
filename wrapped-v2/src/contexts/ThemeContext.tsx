import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Define available themes
export type ColorScheme = 'default' | 'blue' | 'green' | 'purple' | 'cyberpunk' | 'red' | 'teal' | 'orange' | 'rose' | 'indigo' | 'slate' | 'lime' | 'amber' | 'sky' | 'fuchsia';

export interface ThemeSettings {
  colorScheme: ColorScheme;
}

export type ThemeCategory = 'Featured' | 'Vibrant' | 'Cool' | 'Warm' | 'Earthy' | 'Pastel';

interface ThemeContextType {
  theme: ThemeSettings;
  setTheme: (theme: ThemeSettings) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
}

// Theme descriptions for the settings page
export const colorSchemeInfo = {
  default: {
    name: 'Default Pink',
    description: 'The classic Wrapped pink theme',
    primaryColor: '#FF69B4', // wrapped-pink
    previewClass: 'bg-wrapped-pink',
    category: 'Featured'
  },
  blue: {
    name: 'Cool Blue',
    description: 'A calming blue theme',
    primaryColor: '#3B82F6', // blue-500
    previewClass: 'bg-blue-500',
    category: 'Featured'
  },
  green: {
    name: 'Emerald',
    description: 'A refreshing green theme',
    primaryColor: '#10B981', // emerald-500
    previewClass: 'bg-emerald-500',
    category: 'Featured'
  },
  purple: {
    name: 'Royal Purple',
    description: 'A rich purple theme',
    primaryColor: '#8B5CF6', // violet-500
    previewClass: 'bg-violet-500',
    category: 'Featured'
  },
  cyberpunk: {
    name: 'Cyberpunk',
    description: 'A vibrant neon theme',
    primaryColor: '#F59E0B', // amber-500
    previewClass: 'bg-amber-500',
    category: 'Vibrant'
  },
  red: {
    name: 'Crimson',
    description: 'A bold and fiery red theme',
    primaryColor: '#EF4444', // red-500
    previewClass: 'bg-red-500',
    category: 'Vibrant'
  },
  teal: {
    name: 'Aqua',
    description: 'A refreshing teal theme with ocean vibes',
    primaryColor: '#14B8A6', // teal-500
    previewClass: 'bg-teal-500',
    category: 'Cool'
  },
  orange: {
    name: 'Sunset',
    description: 'A warm and energetic orange theme',
    primaryColor: '#F97316', // orange-500
    previewClass: 'bg-orange-500',
    category: 'Warm'
  },
  rose: {
    name: 'Rose',
    description: 'A vibrant and passionate rose theme',
    primaryColor: '#E11D48', // rose-600
    previewClass: 'bg-rose-600',
    category: 'Warm'
  },
  indigo: {
    name: 'Twilight',
    description: 'A deep and mystical indigo theme',
    primaryColor: '#6366F1', // indigo-500
    previewClass: 'bg-indigo-500',
    category: 'Cool'
  },
  slate: {
    name: 'Slate',
    description: 'A sophisticated and elegant dark theme',
    primaryColor: '#64748B', // slate-500
    previewClass: 'bg-slate-500',
    category: 'Cool'
  },
  lime: {
    name: 'Lime',
    description: 'A fresh and zesty lime green theme',
    primaryColor: '#84CC16', // lime-500
    previewClass: 'bg-lime-500',
    category: 'Earthy'
  },
  amber: {
    name: 'Amber',
    description: 'A warm and golden amber theme',
    primaryColor: '#F59E0B', // amber-500
    previewClass: 'bg-amber-500',
    category: 'Earthy'
  },
  sky: {
    name: 'Sky',
    description: 'A bright and airy sky blue theme',
    primaryColor: '#0EA5E9', // sky-500
    previewClass: 'bg-sky-500',
    category: 'Pastel'
  },
  fuchsia: {
    name: 'Fuchsia',
    description: 'A vibrant and playful fuchsia theme',
    primaryColor: '#D946EF', // fuchsia-500
    previewClass: 'bg-fuchsia-500',
    category: 'Pastel'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to get a cookie value
const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

// Helper function to set a cookie
const setCookie = (name: string, value: string, days: number = 365): void => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize theme from cookies or default values
  const [theme, setThemeState] = useState<ThemeSettings>(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      const savedColorScheme = getCookie('colorScheme') as ColorScheme;
      return {
        colorScheme: savedColorScheme || 'default'
      };
    }
    return { colorScheme: 'default' };
  });

  // Update document with the current theme
  useEffect(() => {
    // Apply color scheme
    document.documentElement.setAttribute('data-color-scheme', theme.colorScheme);

    // Save preferences to cookies
    setCookie('colorScheme', theme.colorScheme);
  }, [theme]);

  // Set the complete theme
  const setTheme = (newTheme: ThemeSettings) => {
    setThemeState(newTheme);
  };

  // Set just the color scheme
  const setColorScheme = (colorScheme: ColorScheme) => {
    setThemeState({ colorScheme });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
