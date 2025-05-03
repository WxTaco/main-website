// Theme types
export type ColorScheme = 'pink' | 'blue' | 'green' | 'purple' | 'cyberpunk' | 'red' | 'teal' | 'orange' | 'rose' | 'indigo' | 'slate' | 'lime' | 'amber' | 'sky' | 'fuchsia';

export type ThemeCategory = 'primary' | 'cool' | 'warm' | 'nature' | 'vibrant';

export interface ThemeSettings {
  colorScheme: ColorScheme;
}

export interface ThemeContextType {
  theme: ThemeSettings;
  setColorScheme: (scheme: ColorScheme) => void;
  setTheme: (settings: ThemeSettings) => void;
}
