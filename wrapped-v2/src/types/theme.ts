// Theme types
export type ColorScheme =
  | 'pink'
  | 'blue'
  | 'green'
  | 'purple'
  | 'cyberpunk'
  | 'red'
  | 'teal'
  | 'orange'
  | 'rose'
  | 'indigo'
  // Removed 'slate'
  | 'lime'
  | 'amber'
  | 'sky'
  | 'fuchsia'
  | 'yellow'
  | 'emerald'
  | 'violet'
  | 'cyan'
  | 'magenta'
  | 'brown'
  | 'gold'
  | 'silver'
  | 'peach'
  | 'mint'
  | 'ruby'
  | 'sapphire'
  | 'topaz'
  | 'aquamarine'
  | 'coral'
  | 'lavender'
  | 'peridot'
  | 'amethyst'
  | 'electricblue'
  | 'sunset'
  | 'custom';

export type ThemeCategory = 'primary' | 'cool' | 'warm' | 'nature' | 'vibrant';

export interface ThemeSettings {
  colorScheme: ColorScheme;
}

export interface ThemeContextType {
  theme: ThemeSettings;
  setColorScheme: (scheme: ColorScheme) => void;
  setTheme: (settings: ThemeSettings) => void;
  applyCustomTheme: (primary: string, secondary: string, accent: string) => void;
}
