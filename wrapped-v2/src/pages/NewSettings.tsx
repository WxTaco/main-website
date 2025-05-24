import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useTheme } from '../contexts/ThemeContext';
import { useCookies } from '../contexts/CookieContext';
import type { ThemeCategory, ColorScheme } from '../types/theme';
import ColorPickerPopup from '../components/ColorPickerPopup';
import { useLocation } from 'react-router-dom';
import Tooltip from '../components/Tooltip';
import { AlertDialog, ConfirmDialog } from '../components/CustomDialog';


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

const NewSettings: React.FC = () => {
  const { theme, setColorScheme, applyCustomTheme } = useTheme();
  const { cookiesAccepted } = useCookies();
  const location = useLocation();


  const [activeTab, setActiveTab] = useState<SettingsTab>('themes');
  const [activeCategory, setActiveCategory] = useState<ThemeCategory>('primary');


  const [customThemes, setCustomThemes] = useState<Record<string, CustomTheme>>({});
  const [activeCustomTheme, setActiveCustomTheme] = useState<string>('');
  const [showNewThemeForm, setShowNewThemeForm] = useState(false);
  const [showThemeHistoryModal, setShowThemeHistoryModal] = useState(false);
  const [selectedThemeForHistory, setSelectedThemeForHistory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [favoritedPremadeThemes, setFavoritedPremadeThemes] = useState<string[]>([]);


  const [alertDialog, setAlertDialog] = useState({ isOpen: false, title: '', message: '' });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDangerous: false
  });


  const [newThemeName, setNewThemeName] = useState('');
  const [newThemeCategory, setNewThemeCategory] = useState<ThemeCategory>('primary');
  const [newPrimaryColor, setNewPrimaryColor] = useState('#FF69B4');
  const [newSecondaryColor, setNewSecondaryColor] = useState('#f472b6');
  const [newAccentColor, setNewAccentColor] = useState('#FFD700');


  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'name' | 'newest' | 'favorites'>('name');


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


  const isInitialMount = React.useRef(true);
  const skipEffectRef = React.useRef(false);


  useEffect(() => {
    setIsLoading(true);


    let parsedThemes: Record<string, CustomTheme> = {};
    let favoritedThemes: string[] = [];


    if (cookiesAccepted === true) {

      const savedCustomThemes = localStorage.getItem('customThemes');

      if (savedCustomThemes) {
        try {
          parsedThemes = JSON.parse(savedCustomThemes);
          setCustomThemes(parsedThemes);
        } catch (e) {
          console.error('Failed to parse saved custom themes', e);
          setAlertDialog({
            isOpen: true,
            title: 'Error Loading Themes',
            message: 'There was a problem loading your saved themes. Some themes may not be available.'
          });
        }
      }


      const savedFavoritedThemes = localStorage.getItem('favoritedPremadeThemes');
      if (savedFavoritedThemes) {
        try {
          favoritedThemes = JSON.parse(savedFavoritedThemes);
          setFavoritedPremadeThemes(favoritedThemes);
        } catch (e) {
          console.error('Failed to parse favorited premade themes', e);
        }
      }


      const savedActiveTheme = localStorage.getItem('activeCustomTheme');
      if (savedActiveTheme && parsedThemes[savedActiveTheme]) {
        setActiveCustomTheme(savedActiveTheme);
      }
    }


    setTimeout(() => setIsLoading(false), 300);


    const params = new URLSearchParams(location.search);
    const sharedThemeData = params.get('t');

    if (sharedThemeData && cookiesAccepted === true) {

      setTimeout(() => {
        try {

          const decodedData = atob(sharedThemeData);
          const sharedTheme = JSON.parse(decodedData);

          if (sharedTheme && Object.keys(sharedTheme).length > 0) {
            const themeName = Object.keys(sharedTheme)[0];
            const themeData = sharedTheme[themeName];


            const historyEntry: CustomThemeVersion = {
              primaryColor: themeData.primaryColor,
              secondaryColor: themeData.secondaryColor,
              accentColor: themeData.accentColor,
              version: 1,
              timestamp: Date.now()
            };


            const importedTheme: CustomTheme = {
              ...themeData,
              name: `${themeData.name} (Imported)`,
              history: [historyEntry],
              isFavorite: false
            };


            const newThemeKey = `${themeName}_imported_${Date.now()}`;


            const updatedThemes = {
              ...parsedThemes,
              [newThemeKey]: importedTheme
            };


            setCustomThemes(updatedThemes);
            localStorage.setItem('customThemes', JSON.stringify(updatedThemes));
            setActiveCustomTheme(newThemeKey);
            localStorage.setItem('activeCustomTheme', newThemeKey);


            skipEffectRef.current = true;
            applyCustomTheme(
              importedTheme.primaryColor,
              importedTheme.secondaryColor,
              importedTheme.accentColor
            );


            setAlertDialog({
              isOpen: true,
              title: 'Theme Imported',
              message: 'Theme has been imported successfully and applied!'
            });


            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
          }
        } catch (e) {
          console.error('Failed to import shared theme', e);
          setAlertDialog({
            isOpen: true,
            title: 'Import Error',
            message: 'Failed to import the shared theme. The link may be invalid or corrupted.'
          });


          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      }, 500);
    }



  }, [cookiesAccepted, location.search, applyCustomTheme]);


  useEffect(() => {

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }


    if (cookiesAccepted === true && Object.keys(customThemes).length > 0) {
      localStorage.setItem('customThemes', JSON.stringify(customThemes));
    }
  }, [customThemes, cookiesAccepted]);


  useEffect(() => {

    if (isInitialMount.current) return;


    if (cookiesAccepted === true && activeCustomTheme) {
      localStorage.setItem('activeCustomTheme', activeCustomTheme);
    }
  }, [activeCustomTheme, cookiesAccepted]);


  useEffect(() => {

    if (isInitialMount.current) return;


    if (cookiesAccepted === true) {
      localStorage.setItem('favoritedPremadeThemes', JSON.stringify(favoritedPremadeThemes));
    }
  }, [favoritedPremadeThemes, cookiesAccepted]);


  useEffect(() => {
    if (isInitialMount.current || skipEffectRef.current) {
      skipEffectRef.current = false;
      return;
    }

    if (activeCustomTheme && customThemes[activeCustomTheme]) {
      const selectedTheme = customThemes[activeCustomTheme];
      applyCustomTheme(
        selectedTheme.primaryColor,
        selectedTheme.secondaryColor,
        selectedTheme.accentColor
      );
    }
  }, [activeCustomTheme, customThemes, applyCustomTheme]);


  useEffect(() => {

    if (cookiesAccepted === true) {
      localStorage.setItem('highContrastMode', JSON.stringify(highContrastMode));
    }


    if (highContrastMode) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrastMode, cookiesAccepted]);

  useEffect(() => {

    if (cookiesAccepted === true) {
      localStorage.setItem('colorBlindnessSimulation', colorBlindnessSimulation);
    }


    document.documentElement.classList.remove('protanopia', 'deuteranopia', 'tritanopia');


    if (colorBlindnessSimulation !== 'none') {
      document.documentElement.classList.add(colorBlindnessSimulation);
    }
  }, [colorBlindnessSimulation, cookiesAccepted]);

  useEffect(() => {

    if (cookiesAccepted === true) {
      localStorage.setItem('fontSize', fontSize);
    }


    document.documentElement.classList.remove('text-size-small', 'text-size-medium', 'text-size-large', 'text-size-xl');


    document.documentElement.classList.add(`text-size-${fontSize}`);
  }, [fontSize, cookiesAccepted]);

  useEffect(() => {

    if (cookiesAccepted === true) {
      localStorage.setItem('reduceMotion', JSON.stringify(reduceMotion));
    }


    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reduceMotion, cookiesAccepted]);

  useEffect(() => {

    if (cookiesAccepted === true) {
      localStorage.setItem('language', language);
    }


    document.documentElement.setAttribute('lang', language);
  }, [language, cookiesAccepted]);


  const applyCustomThemeByName = (themeName: string) => {
    const selectedTheme = customThemes[themeName];
    if (selectedTheme) {

      const updatedTheme = { ...selectedTheme };
      if (!updatedTheme.history) {
        updatedTheme.history = [];
      }


      const lastHistoryEntry = updatedTheme.history[0];
      const shouldAddHistory = !lastHistoryEntry ||
        lastHistoryEntry.primaryColor !== updatedTheme.primaryColor ||
        lastHistoryEntry.secondaryColor !== updatedTheme.secondaryColor ||
        lastHistoryEntry.accentColor !== updatedTheme.accentColor;


      if (shouldAddHistory) {
        const newHistoryEntry: CustomThemeVersion = {
          primaryColor: updatedTheme.primaryColor,
          secondaryColor: updatedTheme.secondaryColor,
          accentColor: updatedTheme.accentColor,
          version: (lastHistoryEntry?.version || 0) + 1,
          timestamp: Date.now()
        };


        setCustomThemes(prev => ({
          ...prev,
          [themeName]: {
            ...prev[themeName],
            history: [newHistoryEntry, ...(prev[themeName].history || [])]
          }
        }));
      }


      skipEffectRef.current = true;


      setActiveCustomTheme(themeName);


      applyCustomTheme(
        updatedTheme.primaryColor,
        updatedTheme.secondaryColor,
        updatedTheme.accentColor
      );
    }
  };


  const createNewTheme = () => {

    if (!newThemeName.trim()) {
      setAlertDialog({
        isOpen: true,
        title: 'Missing Information',
        message: 'Please enter a theme name'
      });
      return;
    }


    if (newThemeName.trim().length > 30) {
      setAlertDialog({
        isOpen: true,
        title: 'Invalid Name',
        message: 'Theme name must be 30 characters or less'
      });
      return;
    }


    if (!newPrimaryColor || !newSecondaryColor || !newAccentColor) {
      setAlertDialog({
        isOpen: true,
        title: 'Missing Colors',
        message: 'Please select all three colors for your theme'
      });
      return;
    }


    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!colorRegex.test(newPrimaryColor) || !colorRegex.test(newSecondaryColor) || !colorRegex.test(newAccentColor)) {
      setAlertDialog({
        isOpen: true,
        title: 'Invalid Colors',
        message: 'Colors must be in valid hexadecimal format (e.g., #FF5500)'
      });
      return;
    }


    const isEditing = activeCustomTheme && customThemes[activeCustomTheme] &&
                      newThemeName === customThemes[activeCustomTheme].name;


    if (!isEditing && customThemes[newThemeName]) {
      setAlertDialog({
        isOpen: true,
        title: 'Duplicate Name',
        message: 'A theme with this name already exists'
      });
      return;
    }


    if (isEditing) {
      const currentTheme = customThemes[activeCustomTheme];


      if (currentTheme.primaryColor !== newPrimaryColor ||
          currentTheme.secondaryColor !== newSecondaryColor ||
          currentTheme.accentColor !== newAccentColor) {


        const newHistoryEntry: CustomThemeVersion = {
          primaryColor: currentTheme.primaryColor,
          secondaryColor: currentTheme.secondaryColor,
          accentColor: currentTheme.accentColor,
          version: Math.max(...(currentTheme.history?.map(h => h.version) || [0])) + 1,
          timestamp: Date.now()
        };


        setCustomThemes(prev => ({
          ...prev,
          [activeCustomTheme]: {
            ...prev[activeCustomTheme],
            primaryColor: newPrimaryColor,
            secondaryColor: newSecondaryColor,
            accentColor: newAccentColor,
            category: newThemeCategory,
            history: [
              {
                primaryColor: newPrimaryColor,
                secondaryColor: newSecondaryColor,
                accentColor: newAccentColor,
                version: newHistoryEntry.version + 1,
                timestamp: Date.now()
              },
              newHistoryEntry,
              ...(prev[activeCustomTheme].history || [])
            ]
          }
        }));


        skipEffectRef.current = true;


        applyCustomTheme(newPrimaryColor, newSecondaryColor, newAccentColor);
      }
    } else {


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


      skipEffectRef.current = true;


      setActiveCustomTheme(newThemeName);


      applyCustomTheme(newPrimaryColor, newSecondaryColor, newAccentColor);
    }


    setNewThemeName('');
    setShowNewThemeForm(false);
  };




  const generateRandomColors = () => {

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


  const toggleFavorite = (themeName: string) => {
    if (themeName in customThemes) {

      setCustomThemes(prev => ({
        ...prev,
        [themeName]: {
          ...prev[themeName],
          isFavorite: !prev[themeName].isFavorite
        }
      }));
    } else {

      setFavoritedPremadeThemes(prev => {
        if (prev.includes(themeName)) {

          return prev.filter(theme => theme !== themeName);
        } else {

          return [...prev, themeName];
        }
      });


      const favoriteKey = `${themeName}_favorite`;
      if (favoriteKey in customThemes) {
        const updatedThemes = { ...customThemes };
        delete updatedThemes[favoriteKey];
        setCustomThemes(updatedThemes);
      }
    }
  };


  const isFavorite = (themeName: string): boolean => {

    if (themeName in customThemes && customThemes[themeName].isFavorite) {
      return true;
    }


    if (favoritedPremadeThemes.includes(themeName)) {
      return true;
    }


    if (`${themeName}_favorite` in customThemes) {
      return true;
    }

    return false;
  };


  const suggestComplementaryColors = (baseColor: string) => {

    const hexToHSL = (hex: string): [number, number, number] => {

      hex = hex.replace(/^#/, '');


      let r = parseInt(hex.substring(0, 2), 16) / 255;
      let g = parseInt(hex.substring(2, 4), 16) / 255;
      let b = parseInt(hex.substring(4, 6), 16) / 255;


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


    const [h, s, l] = hexToHSL(baseColor);


    const complementaryH = (h + 180) % 360;
    const complementaryColor = hslToHex(complementaryH, s, l);


    const analogousH = (h + 30) % 360;
    const analogousColor = hslToHex(analogousH, s, l);


    setNewSecondaryColor(complementaryColor);
    setNewAccentColor(analogousColor);
  };


  const shareTheme = (name: string, theme: CustomTheme) => {

    const minimalTheme = {
      name: theme.name,
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      accentColor: theme.accentColor,
      category: theme.category
    };

    const themeData = JSON.stringify({ [name]: minimalTheme });
    const encodedData = btoa(themeData);


    navigator.clipboard.writeText(`${window.location.origin}/settings?t=${encodedData}`)
      .then(() => {
        setAlertDialog({
          isOpen: true,
          title: 'Success',
          message: 'Theme share link copied to clipboard!'
        });
      })
      .catch(err => {
        console.error('Failed to copy share link', err);
        setAlertDialog({
          isOpen: true,
          title: 'Error',
          message: 'Failed to copy share link. Please try again.'
        });
      });
  };


  const exportTheme = (_themeName: string, theme: CustomTheme) => {
    if (!theme) return;


    const exportData = {
      name: theme.name,
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      accentColor: theme.accentColor,
      category: theme.category || 'primary',
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };


    const jsonString = JSON.stringify(exportData, null, 2);


    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);


    const a = document.createElement('a');
    a.href = url;
    a.download = `${theme.name.replace(/\s+/g, '_').toLowerCase()}_theme.json`;
    document.body.appendChild(a);
    a.click();


    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };


  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);


        if (!importedData.name || !importedData.primaryColor ||
            !importedData.secondaryColor || !importedData.accentColor) {
          throw new Error('Invalid theme file format');
        }


        let themeName = importedData.name;
        if (customThemes[themeName]) {
          themeName = `${themeName}_imported_${Date.now()}`;
        }


        const historyEntry: CustomThemeVersion = {
          primaryColor: importedData.primaryColor,
          secondaryColor: importedData.secondaryColor,
          accentColor: importedData.accentColor,
          version: 1,
          timestamp: Date.now()
        };


        const newTheme: CustomTheme = {
          name: themeName,
          primaryColor: importedData.primaryColor,
          secondaryColor: importedData.secondaryColor,
          accentColor: importedData.accentColor,
          category: importedData.category || 'primary',
          isFavorite: false,
          history: [historyEntry]
        };


        setCustomThemes(prev => ({
          ...prev,
          [themeName]: newTheme
        }));


        skipEffectRef.current = true;
        setActiveCustomTheme(themeName);
        applyCustomTheme(
          importedData.primaryColor,
          importedData.secondaryColor,
          importedData.accentColor
        );

        setAlertDialog({
          isOpen: true,
          title: 'Theme Imported',
          message: `Theme "${themeName}" has been imported successfully and applied!`
        });
      } catch (error) {
        console.error('Failed to import theme', error);
        setAlertDialog({
          isOpen: true,
          title: 'Import Error',
          message: 'Failed to import theme. Please check the file format and try again.'
        });
      }


      event.target.value = '';
    };

    reader.readAsText(file);
  };


  const exportCustomThemes = () => {
    if (Object.keys(customThemes).length === 0) {
      setAlertDialog({
        isOpen: true,
        title: 'Export Error',
        message: 'No custom themes to export'
      });
      return;
    }


    const exportData = {
      themes: customThemes,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };


    const jsonString = JSON.stringify(exportData, null, 2);


    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);


    const a = document.createElement('a');
    a.href = url;
    a.download = `wrapped_custom_themes_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();


    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };


  const importCustomThemes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);


        const updatedThemes = { ...customThemes };
        let importCount = 0;
        let skipCount = 0;


        if (importedData.name && importedData.primaryColor &&
            importedData.secondaryColor && importedData.accentColor) {

          const themeData = importedData;


          let themeKey = themeData.name.replace(/\s+/g, '_').toLowerCase();
          if (updatedThemes[themeKey]) {
            themeKey = `${themeKey}_imported_${Date.now()}`;
          }


          if (!themeData.history || !Array.isArray(themeData.history) || themeData.history.length === 0) {
            themeData.history = [{
              primaryColor: themeData.primaryColor,
              secondaryColor: themeData.secondaryColor,
              accentColor: themeData.accentColor,
              version: 1,
              timestamp: Date.now()
            }];
          }


          updatedThemes[themeKey] = themeData;
          importCount = 1;
        }

        else if (importedData.themes && typeof importedData.themes === 'object') {
          const importedThemes = importedData.themes;


          Object.entries(importedThemes).forEach(([key, themeData]: [string, any]) => {

            if (!themeData.name || !themeData.primaryColor ||
                !themeData.secondaryColor || !themeData.accentColor) {
              skipCount++;
              return;
            }


            let themeKey = key;
            if (updatedThemes[themeKey]) {
              themeKey = `${themeKey}_imported_${Date.now()}`;
            }


            if (!themeData.history || !Array.isArray(themeData.history) || themeData.history.length === 0) {
              themeData.history = [{
                primaryColor: themeData.primaryColor,
                secondaryColor: themeData.secondaryColor,
                accentColor: themeData.accentColor,
                version: 1,
                timestamp: Date.now()
              }];
            }


            updatedThemes[themeKey] = themeData;
            importCount++;
          });
        }

        else if (typeof importedData === 'object') {

          Object.entries(importedData).forEach(([key, themeData]: [string, any]) => {

            if (!themeData.name || !themeData.primaryColor ||
                !themeData.secondaryColor || !themeData.accentColor) {
              skipCount++;
              return;
            }


            let themeKey = key;
            if (updatedThemes[themeKey]) {
              themeKey = `${themeKey}_imported_${Date.now()}`;
            }


            if (!themeData.history || !Array.isArray(themeData.history) || themeData.history.length === 0) {
              themeData.history = [{
                primaryColor: themeData.primaryColor,
                secondaryColor: themeData.secondaryColor,
                accentColor: themeData.accentColor,
                version: 1,
                timestamp: Date.now()
              }];
            }


            updatedThemes[themeKey] = themeData;
            importCount++;
          });
        }

        if (importCount > 0) {

          setCustomThemes(updatedThemes);
          localStorage.setItem('customThemes', JSON.stringify(updatedThemes));


          setAlertDialog({
            isOpen: true,
            title: 'Themes Imported',
            message: `Successfully imported ${importCount} theme${importCount !== 1 ? 's' : ''}${skipCount > 0 ? ` (${skipCount} skipped due to invalid format)` : ''}`
          });
        } else {
          setAlertDialog({
            isOpen: true,
            title: 'Import Error',
            message: 'No valid themes found in the import file'
          });
        }
      } catch (error) {
        console.error('Failed to import themes', error);
        setAlertDialog({
          isOpen: true,
          title: 'Import Error',
          message: 'Failed to import themes. Please check the file format and try again.'
        });
      }


      event.target.value = '';
    };

    reader.readAsText(file);
  };


  const deleteCustomTheme = (themeName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Theme',
      message: `Are you sure you want to delete the "${customThemes[themeName]?.name || themeName}" theme? This action cannot be undone.`,
      isDangerous: true,
      onConfirm: () => {
        try {

          const updatedThemes = { ...customThemes };
          delete updatedThemes[themeName];


          setCustomThemes(updatedThemes);
          if (cookiesAccepted === true) {
            localStorage.setItem('customThemes', JSON.stringify(updatedThemes));
          }


          if (activeCustomTheme === themeName) {
            setActiveCustomTheme('');
            if (cookiesAccepted === true) {
              localStorage.removeItem('activeCustomTheme');
            }
            setColorScheme('purple');
          }


          setAlertDialog({
            isOpen: true,
            title: 'Theme Deleted',
            message: 'The theme has been successfully deleted.'
          });
        } catch (error) {
          console.error('Error deleting theme:', error);
          setAlertDialog({
            isOpen: true,
            title: 'Error',
            message: 'There was a problem deleting the theme. Please try again.'
          });
        }
      }
    });
  };


  const showThemeHistory = (themeName: string) => {
    setSelectedThemeForHistory(themeName);
    setShowThemeHistoryModal(true);
  };


  const revertToVersion = (themeName: string, version: number) => {
    const theme = customThemes[themeName];
    if (!theme || !theme.history) return;

    const versionToRevert = theme.history.find(v => v.version === version);
    if (!versionToRevert) return;


    if (theme.history[0]?.version === version) return;


    const newHistoryEntry: CustomThemeVersion = {
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      accentColor: theme.accentColor,
      version: Math.max(...theme.history.map(h => h.version)) + 1,
      timestamp: Date.now()
    };


    setCustomThemes(prev => {
      const updatedTheme = {
        ...prev[themeName],
        primaryColor: versionToRevert.primaryColor,
        secondaryColor: versionToRevert.secondaryColor,
        accentColor: versionToRevert.accentColor,
        history: [

          {
            ...versionToRevert,
            version: newHistoryEntry.version,
            timestamp: newHistoryEntry.timestamp
          },

          ...(prev[themeName].history || [])
        ]
      };

      return {
        ...prev,
        [themeName]: updatedTheme
      };
    });


    if (activeCustomTheme === themeName) {

      skipEffectRef.current = true;

      applyCustomTheme(
        versionToRevert.primaryColor,
        versionToRevert.secondaryColor,
        versionToRevert.accentColor
      );
    }
  };


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
    electricblue: {
      name: 'MagicGamer Blue',
      description: 'MagicGamer\'s signature color',
      primaryColor: '#1F53FF',
      previewClass: 'bg-blue-600',
      category: 'cool'
    },
    sunset: {
      name: 'Sunset',
      description: 'Warm orange and cool blue, inspired by sunsets',
      primaryColor: '#f35d1d',
      previewClass: 'bg-gradient-to-r from-[#f35d1d] to-[#4691b1]',
      category: 'vibrant'
    },
    custom: {
      name: 'Custom',
      description: 'Your personalized theme',
      primaryColor: '#FF69B4',
      previewClass: 'bg-custom',
      category: 'primary'
    }
  };


  const themesByCategory: Record<ThemeCategory, ColorScheme[]> = {
    primary: ['pink', 'custom'],
    cool: ['blue', 'purple', 'teal', 'indigo', 'sky', 'silver', 'sapphire', 'aquamarine', 'lavender', 'cyan', 'violet', 'electricblue'],
    warm: ['red', 'orange', 'rose', 'amber', 'peach', 'topaz', 'coral'],
    nature: ['green', 'lime', 'brown', 'mint', 'emerald', 'peridot'],
    vibrant: ['cyberpunk', 'fuchsia', 'gold', 'ruby', 'magenta', 'yellow', 'amethyst', 'sunset']
  };


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
        <title>Wrapped Settings</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-4 text-theme-primary">Settings</h1>

      {/* Custom Theme Form Popup */}
      {showNewThemeForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-700 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 text-theme-primary flex items-center justify-between">
                <span>
                  {activeCustomTheme && customThemes[activeCustomTheme] &&
                   newThemeName === customThemes[activeCustomTheme].name
                    ? 'Edit Theme'
                    : 'Create Custom Theme'}
                </span>
                <button
                  className="text-gray-400 hover:text-gray-200"
                  onClick={() => setShowNewThemeForm(false)}
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </h3>

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
                  {activeCustomTheme && customThemes[activeCustomTheme] &&
                   newThemeName === customThemes[activeCustomTheme].name
                    ? 'Save Changes'
                    : 'Create Theme'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Theme History Modal */}
      {showThemeHistoryModal && selectedThemeForHistory && customThemes[selectedThemeForHistory] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-700 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 text-theme-primary flex items-center justify-between">
                <span>Theme History: {customThemes[selectedThemeForHistory].name}</span>
                <button
                  className="text-gray-400 hover:text-gray-200"
                  onClick={() => setShowThemeHistoryModal(false)}
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </h3>

              {!customThemes[selectedThemeForHistory].history || customThemes[selectedThemeForHistory].history?.length === 0 ? (
                <div className="p-4 text-center bg-gray-800/50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-400 text-lg mb-2">No history available</p>
                  <p className="text-gray-500 text-sm">Make changes to this theme to create history entries.</p>
                </div>
              ) : customThemes[selectedThemeForHistory].history?.length === 1 ? (
                <div className="p-4 text-center bg-gray-800/50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-400 text-lg mb-2">Only one version available</p>
                  <p className="text-gray-500 text-sm">Make changes to this theme to create more history entries.</p>

                  <div className="mt-4 p-3 rounded-md bg-gray-800 border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="text-white font-medium">Version 1</span>
                        <span className="text-gray-400 text-sm ml-3">
                          {customThemes[selectedThemeForHistory].history[0].timestamp
                            ? new Date(customThemes[selectedThemeForHistory].history[0].timestamp).toLocaleString()
                            : 'Initial version'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col items-center">
                        <div className="w-full h-6 rounded-md" style={{ backgroundColor: customThemes[selectedThemeForHistory].history[0].primaryColor }}></div>
                        <span className="text-xs text-gray-400 mt-1">Primary</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-full h-6 rounded-md" style={{ backgroundColor: customThemes[selectedThemeForHistory].history[0].secondaryColor }}></div>
                        <span className="text-xs text-gray-400 mt-1">Secondary</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-full h-6 rounded-md" style={{ backgroundColor: customThemes[selectedThemeForHistory].history[0].accentColor }}></div>
                        <span className="text-xs text-gray-400 mt-1">Accent</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto custom-scrollbar pr-1">
                  <p className="text-gray-400 text-sm mb-4">
                    Select a previous version to restore it. The current version will be saved in history.
                  </p>
                  {customThemes[selectedThemeForHistory].history?.map((version) => (
                    <div
                      key={version.version}
                      className={`p-3 mb-3 rounded-md bg-gray-800 border ${
                        version.version === customThemes[selectedThemeForHistory].history?.[0].version
                          ? 'border-theme-primary'
                          : 'border-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="text-white font-medium">
                            {version.version === customThemes[selectedThemeForHistory].history?.[0].version
                              ? 'Current Version'
                              : `Version ${version.version}`}
                          </span>
                          <span className="text-gray-400 text-sm ml-3">
                            {new Date(version.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {version.version !== customThemes[selectedThemeForHistory].history?.[0].version && (
                          <button
                            className="px-2 py-1 text-xs bg-theme-primary text-white rounded hover:bg-opacity-90"
                            onClick={() => {
                              revertToVersion(selectedThemeForHistory, version.version);
                              setShowThemeHistoryModal(false);
                            }}
                          >
                            Restore
                          </button>
                        )}
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
              )}

              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                  onClick={() => setShowThemeHistoryModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 bg-gray-800/50 p-3 rounded-lg">
        <button
          className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'themes'
              ? 'bg-theme-primary text-white shadow-md'
              : 'bg-gray-700/70 text-gray-300 hover:bg-gray-600 hover:text-white'
          }`}
          onClick={() => setActiveTab('themes')}
          aria-label="Themes tab"
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
          aria-label="Accessibility tab"
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
          aria-label="Account tab"
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
          aria-label="Preview tab"
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Preview
          </div>
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area - Takes 2/3 of the space on large screens */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900/80 backdrop-blur-md rounded-lg shadow-lg p-6 mb-8 border border-gray-800">
            {/* Tab Content - Will be populated in the next steps */}
            {activeTab === 'themes' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-theme-primary flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    Theme Settings
                  </h2>
                </div>

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
                      aria-label={`${categoryLabels[category]} themes category`}
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
                      aria-label="Search themes"
                    />
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <select
                    className="px-3 py-2 bg-gray-800/70 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-1 focus:ring-theme-primary"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'name' | 'newest' | 'favorites')}
                    aria-label="Sort themes"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="newest">Sort by Newest</option>
                    <option value="favorites">Sort by Favorites</option>
                  </select>
                </div>

                {/* Loading State */}
                {isLoading ? (
                  <div className="col-span-2 p-8 text-center bg-gray-800/50 rounded-lg">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-700 rounded-full mb-3"></div>
                      <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                    </div>
                    <p className="text-gray-400 text-lg mt-4">Loading themes...</p>
                  </div>
                ) : (
                  /* Theme Grid */
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

                  {/* Custom Theme Card - Only shown in Primary category */}
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

                  {/* Create Custom Theme Card - Only shown in Primary category */}
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

                  {/* Built-in Theme Cards */}
                  {themesByCategory[activeCategory]
                    .filter(scheme => {

                      if (scheme === 'custom') return false;


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


                      if (sortOrder === 'favorites') {
                        const aFavorite = isFavorite(a);
                        const bFavorite = isFavorite(b);
                        if (aFavorite && !bFavorite) return -1;
                        if (!aFavorite && bFavorite) return 1;
                      }


                      if (sortOrder === 'name') {
                        return themeInfoA.name.localeCompare(themeInfoB.name);
                      }


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
                          onClick={() => {

                            setActiveCustomTheme('');
                            localStorage.removeItem('activeCustomTheme');
                            setColorScheme(scheme);
                          }}
                          title={`Apply ${themeInfo.name} theme`}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();

                              setActiveCustomTheme('');
                              localStorage.removeItem('activeCustomTheme');
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
                          <p className="text-gray-200 text-sm mb-4">{themeInfo.description}</p>

                          {/* Color Preview */}
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {scheme === 'sunset' ? (
                              <>
                                <div className="flex flex-col items-center">
                                  <div className="w-full h-6 rounded-md" style={{ backgroundColor: themeInfo.primaryColor }}></div>
                                  <span className="text-xs text-gray-400 mt-1">Primary</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="w-full h-6 rounded-md" style={{ backgroundColor: '#fbbf24' }}></div>
                                  <span className="text-xs text-gray-400 mt-1">Secondary</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="w-full h-6 rounded-md" style={{ backgroundColor: '#4691b1' }}></div>
                                  <span className="text-xs text-gray-400 mt-1">Accent</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex flex-col items-center">
                                  <div className="w-full h-6 rounded-md" style={{ backgroundColor: themeInfo.primaryColor }}></div>
                                  <span className="text-xs text-gray-400 mt-1">Primary</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="w-full h-6 rounded-md" style={{ backgroundColor: themeInfo.primaryColor, opacity: 0.8 }}></div>
                                  <span className="text-xs text-gray-400 mt-1">Secondary</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="w-full h-6 rounded-md" style={{ backgroundColor: themeInfo.primaryColor, opacity: 0.6 }}></div>
                                  <span className="text-xs text-gray-400 mt-1">Accent</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Favorites Section */}
                <div className="mt-12">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-theme-primary flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Favorite Themes
                    </h3>
                  </div>

                  {/* Favorites Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    {/* No favorites message */}
                    {favoritedPremadeThemes.length === 0 && Object.values(customThemes).filter(theme => theme.isFavorite).length === 0 && (
                      <div className="col-span-2 p-8 text-center bg-gray-800/50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <p className="text-gray-400 text-lg mb-2">No favorite themes yet</p>
                        <p className="text-gray-500 text-sm mb-4">Star your favorite themes to see them here</p>
                      </div>
                    )}

                    {/* Favorited Built-in Theme Cards */}
                    {favoritedPremadeThemes
                      .filter(scheme => {
                        const themeInfo = colorSchemeInfo[scheme as ColorScheme];
                        return !!themeInfo;
                      })
                      .sort((a, b) => {
                        const themeInfoA = colorSchemeInfo[a as ColorScheme];
                        const themeInfoB = colorSchemeInfo[b as ColorScheme];

                        if (!themeInfoA || !themeInfoB) return 0;


                        if (sortOrder === 'name') {
                          return themeInfoA.name.localeCompare(themeInfoB.name);
                        }


                        return themeInfoA.name.localeCompare(themeInfoB.name);
                      })
                      .map((scheme) => {
                        const themeInfo = colorSchemeInfo[scheme as ColorScheme];
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
                            onClick={() => {

                              setActiveCustomTheme('');
                              localStorage.removeItem('activeCustomTheme');
                              setColorScheme(scheme as ColorScheme);
                            }}
                            title={`Apply ${themeInfo.name} theme`}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();

                                setActiveCustomTheme('');
                                localStorage.removeItem('activeCustomTheme');
                                setColorScheme(scheme as ColorScheme);
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
                                className="text-yellow-400 hover:text-yellow-300 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(scheme);
                                }}
                                aria-label="Remove from favorites"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              </button>
                            </div>
                            <p className="text-gray-200 text-sm mb-4">{themeInfo.description}</p>

                            {/* Color Preview */}
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              {scheme === 'sunset' ? (
                                <>
                                  <div className="flex flex-col items-center">
                                    <div className="w-full h-6 rounded-md" style={{ backgroundColor: themeInfo.primaryColor }}></div>
                                    <span className="text-xs text-gray-400 mt-1">Primary</span>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <div className="w-full h-6 rounded-md" style={{ backgroundColor: '#fbbf24' }}></div>
                                    <span className="text-xs text-gray-400 mt-1">Secondary</span>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <div className="w-full h-6 rounded-md" style={{ backgroundColor: '#4691b1' }}></div>
                                    <span className="text-xs text-gray-400 mt-1">Accent</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex flex-col items-center">
                                    <div className="w-full h-6 rounded-md" style={{ backgroundColor: themeInfo.primaryColor }}></div>
                                    <span className="text-xs text-gray-400 mt-1">Primary</span>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <div className="w-full h-6 rounded-md" style={{ backgroundColor: themeInfo.primaryColor, opacity: 0.8 }}></div>
                                    <span className="text-xs text-gray-400 mt-1">Secondary</span>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <div className="w-full h-6 rounded-md" style={{ backgroundColor: themeInfo.primaryColor, opacity: 0.6 }}></div>
                                    <span className="text-xs text-gray-400 mt-1">Accent</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}

                    {/* Favorited Custom Theme Cards */}
                    {Object.entries(customThemes)
                      .filter(([_, theme]) => theme.isFavorite)
                      .sort(([, themeA], [, themeB]) => {

                        if (sortOrder === 'name') {
                          return themeA.name.localeCompare(themeB.name);
                        }


                        if (sortOrder === 'newest') {
                          const aTimestamp = themeA.history?.[0]?.timestamp || 0;
                          const bTimestamp = themeB.history?.[0]?.timestamp || 0;
                          return bTimestamp - aTimestamp;
                        }

                        return 0;
                      })
                      .map(([name, theme]) => (
                        <div
                          key={name}
                          className={`p-5 rounded-lg transition-all duration-200 cursor-pointer bg-gray-800/80 backdrop-blur-sm ${
                            activeCustomTheme === name
                              ? 'border-[3px] shadow-lg scale-[1.02]'
                              : 'border hover:border-opacity-70 hover:shadow-md hover:scale-[1.01]'
                          }`}
                          style={{
                            borderColor: theme.primaryColor,
                            opacity: activeCustomTheme === name ? 1 : 0.8
                          }}
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
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div
                                className="w-8 h-8 rounded-full mr-3 shadow-md"
                                style={{ backgroundColor: theme.primaryColor }}
                              ></div>
                              <h3 className="text-lg font-semibold text-white">{theme.name}</h3>
                            </div>
                            <button
                              className="text-yellow-400 hover:text-yellow-300 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(name);
                              }}
                              aria-label="Remove from favorites"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-gray-200 text-sm mb-4">Custom Theme</p>

                          {/* Color Preview */}
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="flex flex-col items-center">
                              <div className="w-full h-6 rounded-md" style={{ backgroundColor: theme.primaryColor }}></div>
                              <span className="text-xs text-gray-400 mt-1">Primary</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="w-full h-6 rounded-md" style={{ backgroundColor: theme.secondaryColor }}></div>
                              <span className="text-xs text-gray-400 mt-1">Secondary</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="w-full h-6 rounded-md" style={{ backgroundColor: theme.accentColor }}></div>
                              <span className="text-xs text-gray-400 mt-1">Accent</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}



            {activeTab === 'accessibility' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-theme-primary flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Accessibility Settings
                </h2>

                <div className="space-y-6">
                  {/* High Contrast Mode */}
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="high-contrast" className="text-lg font-medium text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-theme-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        High Contrast Mode
                      </label>
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                        <input
                          type="checkbox"
                          id="high-contrast"
                          className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white rounded-full appearance-none cursor-pointer peer border border-gray-300 checked:right-0 checked:border-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-primary"
                          checked={highContrastMode}
                          onChange={(e) => setHighContrastMode(e.target.checked)}
                        />
                        <label
                          htmlFor="high-contrast"
                          className="block h-full overflow-hidden rounded-full cursor-pointer bg-gray-700 peer-checked:bg-theme-primary"
                        ></label>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Increases contrast between elements for better visibility.
                    </p>
                  </div>

                  {/* Color Blindness Simulation */}
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-theme-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <label htmlFor="color-blindness" className="text-lg font-medium text-white">
                        Color Blindness Simulation
                      </label>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      Simulates how the website appears to users with different types of color blindness.
                    </p>
                    <select
                      id="color-blindness"
                      value={colorBlindnessSimulation}
                      onChange={(e) => setColorBlindnessSimulation(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-theme-primary"
                    >
                      <option value="none">No Color Blindness Simulation</option>
                      <option value="protanopia">Protanopia (Red-Blind)</option>
                      <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
                      <option value="tritanopia">Tritanopia (Blue-Blind)</option>
                    </select>
                  </div>

                  {/* Font Size */}
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-theme-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                      <label htmlFor="font-size" className="text-lg font-medium text-white">
                        Font Size
                      </label>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      Adjust the size of text throughout the website.
                    </p>
                    <select
                      id="font-size"
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-theme-primary"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium (Default)</option>
                      <option value="large">Large</option>
                      <option value="xl">Extra Large</option>
                    </select>
                  </div>

                  {/* Reduce Motion */}
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="reduce-motion" className="text-lg font-medium text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-theme-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Reduce Motion
                      </label>
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                        <input
                          type="checkbox"
                          id="reduce-motion"
                          className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white rounded-full appearance-none cursor-pointer peer border border-gray-300 checked:right-0 checked:border-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-primary"
                          checked={reduceMotion}
                          onChange={(e) => setReduceMotion(e.target.checked)}
                        />
                        <label
                          htmlFor="reduce-motion"
                          className="block h-full overflow-hidden rounded-full cursor-pointer bg-gray-700 peer-checked:bg-theme-primary"
                        ></label>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Minimizes animations for users who are sensitive to motion.
                    </p>
                  </div>

                  {/* Language */}
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-theme-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      <label htmlFor="language" className="text-lg font-medium text-white">
                        Language
                      </label>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      Select your preferred language for the website.
                    </p>
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-theme-primary"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="ja">日本語</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-2">
                      Language support is coming soon. This setting prepares your account for when it's available.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-theme-primary flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Account Settings
                </h2>

                <div className="bg-gray-800/50 p-6 rounded-lg mb-6 text-center">
                  <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Account Settings Coming Soon</h3>
                  <p className="text-gray-300 mb-4">
                    This feature is currently under development. Soon you'll be able to manage your account preferences,
                    connected services, and personalization options.
                  </p>
                  <div className="inline-flex items-center px-4 py-2 bg-gray-700 text-gray-300 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Under Development
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-theme-primary mb-3">Planned Features</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-300">Profile management</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-300">Connected Discord accounts</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-300">Notification preferences</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-300">Security settings</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-300">Data management</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-theme-primary mb-3">Stay Updated</h3>
                    <p className="text-gray-300 mb-4">
                      Want to be notified when account features are available? Join our Discord server for announcements.
                    </p>
                    <a
                      href="https://wrappedbot.com/support"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-theme-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                      </svg>
                      Join Discord
                    </a>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-theme-primary flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Theme Preview
                </h2>

                <div className="space-y-8">
                  {/* Typography Section */}
                  <div className="bg-gray-800/50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-theme-primary mb-4">Typography</h3>
                    <div className="space-y-4">
                      <div>
                        <h1 className="text-3xl font-bold text-white">Heading 1</h1>
                        <p className="text-gray-400 text-sm">Font size: 1.875rem (30px)</p>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Heading 2</h2>
                        <p className="text-gray-400 text-sm">Font size: 1.5rem (24px)</p>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">Heading 3</h3>
                        <p className="text-gray-400 text-sm">Font size: 1.25rem (20px)</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">Heading 4</h4>
                        <p className="text-gray-400 text-sm">Font size: 1.125rem (18px)</p>
                      </div>
                      <div>
                        <p className="text-base text-gray-200">Regular paragraph text</p>
                        <p className="text-gray-400 text-sm">Font size: 1rem (16px)</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">Small text</p>
                        <p className="text-gray-400 text-xs">Font size: 0.875rem (14px)</p>
                      </div>
                    </div>
                  </div>

                  {/* Colors Section */}
                  <div className="bg-gray-800/50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-theme-primary mb-4">Theme Colors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <div className="h-16 rounded-t-md flex items-center justify-center text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                          Primary
                        </div>
                        <div className="bg-gray-700 rounded-b-md p-2 text-center text-xs text-gray-300">
                          {theme.colorScheme === 'custom' && activeCustomTheme
                            ? customThemes[activeCustomTheme]?.primaryColor
                            : colorSchemeInfo[theme.colorScheme]?.primaryColor}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="h-16 rounded-t-md flex items-center justify-center text-white" style={{ backgroundColor: 'var(--color-secondary)' }}>
                          Secondary
                        </div>
                        <div className="bg-gray-700 rounded-b-md p-2 text-center text-xs text-gray-300">
                          {theme.colorScheme === 'custom' && activeCustomTheme
                            ? customThemes[activeCustomTheme]?.secondaryColor
                            : 'Derived from primary'}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="h-16 rounded-t-md flex items-center justify-center text-white" style={{ backgroundColor: 'var(--color-accent)' }}>
                          Accent
                        </div>
                        <div className="bg-gray-700 rounded-b-md p-2 text-center text-xs text-gray-300">
                          {theme.colorScheme === 'custom' && activeCustomTheme
                            ? customThemes[activeCustomTheme]?.accentColor
                            : 'Derived from primary'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buttons Section */}
                  <div className="bg-gray-800/50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-theme-primary mb-4">Buttons</h3>
                    <div className="flex flex-wrap gap-4">
                      <button className="px-4 py-2 bg-theme-primary text-white rounded-md hover:bg-opacity-90 transition-colors">
                        Primary Button
                      </button>
                      <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors">
                        Secondary Button
                      </button>
                      <button className="px-4 py-2 border border-theme-primary text-theme-primary rounded-md hover:bg-theme-primary hover:bg-opacity-10 transition-colors">
                        Outline Button
                      </button>
                      <button className="px-4 py-2 bg-theme-primary text-white rounded-md opacity-50 cursor-not-allowed">
                        Disabled Button
                      </button>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                        Danger Button
                      </button>
                      <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                        Success Button
                      </button>
                    </div>
                  </div>

                  {/* Form Elements Section */}
                  <div className="bg-gray-800/50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-theme-primary mb-4">Form Elements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Text Input</label>
                          <input
                            type="text"
                            placeholder="Enter text here"
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-theme-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Select Dropdown</label>
                          <select className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-theme-primary">
                            <option>Option 1</option>
                            <option>Option 2</option>
                            <option>Option 3</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Checkbox</label>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="preview-checkbox"
                              className="mr-3 h-4 w-4 rounded border-gray-600 text-theme-primary focus:ring-theme-primary"
                            />
                            <label htmlFor="preview-checkbox" className="text-white">Remember me</label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Radio Buttons</label>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="radio-1"
                                name="radio-group"
                                className="mr-3 h-4 w-4 border-gray-600 text-theme-primary focus:ring-theme-primary"
                                defaultChecked
                              />
                              <label htmlFor="radio-1" className="text-white">Option 1</label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="radio-2"
                                name="radio-group"
                                className="mr-3 h-4 w-4 border-gray-600 text-theme-primary focus:ring-theme-primary"
                              />
                              <label htmlFor="radio-2" className="text-white">Option 2</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cards Section */}
                  <div className="bg-gray-800/50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-theme-primary mb-4">Cards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                        <h5 className="text-theme-primary font-medium mb-2">Basic Card</h5>
                        <p className="text-gray-300 text-sm">This is a sample card with the current theme applied.</p>
                      </div>
                      <div className="bg-gray-900/80 p-4 rounded-lg border border-theme-primary">
                        <h5 className="text-theme-primary font-medium mb-2">Highlighted Card</h5>
                        <p className="text-gray-300 text-sm">This card has a themed border to make it stand out.</p>
                      </div>
                      <div className="bg-theme-primary bg-opacity-10 p-4 rounded-lg border border-theme-primary">
                        <h5 className="text-theme-primary font-medium mb-2">Filled Card</h5>
                        <p className="text-gray-300 text-sm">This card has a themed background with reduced opacity.</p>
                      </div>
                      <div className="bg-gray-900/80 p-4 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="text-theme-primary font-medium">Interactive Card</h5>
                          <button className="text-gray-400 hover:text-theme-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">This card has interactive elements.</p>
                        <button className="text-sm px-3 py-1 bg-theme-primary text-white rounded-md hover:bg-opacity-90">
                          Action
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Takes 1/3 of the space on large screens */}
        <div className="bg-gray-900/80 backdrop-blur-md rounded-lg shadow-lg p-6 h-fit border border-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-theme-primary flex items-center">
            {activeTab === 'themes' && (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Active Theme
              </>
            )}

            {activeTab === 'accessibility' && (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Accessibility Info
              </>
            )}
            {activeTab === 'account' && (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account Info
              </>
            )}
            {activeTab === 'preview' && (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Preview Info
              </>
            )}
          </h2>

          <p className="text-gray-300 mb-6">
            {activeTab === 'themes' && "Customize the look and feel of the website by selecting a theme or creating your own."}
            {activeTab === 'accessibility' && "Adjust settings to make the website more accessible based on your needs."}
            {activeTab === 'account' && "Manage your account settings and preferences."}
            {activeTab === 'preview' && "See how UI elements will look with your current theme settings."}
          </p>

          {/* Active Theme Info - Only shown in Themes tab */}
          {activeTab === 'themes' && (
            <>
              {theme.colorScheme === 'custom' && activeCustomTheme && customThemes[activeCustomTheme] ? (
                <div className="mb-6">
                  <div className="bg-gray-800/70 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-3">
                      <div
                        className="w-10 h-10 rounded-full mr-3 shadow-md"
                        style={{ backgroundColor: customThemes[activeCustomTheme]?.primaryColor }}
                      ></div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{customThemes[activeCustomTheme]?.name}</h3>
                        <p className="text-gray-400 text-sm">Custom Theme</p>
                      </div>
                    </div>

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

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Tooltip text="Edit this theme's colors and properties" position="top">
                        <button
                          className="w-full bg-gradient-to-r from-theme-primary to-theme-primary/80 hover:from-theme-primary/90 hover:to-theme-primary/70 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                          onClick={() => {

                            setNewThemeName(customThemes[activeCustomTheme].name);
                            setNewPrimaryColor(customThemes[activeCustomTheme].primaryColor);
                            setNewSecondaryColor(customThemes[activeCustomTheme].secondaryColor);
                            setNewAccentColor(customThemes[activeCustomTheme].accentColor);
                            setNewThemeCategory(customThemes[activeCustomTheme].category || 'primary');
                            setShowNewThemeForm(true);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Edit Colors
                        </button>
                      </Tooltip>
                      <Tooltip text="Permanently delete this theme" position="top">
                        <button
                          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Delete Theme',
                              message: `Are you sure you want to delete the "${customThemes[activeCustomTheme].name}" theme? This action cannot be undone.`,
                              isDangerous: true,
                              onConfirm: () => {

                                const updatedThemes = { ...customThemes };
                                delete updatedThemes[activeCustomTheme];


                                setCustomThemes(updatedThemes);
                                localStorage.setItem('customThemes', JSON.stringify(updatedThemes));


                                if (activeCustomTheme) {
                                  setActiveCustomTheme('');
                                  localStorage.removeItem('activeCustomTheme');
                                  setColorScheme('purple');
                                }
                              }
                            });
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </Tooltip>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Tooltip
                        text={
                          !customThemes[activeCustomTheme]?.history || customThemes[activeCustomTheme]?.history?.length <= 1
                            ? "No history available yet. Make changes to this theme to create history."
                            : "View and restore previous versions of this theme"
                        }
                        position="top"
                      >
                        <button
                          className={`w-full px-4 py-2 text-sm flex items-center justify-center rounded-md shadow-md transition-all duration-200 ${
                            !customThemes[activeCustomTheme]?.history || customThemes[activeCustomTheme]?.history?.length <= 1
                              ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white hover:shadow-lg cursor-pointer'
                          }`}
                          onClick={() => {
                            if (customThemes[activeCustomTheme]?.history && customThemes[activeCustomTheme]?.history!.length > 1) {
                              showThemeHistory(activeCustomTheme);
                            }
                          }}
                          disabled={!customThemes[activeCustomTheme]?.history || customThemes[activeCustomTheme]?.history?.length <= 1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          History
                        </button>
                      </Tooltip>
                      <Tooltip text="Copy a shareable link to this theme" position="top">
                        <button
                          className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                          onClick={() => shareTheme(activeCustomTheme, customThemes[activeCustomTheme])}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          Share
                        </button>
                      </Tooltip>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Tooltip text="Export this theme as a JSON file" position="top">
                        <button
                          className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
                          onClick={() => exportTheme(activeCustomTheme, customThemes[activeCustomTheme])}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Export
                        </button>
                      </Tooltip>
                      <Tooltip text="Import a theme from a JSON file" position="top">
                        <label className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          Import
                          <input
                            type="file"
                            accept=".json"
                            className="hidden"
                            onChange={importTheme}
                          />
                        </label>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="bg-gray-800/70 rounded-lg p-4 mb-4">
                    {theme.colorScheme !== 'custom' && colorSchemeInfo[theme.colorScheme] && (
                      <>
                        <div className="flex items-center mb-3">
                          <div
                            className="w-10 h-10 rounded-full mr-3 shadow-md"
                            style={{ backgroundColor: colorSchemeInfo[theme.colorScheme]?.primaryColor }}
                          ></div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{colorSchemeInfo[theme.colorScheme]?.name}</h3>
                            <p className="text-gray-400 text-sm">{colorSchemeInfo[theme.colorScheme]?.description}</p>
                          </div>
                        </div>

                        <div className="mt-3 flex space-x-2">
                          <div className={`h-2 flex-grow rounded-full opacity-100`} style={{ backgroundColor: colorSchemeInfo[theme.colorScheme]?.primaryColor }}></div>
                          <div className={`h-2 flex-grow rounded-full opacity-75`} style={{ backgroundColor: colorSchemeInfo[theme.colorScheme]?.primaryColor }}></div>
                          <div className={`h-2 flex-grow rounded-full opacity-50`} style={{ backgroundColor: colorSchemeInfo[theme.colorScheme]?.primaryColor }}></div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Custom Theme Management */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-theme-primary mb-3">Custom Themes</h3>
                <div className="bg-gray-800/70 rounded-lg p-4">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-300">Manage your custom themes</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <Tooltip text="Export all custom themes to a single file" position="top">
                        <button
                          className={`w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2.5 rounded-md text-sm flex items-center justify-center shadow-md transition-all duration-200 ${
                            Object.keys(customThemes).length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                          }`}
                          onClick={exportCustomThemes}
                          disabled={Object.keys(customThemes).length === 0}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          Export All Themes
                        </button>
                      </Tooltip>
                      <Tooltip text="Import themes from a file" position="top">
                        <label className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2.5 rounded-md text-sm flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          Import Themes
                          <input
                            type="file"
                            accept=".json"
                            className="hidden"
                            onChange={importCustomThemes}
                          />
                        </label>
                      </Tooltip>
                    </div>
                    <div className="border-t border-gray-700 pt-3">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">Your Custom Themes</h4>
                    </div>
                  </div>

                  {Object.keys(customThemes).length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                      {Object.entries(customThemes).map(([name, theme]) => (
                        <div
                          key={name}
                          className={`p-2 rounded-md bg-gray-700/80 flex justify-between items-center cursor-pointer hover:bg-gray-600/80 transition-colors ${
                            activeCustomTheme === name ? 'border-l-4 border-theme-primary' : ''
                          }`}
                          onClick={() => applyCustomThemeByName(name)}
                        >
                          <div className="flex items-center">
                            <div className="flex space-x-1 mr-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.secondaryColor }}></div>
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accentColor }}></div>
                            </div>
                            <span className="text-white text-sm truncate max-w-[120px]">{theme.name}</span>
                          </div>
                          <div className="flex space-x-1">
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
                  ) : (
                    <div className="bg-gray-800/50 rounded-lg border border-dashed border-gray-700 p-6 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      <p className="text-gray-400 text-sm mb-2">No custom themes yet.</p>
                      <p className="text-gray-500 text-xs">Create a custom theme or import one to get started!</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Accessibility Info - Only shown in Accessibility tab */}
          {activeTab === 'accessibility' && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-theme-primary mb-3">Accessibility Tips</h3>
              <div className="bg-gray-800/70 rounded-lg p-4">
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-theme-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>High Contrast Mode enhances visibility by increasing contrast between elements.</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-theme-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Color Blindness Simulation helps you see how the site appears to users with different types of color blindness.</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-theme-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Reduce Motion minimizes animations for users who are sensitive to motion.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Account Info - Only shown in Account tab */}
          {activeTab === 'account' && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-theme-primary mb-3">Account Status</h3>
              <div className="bg-gray-800/70 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-3">
                  Account settings are coming soon. You'll be able to manage your preferences and connected accounts here.
                </p>
                <div className="flex items-center text-gray-400 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>This feature is under development.</span>
                </div>
              </div>
            </div>
          )}

          {/* Preview Info - Only shown in Preview tab */}
          {activeTab === 'preview' && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-theme-primary mb-3">Preview Info</h3>
              <div className="bg-gray-800/70 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-3">
                  The preview tab shows how UI elements will look with your current theme settings.
                </p>
                <p className="text-gray-300 text-sm">
                  This helps you see how your selected theme affects different parts of the interface.
                </p>
              </div>
            </div>
          )}

          <div className="border-t border-gray-700 my-6 pt-6">
            <p className="text-gray-400 text-sm">
              Settings are automatically saved as you make changes.
            </p>
          </div>
        </div>
      </div>

      {/* Custom Alert Dialog */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
        title={alertDialog.title}
        message={alertDialog.message}
      />

      {/* Custom Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        isDangerous={confirmDialog.isDangerous}
      />
    </div>
  );
};

export default NewSettings;
