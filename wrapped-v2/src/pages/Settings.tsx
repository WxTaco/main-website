import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeCategory, ColorScheme } from '../types/theme';
import ColorPickerPopup from '../components/ColorPickerPopup';

interface CustomThemeVersion {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  version: number;
  timestamp: number;
}

interface CustomTheme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  category?: ThemeCategory;
  isFavorite?: boolean;
  history?: CustomThemeVersion[];
}

type SettingsTab = 'themes' | 'accessibility' | 'account' | 'preview';

const Settings: React.FC = () => {
  const { theme, setColorScheme, applyCustomTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>('themes');
  const [activeCategory, setActiveCategory] = useState<ThemeCategory>('primary');

  // Custom theme state
  const [customThemes, setCustomThemes] = useState<Record<string, CustomTheme>>({});
  const [activeCustomTheme, setActiveCustomTheme] = useState<string>('');
  const [showNewThemeForm, setShowNewThemeForm] = useState(false);
  const [showThemeHistoryModal, setShowThemeHistoryModal] = useState(false);
  const [selectedThemeForHistory, setSelectedThemeForHistory] = useState<string>('');
  const [newThemeName, setNewThemeName] = useState('');
  const [newThemeCategory, setNewThemeCategory] = useState<ThemeCategory>('primary');
  const [newPrimaryColor, setNewPrimaryColor] = useState('#FF69B4');
  const [newSecondaryColor, setNewSecondaryColor] = useState('#f472b6');
  const [newAccentColor, setNewAccentColor] = useState('#FFD700');

  // Filtering and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'name' | 'newest' | 'favorites'>('name');

  // Accessibility
  const [highContrastMode, setHighContrastMode] = useState(() => {
    const saved = localStorage.getItem('highContrastMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [colorBlindnessSimulation, setColorBlindnessSimulation] = useState(() => {
    const saved = localStorage.getItem('colorBlindnessSimulation');
    return saved || 'none';
  });
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize');
    return saved || 'medium';
  });
  const [reduceMotion, setReduceMotion] = useState(() => {
    const saved = localStorage.getItem('reduceMotion');
    return saved ? JSON.parse(saved) : false;
  });
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  // Load custom themes from localStorage
  useEffect(() => {
    const savedCustomThemes = localStorage.getItem('customThemes');
    if (savedCustomThemes) {
      try {
        const parsedThemes = JSON.parse(savedCustomThemes);
        setCustomThemes(parsedThemes);
      } catch (e) {
        console.error('Failed to parse saved custom themes', e);
      }
    }

    const savedActiveTheme = localStorage.getItem('activeCustomTheme');
    if (savedActiveTheme) {
      setActiveCustomTheme(savedActiveTheme);
    }
  }, []);

  // Save custom themes to localStorage when they change
  useEffect(() => {
    if (Object.keys(customThemes).length > 0) {
      localStorage.setItem('customThemes', JSON.stringify(customThemes));
    }
  }, [customThemes]);

  // Save active custom theme to localStorage when it changes
  useEffect(() => {
    if (activeCustomTheme) {
      localStorage.setItem('activeCustomTheme', activeCustomTheme);
    }
  }, [activeCustomTheme]);

  // Save and apply accessibility settings
  useEffect(() => {
    localStorage.setItem('highContrastMode', JSON.stringify(highContrastMode));

    // Apply high contrast mode
    if (highContrastMode) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrastMode]);

  useEffect(() => {
    localStorage.setItem('colorBlindnessSimulation', colorBlindnessSimulation);

    // Remove any existing color blindness filters
    document.documentElement.classList.remove('protanopia', 'deuteranopia', 'tritanopia');

    // Apply the selected color blindness simulation
    if (colorBlindnessSimulation !== 'none') {
      document.documentElement.classList.add(colorBlindnessSimulation);
    }
  }, [colorBlindnessSimulation]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);

    // Remove any existing font size classes
    document.documentElement.classList.remove('text-size-small', 'text-size-medium', 'text-size-large', 'text-size-xl');

    // Apply the selected font size
    document.documentElement.classList.add(`text-size-${fontSize}`);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('reduceMotion', JSON.stringify(reduceMotion));

    // Apply reduced motion setting
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reduceMotion]);

  useEffect(() => {
    localStorage.setItem('language', language);

    // Set the lang attribute on the html element
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  // Apply the active custom theme
  const applyCustomThemeByName = (themeName: string) => {
    const selectedTheme = customThemes[themeName];
    if (selectedTheme) {
      // Create a new history entry if it doesn't exist
      if (!selectedTheme.history) {
        selectedTheme.history = [];
      }

      // Add current state to history if it's different from the last entry
      const lastHistoryEntry = selectedTheme.history[0];
      if (!lastHistoryEntry ||
          lastHistoryEntry.primaryColor !== selectedTheme.primaryColor ||
          lastHistoryEntry.secondaryColor !== selectedTheme.secondaryColor ||
          lastHistoryEntry.accentColor !== selectedTheme.accentColor) {

        const newHistoryEntry: CustomThemeVersion = {
          primaryColor: selectedTheme.primaryColor,
          secondaryColor: selectedTheme.secondaryColor,
          accentColor: selectedTheme.accentColor,
          version: (lastHistoryEntry?.version || 0) + 1,
          timestamp: Date.now()
        };

        // Update the theme with the new history entry
        setCustomThemes(prev => ({
          ...prev,
          [themeName]: {
            ...prev[themeName],
            history: [newHistoryEntry, ...(prev[themeName].history || [])]
          }
        }));
      }

      applyCustomTheme(
        selectedTheme.primaryColor,
        selectedTheme.secondaryColor,
        selectedTheme.accentColor
      );
      setActiveCustomTheme(themeName);
    }
  };

  // Create a new custom theme
  const createNewTheme = () => {
    if (!newThemeName.trim()) {
      alert('Please enter a theme name');
      return;
    }

    if (customThemes[newThemeName]) {
      alert('A theme with this name already exists');
      return;
    }

    // Create a version history entry
    const historyEntry: CustomThemeVersion = {
      primaryColor: newPrimaryColor,
      secondaryColor: newSecondaryColor,
      accentColor: newAccentColor,
      version: 1,
      timestamp: Date.now()
    };

    const newTheme: CustomTheme = {
      name: newThemeName,
      primaryColor: newPrimaryColor,
      secondaryColor: newSecondaryColor,
      accentColor: newAccentColor,
      category: newThemeCategory,
      isFavorite: false,
      history: [historyEntry]
    };

    setCustomThemes(prev => ({
      ...prev,
      [newThemeName]: newTheme
    }));

    // Apply the new theme
    applyCustomTheme(newPrimaryColor, newSecondaryColor, newAccentColor);
    setActiveCustomTheme(newThemeName);

    // Reset form
    setNewThemeName('');
    setShowNewThemeForm(false);
  };

  // Delete a custom theme
  const deleteCustomTheme = (themeName: string) => {
    if (window.confirm(`Are you sure you want to delete the theme "${themeName}"?`)) {
      const updatedThemes = { ...customThemes };
      delete updatedThemes[themeName];
      setCustomThemes(updatedThemes);

      // If the deleted theme was active, switch to the default theme
      if (activeCustomTheme === themeName) {
        setColorScheme('pink');
        setActiveCustomTheme('');
        localStorage.removeItem('activeCustomTheme');
      }
    }
  };

  // Export custom themes
  const exportCustomThemes = () => {
    const dataStr = JSON.stringify(customThemes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = 'wrapped-custom-themes.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import custom themes
  const importCustomThemes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedThemes = JSON.parse(content);

        // Validate the imported data
        let isValid = true;
        Object.values(importedThemes).forEach((theme: any) => {
          if (!theme.name || !theme.primaryColor || !theme.secondaryColor || !theme.accentColor) {
            isValid = false;
          }
        });

        if (!isValid) {
          alert('The imported file contains invalid theme data');
          return;
        }

        // Merge with existing themes
        setCustomThemes(prev => ({
          ...prev,
          ...importedThemes
        }));

        alert('Themes imported successfully!');
      } catch (error) {
        alert('Failed to import themes. Please check the file format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };

  // Generate random colors for the custom theme
  const generateRandomColors = () => {
    // Helper function to generate a random hex color
    const randomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    setNewPrimaryColor(randomColor());
    setNewSecondaryColor(randomColor());
    setNewAccentColor(randomColor());
  };

  // Toggle favorite status for a theme
  const toggleFavorite = (themeName: string) => {
    if (themeName in customThemes) {
      // Toggle favorite for custom theme
      setCustomThemes(prev => ({
        ...prev,
        [themeName]: {
          ...prev[themeName],
          isFavorite: !prev[themeName].isFavorite
        }
      }));
    } else {
      // For built-in themes, we need to create a custom theme based on it
      const themeInfo = colorSchemeInfo[themeName as ColorScheme];
      if (!themeInfo) return;

      const newFavorite: CustomTheme = {
        name: `${themeInfo.name} (Favorite)`,
        primaryColor: themeInfo.primaryColor,
        secondaryColor: themeInfo.primaryColor, // Use primary as secondary for built-in themes
        accentColor: themeInfo.primaryColor,    // Use primary as accent for built-in themes
        category: themeInfo.category,
        isFavorite: true
      };

      setCustomThemes(prev => ({
        ...prev,
        [`${themeName}_favorite`]: newFavorite
      }));
    }
  };

  // Check if a theme is favorited
  const isFavorite = (themeName: string): boolean => {
    // Check if there's a custom theme with this name that's marked as favorite
    if (themeName in customThemes && customThemes[themeName].isFavorite) {
      return true;
    }

    // Check if there's a favorited version of this theme
    if (`${themeName}_favorite` in customThemes) {
      return true;
    }

    return false;
  };

  // Suggest complementary colors based on primary color
  const suggestComplementaryColors = (baseColor: string) => {
    // Convert hex to HSL
    const hexToHSL = (hex: string): [number, number, number] => {
      // Remove the # if present
      hex = hex.replace(/^#/, '');

      // Parse the hex values
      let r = parseInt(hex.substring(0, 2), 16) / 255;
      let g = parseInt(hex.substring(2, 4), 16) / 255;
      let b = parseInt(hex.substring(4, 6), 16) / 255;

      // Find the min and max values to calculate the lightness
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
      }

      return [h * 360, s * 100, l * 100];
    };

    // Convert HSL to hex
    const hslToHex = (h: number, s: number, l: number): string => {
      h /= 360;
      s /= 100;
      l /= 100;

      let r, g, b;

      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }

      const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };

      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    // Get the HSL values of the base color
    const [h, s, l] = hexToHSL(baseColor);

    // Generate complementary color (opposite on the color wheel)
    const complementaryH = (h + 180) % 360;
    const complementaryColor = hslToHex(complementaryH, s, l);

    // Generate analogous color (30 degrees away on the color wheel)
    const analogousH = (h + 30) % 360;
    const analogousColor = hslToHex(analogousH, s, l);

    // Set the colors
    setNewSecondaryColor(complementaryColor);
    setNewAccentColor(analogousColor);
  };

  // Share a theme
  const shareTheme = (name: string, theme: CustomTheme) => {
    // Generate a shorter shareable code by only including essential properties
    const minimalTheme = {
      name: theme.name,
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      accentColor: theme.accentColor,
      category: theme.category
    };

    const themeData = JSON.stringify({ [name]: minimalTheme });
    const encodedData = btoa(themeData);

    // Copy to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/settings?t=${encodedData}`);
    alert('Theme share link copied to clipboard!');
  };

  // Show theme history
  const showThemeHistory = (themeName: string) => {
    setSelectedThemeForHistory(themeName);
    setShowThemeHistoryModal(true);
  };

  // Revert to a previous version of a theme
  const revertToVersion = (themeName: string, version: number) => {
    const theme = customThemes[themeName];
    if (!theme || !theme.history) return;

    const versionToRevert = theme.history.find(v => v.version === version);
    if (!versionToRevert) return;

    // Create a new history entry with the current state
    const newHistoryEntry: CustomThemeVersion = {
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      accentColor: theme.accentColor,
      version: (theme.history[0]?.version || 0) + 1,
      timestamp: Date.now()
    };

    // Update the theme with the reverted version
    setCustomThemes(prev => ({
      ...prev,
      [themeName]: {
        ...prev[themeName],
        primaryColor: versionToRevert.primaryColor,
        secondaryColor: versionToRevert.secondaryColor,
        accentColor: versionToRevert.accentColor,
        history: [newHistoryEntry, ...(prev[themeName].history || [])]
      }
    }));

    // If this is the active theme, apply the changes
    if (activeCustomTheme === themeName) {
      applyCustomTheme(
        versionToRevert.primaryColor,
        versionToRevert.secondaryColor,
        versionToRevert.accentColor
      );
    }
  };

  // Theme information
  const colorSchemeInfo: Partial<Record<ColorScheme, {
    name: string;
    description: string;
    primaryColor: string;
    previewClass: string;
    category: ThemeCategory;
  }>> = {
    pink: {
      name: 'Pink',
      description: 'Vibrant and playful',
      primaryColor: '#FF69B4',
      previewClass: 'bg-wrapped-pink',
      category: 'primary'
    },
    blue: {
      name: 'Blue',
      description: 'Calm and trustworthy',
      primaryColor: '#3B82F6',
      previewClass: 'bg-blue-500',
      category: 'cool'
    },
    green: {
      name: 'Green',
      description: 'Fresh and natural',
      primaryColor: '#10B981',
      previewClass: 'bg-green-500',
      category: 'nature'
    },
    purple: {
      name: 'Purple',
      description: 'Creative and mysterious',
      primaryColor: '#8B5CF6',
      previewClass: 'bg-purple-500',
      category: 'cool'
    },
    cyberpunk: {
      name: 'Cyberpunk',
      description: 'Futuristic and bold',
      primaryColor: '#F59E0B',
      previewClass: 'bg-yellow-500',
      category: 'vibrant'
    },
    red: {
      name: 'Red',
      description: 'Energetic and passionate',
      primaryColor: '#EF4444',
      previewClass: 'bg-red-500',
      category: 'warm'
    },
    teal: {
      name: 'Teal',
      description: 'Balanced and refreshing',
      primaryColor: '#14B8A6',
      previewClass: 'bg-teal-500',
      category: 'cool'
    },
    orange: {
      name: 'Orange',
      description: 'Warm and enthusiastic',
      primaryColor: '#F97316',
      previewClass: 'bg-orange-500',
      category: 'warm'
    },
    rose: {
      name: 'Rose',
      description: 'Elegant and romantic',
      primaryColor: '#E11D48',
      previewClass: 'bg-rose-500',
      category: 'warm'
    },
    indigo: {
      name: 'Indigo',
      description: 'Deep and sophisticated',
      primaryColor: '#6366F1',
      previewClass: 'bg-indigo-500',
      category: 'cool'
    },
    lime: {
      name: 'Lime',
      description: 'Energetic and fresh',
      primaryColor: '#84CC16',
      previewClass: 'bg-lime-500',
      category: 'nature'
    },
    amber: {
      name: 'Amber',
      description: 'Warm and inviting',
      primaryColor: '#F59E0B',
      previewClass: 'bg-amber-500',
      category: 'warm'
    },
    sky: {
      name: 'Sky',
      description: 'Open and peaceful',
      primaryColor: '#0EA5E9',
      previewClass: 'bg-sky-500',
      category: 'cool'
    },
    fuchsia: {
      name: 'Fuchsia',
      description: 'Vibrant and playful',
      primaryColor: '#D946EF',
      previewClass: 'bg-fuchsia-500',
      category: 'vibrant'
    },
    yellow: {
      name: 'Yellow',
      description: 'Bright and cheerful',
      primaryColor: '#FDE047',
      previewClass: 'bg-yellow-500',
      category: 'vibrant'
    },
    emerald: {
      name: 'Emerald',
      description: 'Rich and luxurious',
      primaryColor: '#50C878',
      previewClass: 'bg-emerald-500',
      category: 'nature'
    },
    violet: {
      name: 'Violet',
      description: 'Imaginative and spiritual',
      primaryColor: '#8B5CF6',
      previewClass: 'bg-violet-500',
      category: 'cool'
    },
    cyan: {
      name: 'Cyan',
      description: 'Clear and refreshing',
      primaryColor: '#06B6D4',
      previewClass: 'bg-cyan-500',
      category: 'cool'
    },
    magenta: {
      name: 'Magenta',
      description: 'Bold and vibrant',
      primaryColor: '#DB2777',
      previewClass: 'bg-magenta-500',
      category: 'vibrant'
    },
    brown: {
      name: 'Brown',
      description: 'Earthy and grounded',
      primaryColor: '#A78B71',
      previewClass: 'bg-brown-500',
      category: 'nature'
    },
    gold: {
      name: 'Gold',
      description: 'Luxurious and radiant',
      primaryColor: '#FFD700',
      previewClass: 'bg-gold-500',
      category: 'vibrant'
    },
    silver: {
      name: 'Silver',
      description: 'Sleek and modern',
      primaryColor: '#C0C0C0',
      previewClass: 'bg-silver-500',
      category: 'cool'
    },
    peach: {
      name: 'Peach',
      description: 'Soft and warm',
      primaryColor: '#FFDAB9',
      previewClass: 'bg-peach-500',
      category: 'warm'
    },
    mint: {
      name: 'Mint',
      description: 'Fresh and clean',
      primaryColor: '#98FF98',
      previewClass: 'bg-mint-500',
      category: 'nature'
    },
    ruby: {
      name: 'Ruby',
      description: 'Passionate and bold',
      primaryColor: '#E0115F',
      previewClass: 'bg-ruby-500',
      category: 'vibrant'
    },
    sapphire: {
      name: 'Sapphire',
      description: 'Deep and calming',
      primaryColor: '#0F52BA',
      previewClass: 'bg-sapphire-500',
      category: 'cool'
    },
    topaz: {
      name: 'Topaz',
      description: 'Warm and radiant',
      primaryColor: '#FFC87C',
      previewClass: 'bg-topaz-500',
      category: 'warm'
    },
    aquamarine: {
      name: 'Aquamarine',
      description: 'Serene and refreshing',
      primaryColor: '#7FFFD4',
      previewClass: 'bg-aquamarine-500',
      category: 'cool'
    },
    coral: {
      name: 'Coral',
      description: 'Vibrant and energetic',
      primaryColor: '#FF7F50',
      previewClass: 'bg-coral-500',
      category: 'warm'
    },
    lavender: {
      name: 'Lavender',
      description: 'Gentle and calming',
      primaryColor: '#E6E6FA',
      previewClass: 'bg-lavender-500',
      category: 'cool'
    },
    peridot: {
      name: 'Peridot',
      description: 'Fresh and lively',
      primaryColor: '#AAFF00',
      previewClass: 'bg-peridot-500',
      category: 'nature'
    },
    amethyst: {
      name: 'Amethyst',
      description: 'Mystical and elegant',
      primaryColor: '#9966CC',
      previewClass: 'bg-amethyst-500',
      category: 'cool'
    },
    custom: {
      name: 'Custom',
      description: 'Your personalized theme',
      primaryColor: '#FF69B4', // Default value, will be overridden
      previewClass: 'bg-custom',
      category: 'primary'
    }
  };

  // Group themes by category
  const themesByCategory: Record<ThemeCategory, ColorScheme[]> = {
    primary: ['pink', 'custom'],
    cool: ['blue', 'purple', 'teal', 'indigo', 'sky', 'silver', 'sapphire', 'aquamarine', 'lavender', 'cyan', 'violet'],
    warm: ['red', 'orange', 'rose', 'amber', 'peach', 'topaz', 'coral'],
    nature: ['green', 'lime', 'brown', 'mint', 'emerald', 'peridot'],
    vibrant: ['cyberpunk', 'fuchsia', 'gold', 'ruby', 'magenta', 'yellow', 'amethyst']
  };

  // Category labels
  const categoryLabels: Record<ThemeCategory, string> = {
    primary: 'Primary',
    cool: 'Cool Tones',
    warm: 'Warm Tones',
    nature: 'Nature',
    vibrant: 'Vibrant'
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <Helmet>
        <title>Settings | Wrapped Bot</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-4 text-theme-primary">Settings</h1>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 bg-gray-800/50 p-3 rounded-lg">
        <button
          className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'themes'
              ? 'bg-theme-primary text-white shadow-md'
              : 'bg-gray-700/70 text-gray-300 hover:bg-gray-600 hover:text-white'
          }`}
          onClick={() => setActiveTab('themes')}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Themes
          </div>
        </button>
        <button
          className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'accessibility'
              ? 'bg-theme-primary text-white shadow-md'
              : 'bg-gray-700/70 text-gray-300 hover:bg-gray-600 hover:text-white'
          }`}
          onClick={() => setActiveTab('accessibility')}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Accessibility
          </div>
        </button>
        <button
          className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'account'
              ? 'bg-theme-primary text-white shadow-md'
              : 'bg-gray-700/70 text-gray-300 hover:bg-gray-600 hover:text-white'
          }`}
          onClick={() => setActiveTab('account')}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Account
          </div>
        </button>
        <button
          className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'preview'
              ? 'bg-theme-primary text-white shadow-md'
              : 'bg-gray-700/70 text-gray-300 hover:bg-gray-600 hover:text-white'
          }`}
          onClick={() => setActiveTab('preview')}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Preview
          </div>
        </button>
      </div>

      {/* Theme History Modal */}
      {showThemeHistoryModal && selectedThemeForHistory && customThemes[selectedThemeForHistory]?.history && (
        <div className="popup">
          <div className="popup-content">
            <h3 className="text-xl font-bold mb-4 text-theme-primary flex items-center justify-between">
              <span>Theme History: {customThemes[selectedThemeForHistory].name}</span>
              <button
                className="text-gray-400 hover:text-gray-200"
                onClick={() => setShowThemeHistoryModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </h3>

            <div className="max-h-96 overflow-y-auto">
              {customThemes[selectedThemeForHistory].history?.map((version) => (
                <div
                  key={version.version}
                  className="p-3 mb-3 rounded-md bg-gray-800 border border-gray-700"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-white font-medium">Version {version.version}</span>
                      <span className="text-gray-400 text-sm ml-3">
                        {new Date(version.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <button
                      className="px-2 py-1 text-xs bg-theme-primary text-white rounded hover:bg-opacity-90"
                      onClick={() => {
                        revertToVersion(selectedThemeForHistory, version.version);
                        setShowThemeHistoryModal(false);
                      }}
                    >
                      Restore
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center">
                      <div className="w-full h-6 rounded-md" style={{ backgroundColor: version.primaryColor }}></div>
                      <span className="text-xs text-gray-400 mt-1">Primary</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full h-6 rounded-md" style={{ backgroundColor: version.secondaryColor }}></div>
                      <span className="text-xs text-gray-400 mt-1">Secondary</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full h-6 rounded-md" style={{ backgroundColor: version.accentColor }}></div>
                      <span className="text-xs text-gray-400 mt-1">Accent</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Theme Form Popup */}
      {showNewThemeForm && (
        <div className="popup">
          <div className="popup-content">
            <h3 className="text-xl font-bold mb-4 text-theme-primary">Create Custom Theme</h3>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-300">Theme Name</label>
                <button
                  type="button"
                  className="text-sm text-theme-primary hover:text-theme-secondary flex items-center"
                  onClick={generateRandomColors}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Random Colors
                </button>
              </div>
              <input
                type="text"
                value={newThemeName}
                onChange={(e) => setNewThemeName(e.target.value)}
                placeholder="My Custom Theme"
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-theme-primary"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={newThemeCategory}
                onChange={(e) => setNewThemeCategory(e.target.value as ThemeCategory)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-theme-primary"
              >
                {Object.keys(categoryLabels).map((category) => (
                  <option key={category} value={category}>
                    {categoryLabels[category as ThemeCategory]}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-300">Primary Color</label>
                <button
                  type="button"
                  className="text-xs text-theme-primary hover:text-theme-secondary flex items-center"
                  onClick={() => suggestComplementaryColors(newPrimaryColor)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Suggest Palette
                </button>
              </div>
              <div className="flex items-center">
                <div className="w-full max-w-xs">
                  <ColorPickerPopup
                    color={newPrimaryColor}
                    onChange={setNewPrimaryColor}
                    label="Primary"
                  />
                </div>
                <div className="ml-4 w-16 h-8 rounded-md shadow-inner" style={{ backgroundColor: newPrimaryColor }}></div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Color</label>
              <div className="flex items-center">
                <div className="w-full max-w-xs">
                  <ColorPickerPopup
                    color={newSecondaryColor}
                    onChange={setNewSecondaryColor}
                    label="Secondary"
                  />
                </div>
                <div className="ml-4 w-16 h-8 rounded-md shadow-inner" style={{ backgroundColor: newSecondaryColor }}></div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Accent Color</label>
              <div className="flex items-center">
                <div className="w-full max-w-xs">
                  <ColorPickerPopup
                    color={newAccentColor}
                    onChange={setNewAccentColor}
                    label="Accent"
                  />
                </div>
                <div className="ml-4 w-16 h-8 rounded-md shadow-inner" style={{ backgroundColor: newAccentColor }}></div>
              </div>
            </div>

            {/* Theme Preview */}
            <div className="mb-6 p-4 rounded-lg bg-gray-800/70">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Preview</h4>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-24 h-8 rounded-md flex items-center justify-center text-white text-sm" style={{ backgroundColor: newPrimaryColor }}>
                    Primary
                  </div>
                  <div className="w-24 h-8 rounded-md flex items-center justify-center text-white text-sm" style={{ backgroundColor: newSecondaryColor }}>
                    Secondary
                  </div>
                  <div className="w-24 h-8 rounded-md flex items-center justify-center text-white text-sm" style={{ backgroundColor: newAccentColor }}>
                    Accent
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    className="px-3 py-1.5 rounded-md text-white text-sm"
                    style={{ backgroundColor: newPrimaryColor }}
                  >
                    Button
                  </button>
                  <div className="px-3 py-1.5 rounded-md text-sm border-2" style={{ borderColor: newSecondaryColor, color: newSecondaryColor }}>
                    Border
                  </div>
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: newAccentColor }}></div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                onClick={() => setShowNewThemeForm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white rounded-md hover:bg-opacity-90 transition-colors"
                style={{ backgroundColor: newPrimaryColor }}
                onClick={createNewTheme}
              >
                Create Theme
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Theme Settings */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900/80 backdrop-blur-md rounded-lg shadow-lg p-6 mb-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-theme-primary flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Theme Settings
            </h2>

            {/* Theme Categories */}
            <div className="flex flex-wrap gap-3 mb-4 bg-gray-800/50 p-3 rounded-lg">
              {(Object.keys(categoryLabels) as ThemeCategory[]).map((category) => (
                <button
                  key={category}
                  className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeCategory === category
                      ? 'bg-theme-primary text-white shadow-md'
                      : 'bg-gray-700/70 text-gray-300 hover:bg-gray-600 hover:text-white'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>

            {/* Search and Filter */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Search themes..."
                  className="w-full px-3 py-2 pl-10 bg-gray-800/70 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-theme-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <select
                className="px-3 py-2 bg-gray-800/70 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-theme-primary"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'name' | 'newest' | 'favorites')}
              >
                <option value="name">Sort by Name</option>
                <option value="newest">Sort by Newest</option>
                <option value="favorites">Sort by Favorites</option>
              </select>
            </div>

            {/* Theme Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* No results message */}
              {searchQuery &&
                themesByCategory[activeCategory]
                  .filter(scheme => {
                    if (scheme === 'custom') return false;
                    const themeInfo = colorSchemeInfo[scheme];
                    if (!themeInfo) return false;

                    const query = searchQuery.toLowerCase();
                    return (
                      themeInfo.name.toLowerCase().includes(query) ||
                      themeInfo.description.toLowerCase().includes(query) ||
                      themeInfo.category.toLowerCase().includes(query)
                    );
                  }).length === 0 && (
                <div className="col-span-2 p-8 text-center bg-gray-800/50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-gray-400 text-lg">No themes found matching "{searchQuery}"</p>
                  <button
                    className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </button>
                </div>
              )}

              {activeCategory === 'primary' && theme.colorScheme === 'custom' && activeCustomTheme && (
                <div
                  className="p-5 rounded-lg transition-all duration-200 bg-gray-800/80 backdrop-blur-sm border-[3px] shadow-lg"
                  style={{
                    borderColor: customThemes[activeCustomTheme]?.primaryColor || '#FF69B4'
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div
                        className="w-8 h-8 rounded-full mr-3 shadow-md"
                        style={{ backgroundColor: customThemes[activeCustomTheme]?.primaryColor }}
                      ></div>
                      <h3 className="text-lg font-semibold text-white">{customThemes[activeCustomTheme]?.name || 'Custom Theme'}</h3>
                    </div>
                    <button
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCustomTheme(activeCustomTheme);
                      }}
                      aria-label="Delete theme"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-200 text-sm mb-4">Your personalized theme</p>

                  {/* Color Preview */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="flex flex-col items-center">
                      <div className="w-full h-6 rounded-md" style={{ backgroundColor: customThemes[activeCustomTheme]?.primaryColor }}></div>
                      <span className="text-xs text-gray-400 mt-1">Primary</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full h-6 rounded-md" style={{ backgroundColor: customThemes[activeCustomTheme]?.secondaryColor }}></div>
                      <span className="text-xs text-gray-400 mt-1">Secondary</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full h-6 rounded-md" style={{ backgroundColor: customThemes[activeCustomTheme]?.accentColor }}></div>
                      <span className="text-xs text-gray-400 mt-1">Accent</span>
                    </div>
                  </div>
                </div>
              )}

              {activeCategory === 'primary' && (
                <div
                  className="p-5 rounded-lg transition-all duration-200 cursor-pointer bg-gray-800/80 backdrop-blur-sm border border-dashed border-gray-600 hover:border-theme-primary"
                  onClick={() => setShowNewThemeForm(true)}
                >
                  <div className="flex flex-col items-center justify-center h-full text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-theme-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Create Custom Theme</h3>
                    <p className="text-gray-300 text-sm">Design your own color scheme</p>
                  </div>
                </div>
              )}

              {themesByCategory[activeCategory]
                .filter(scheme => {
                  // Filter out 'custom' scheme
                  if (scheme === 'custom') return false;

                  // Apply search filter
                  const themeInfo = colorSchemeInfo[scheme];
                  if (!themeInfo) return false;

                  if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    return (
                      themeInfo.name.toLowerCase().includes(query) ||
                      themeInfo.description.toLowerCase().includes(query) ||
                      themeInfo.category.toLowerCase().includes(query)
                    );
                  }

                  return true;
                })
                .sort((a, b) => {
                  const themeInfoA = colorSchemeInfo[a];
                  const themeInfoB = colorSchemeInfo[b];

                  if (!themeInfoA || !themeInfoB) return 0;

                  // Sort by favorites
                  if (sortOrder === 'favorites') {
                    const aFavorite = isFavorite(a);
                    const bFavorite = isFavorite(b);
                    if (aFavorite && !bFavorite) return -1;
                    if (!aFavorite && bFavorite) return 1;
                  }

                  // Sort by name
                  if (sortOrder === 'name') {
                    return themeInfoA.name.localeCompare(themeInfoB.name);
                  }

                  // Sort by newest (default to alphabetical since we don't track creation time for built-in themes)
                  return themeInfoA.name.localeCompare(themeInfoB.name);
                })
                .map((scheme) => {
                  const themeInfo = colorSchemeInfo[scheme];
                  if (!themeInfo) return null;

                  return (
                    <div
                      key={scheme}
                      className={`p-5 rounded-lg transition-all duration-200 cursor-pointer bg-gray-800/80 backdrop-blur-sm ${
                        theme.colorScheme === scheme
                          ? 'border-[3px] shadow-lg scale-[1.02]'
                          : 'border hover:border-opacity-70 hover:shadow-md hover:scale-[1.01]'
                      }`}
                      style={{
                        borderColor: themeInfo.primaryColor,
                        opacity: theme.colorScheme === scheme ? 1 : 0.8
                      }}
                      onClick={() => setColorScheme(scheme)}
                      title={`Apply ${themeInfo.name} theme`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setColorScheme(scheme);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div
                            className="w-8 h-8 rounded-full mr-3 shadow-md"
                            style={{ backgroundColor: themeInfo.primaryColor }}
                          ></div>
                          <h3 className="text-lg font-semibold text-white">{themeInfo.name}</h3>
                        </div>
                        <button
                          className="text-gray-400 hover:text-yellow-400 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(scheme);
                          }}
                          aria-label={isFavorite(scheme) ? "Remove from favorites" : "Add to favorites"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isFavorite(scheme) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-gray-200 text-sm mb-3">{themeInfo.description}</p>

                      {/* Preview Bar */}
                      <div className="mt-3 flex space-x-2">
                        <div className={`h-2 flex-grow rounded-full opacity-100`} style={{ backgroundColor: themeInfo.primaryColor }}></div>
                        <div className={`h-2 flex-grow rounded-full opacity-75`} style={{ backgroundColor: themeInfo.primaryColor }}></div>
                        <div className={`h-2 flex-grow rounded-full opacity-50`} style={{ backgroundColor: themeInfo.primaryColor }}></div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Custom Theme Management */}
            {activeCategory === 'primary' && (
              <div className="mt-8 bg-gray-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-theme-primary">Custom Themes</h3>
                  <div className="flex space-x-2">
                    <button
                      className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-md text-sm flex items-center"
                      onClick={exportCustomThemes}
                      disabled={Object.keys(customThemes).length === 0}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Export
                    </button>
                    <label className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-md text-sm flex items-center cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Import
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={importCustomThemes}
                      />
                    </label>
                  </div>
                </div>

                {Object.keys(customThemes).length > 0 ? (
                  <>
                    {/* No results message for custom themes */}
                    {searchQuery &&
                      Object.entries(customThemes)
                        .filter(([name, theme]) => {
                          const query = searchQuery.toLowerCase();
                          return (
                            name.toLowerCase().includes(query) ||
                            theme.name.toLowerCase().includes(query) ||
                            (theme.category && theme.category.toLowerCase().includes(query))
                          );
                        }).length === 0 && (
                      <div className="p-6 text-center bg-gray-800/50 rounded-lg mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-gray-400">No custom themes found matching "{searchQuery}"</p>
                        <button
                          className="mt-3 px-3 py-1.5 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
                          onClick={() => setSearchQuery('')}
                        >
                          Clear Search
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(customThemes)
                        .filter(([name, theme]) => {
                          // Apply search filter
                          if (searchQuery) {
                            const query = searchQuery.toLowerCase();
                            return (
                              name.toLowerCase().includes(query) ||
                              theme.name.toLowerCase().includes(query) ||
                              (theme.category && theme.category.toLowerCase().includes(query))
                            );
                          }
                          return true;
                        })
                      .sort(([, themeA], [, themeB]) => {
                        // Sort by favorites
                        if (sortOrder === 'favorites') {
                          const aFavorite = !!themeA.isFavorite;
                          const bFavorite = !!themeB.isFavorite;
                          if (aFavorite && !bFavorite) return -1;
                          if (!aFavorite && bFavorite) return 1;
                        }

                        // Sort by name
                        if (sortOrder === 'name') {
                          return themeA.name.localeCompare(themeB.name);
                        }

                        // Sort by newest (using the timestamp of the first history entry)
                        if (sortOrder === 'newest') {
                          const aTimestamp = themeA.history?.[0]?.timestamp || 0;
                          const bTimestamp = themeB.history?.[0]?.timestamp || 0;
                          return bTimestamp - aTimestamp; // Newest first
                        }

                        return 0;
                      })
                      .map(([name, theme]) => (
                      <div
                        key={name}
                        className={`p-3 rounded-md bg-gray-700/80 flex justify-between items-center cursor-pointer hover:bg-gray-600/80 transition-colors ${
                          activeCustomTheme === name ? 'border-l-4 border-theme-primary' : ''
                        }`}
                        onClick={() => applyCustomThemeByName(name)}
                        title={`Apply ${theme.name} theme`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            applyCustomThemeByName(name);
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <div className="flex space-x-1 mr-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.secondaryColor }}></div>
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.accentColor }}></div>
                          </div>
                          <span className="text-white">{theme.name}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className={`transition-colors ${theme.isFavorite ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-400 hover:text-yellow-400'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(name);
                            }}
                            aria-label={theme.isFavorite ? "Remove from favorites" : "Add to favorites"}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={theme.isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </button>
                          <button
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              shareTheme(name, theme);
                            }}
                            aria-label="Share theme"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                          </button>
                          <button
                            className="text-gray-400 hover:text-purple-500 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              showThemeHistory(name);
                            }}
                            aria-label="Theme history"
                            disabled={!theme.history || theme.history.length <= 1}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                          <button
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCustomTheme(name);
                            }}
                            aria-label="Delete theme"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  </>
                ) : (
                  <p className="text-gray-400 text-center py-4">No custom themes yet. Create one to get started!</p>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Account and Accessibility Settings */}
        <div className="bg-gray-900/80 backdrop-blur-md rounded-lg shadow-lg p-6 h-fit border border-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-theme-primary flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Account
          </h2>
          <p className="text-gray-300 mb-6">
            Account settings are coming soon. You'll be able to manage your preferences and connected accounts here.
          </p>

          <div className="border-t border-gray-700 my-6 pt-6">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Accessibility
            </h3>

            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="high-contrast"
                  checked={highContrastMode}
                  onChange={(e) => setHighContrastMode(e.target.checked)}
                  className="mr-3 h-4 w-4 rounded border-gray-600 text-theme-primary focus:ring-theme-primary"
                />
                <label htmlFor="high-contrast" className="text-sm text-gray-300">
                  High Contrast Mode
                </label>
              </div>

              <div>
                <label htmlFor="color-blindness" className="block text-sm text-gray-300 mb-2">
                  Color Blindness Simulation
                </label>
                <select
                  id="color-blindness"
                  value={colorBlindnessSimulation}
                  onChange={(e) => setColorBlindnessSimulation(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-theme-primary"
                >
                  <option value="none">No Color Blindness Simulation</option>
                  <option value="protanopia">Protanopia (Red-Blind)</option>
                  <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
                  <option value="tritanopia">Tritanopia (Blue-Blind)</option>
                </select>
              </div>

              <div>
                <label htmlFor="font-size" className="block text-sm text-gray-300 mb-2">
                  Font Size
                </label>
                <select
                  id="font-size"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-theme-primary"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium (Default)</option>
                  <option value="large">Large</option>
                  <option value="xl">Extra Large</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reduce-motion"
                  checked={reduceMotion}
                  onChange={(e) => setReduceMotion(e.target.checked)}
                  className="mr-3 h-4 w-4 rounded border-gray-600 text-theme-primary focus:ring-theme-primary"
                />
                <label htmlFor="reduce-motion" className="text-sm text-gray-300">
                  Reduce Motion
                </label>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm text-gray-300 mb-2">
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-theme-primary"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Language support is coming soon. This setting prepares your account for when it's available.
                </p>
              </div>
            </div>
          </div>

          {/* Theme Preview Section */}
          <div className="border-t border-gray-700 my-6 pt-6">
            <h3 className="text-lg font-semibold text-theme-primary mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Theme Preview
            </h3>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <p className="text-gray-300 mb-3">This is how UI elements will look with your current settings:</p>

              <div className="space-y-4">
                {/* Text elements */}
                <div>
                  <h4 className="text-theme-primary font-bold">Heading Text</h4>
                  <p className="text-white">Regular paragraph text</p>
                  <p className="text-gray-400 text-sm">Secondary text in smaller size</p>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-theme-primary text-white rounded-md hover:bg-opacity-90">
                    Primary Button
                  </button>
                  <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">
                    Secondary Button
                  </button>
                  <button className="px-4 py-2 border border-theme-primary text-theme-primary rounded-md hover:bg-theme-primary hover:bg-opacity-10">
                    Outline Button
                  </button>
                </div>

                {/* Form elements */}
                <div className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    placeholder="Text input"
                    className="px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-theme-primary"
                  />
                  <select className="px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-theme-primary">
                    <option>Dropdown option 1</option>
                    <option>Dropdown option 2</option>
                  </select>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="preview-checkbox"
                      className="mr-2 h-4 w-4 rounded border-gray-600 text-theme-primary focus:ring-theme-primary"
                    />
                    <label htmlFor="preview-checkbox" className="text-white">Checkbox</label>
                  </div>
                </div>

                {/* Card */}
                <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                  <h5 className="text-theme-primary font-medium mb-2">Card Title</h5>
                  <p className="text-gray-300 text-sm">This is a sample card with the current theme applied.</p>
                </div>
              </div>
            </div>
          </div>

          <button
            className="bg-theme-primary text-white px-5 py-2.5 rounded-md flex items-center hover:bg-opacity-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Settings Applied Automatically
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

