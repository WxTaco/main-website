import React from 'react';
import { useTheme, colorSchemeInfo } from '../contexts/ThemeContext';
import type { ColorScheme, ThemeCategory } from '../contexts/ThemeContext';

const Settings = () => {
  const { theme, setColorScheme } = useTheme();

  // Group themes by category
  const getThemesByCategory = () => {
    const categories: Record<ThemeCategory, ColorScheme[]> = {
      'Featured': [],
      'Vibrant': [],
      'Cool': [],
      'Warm': [],
      'Earthy': [],
      'Pastel': []
    };

    (Object.keys(colorSchemeInfo) as ColorScheme[]).forEach(scheme => {
      const category = colorSchemeInfo[scheme].category as ThemeCategory;
      categories[category].push(scheme);
    });

    return categories;
  };

  const themesByCategory = getThemesByCategory();

  return (
    <div className="min-h-screen w-full themed-gradient-bg flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-3xl w-full themed-container">
        <h1 className="themed-title mb-6">Site Settings</h1>

        {/* Theme Selection Introduction */}
        <div className="mb-8">
          <p className="text-lg text-white mb-4">
            Choose from a variety of color themes to personalize your experience.
            Your selection will be saved automatically and applied across the entire website.
          </p>
        </div>

        {/* Color Scheme Selection */}
        <div>
          <h2 className="themed-subtitle">Color Schemes</h2>

          {/* Display themes by category */}
          {(Object.keys(themesByCategory) as ThemeCategory[]).map((category) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-semibold text-theme-primary mb-4">{category} Themes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {themesByCategory[category].map((scheme) => (
                  <div
                    key={scheme}
                    className={`p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                      theme.colorScheme === scheme
                        ? 'border-[3px] shadow-lg scale-[1.03]'
                        : 'border-2 hover:border-opacity-70'
                    }`}
                    style={{
                      borderColor: colorSchemeInfo[scheme].primaryColor,
                      opacity: theme.colorScheme === scheme ? 1 : 0.4
                    }}
                    onClick={() => setColorScheme(scheme)}
                  >
                    <div className="flex items-center mb-3">
                      <div 
                        className="w-6 h-6 rounded-full mr-3" 
                        style={{ backgroundColor: colorSchemeInfo[scheme].primaryColor }}
                      ></div>
                      <h3 className="text-lg font-semibold text-white">{colorSchemeInfo[scheme].name}</h3>
                    </div>
                    <p className="text-gray-200 text-sm">{colorSchemeInfo[scheme].description}</p>

                    {/* Preview Bar */}
                    <div className="mt-3 flex space-x-2">
                      <div className={`h-2 flex-grow rounded-full opacity-100`} style={{ backgroundColor: colorSchemeInfo[scheme].primaryColor }}></div>
                      <div className={`h-2 flex-grow rounded-full opacity-75`} style={{ backgroundColor: colorSchemeInfo[scheme].primaryColor }}></div>
                      <div className={`h-2 flex-grow rounded-full opacity-50`} style={{ backgroundColor: colorSchemeInfo[scheme].primaryColor }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">About Theme Settings</h3>
          <p className="text-blue-700 text-sm">
            Your theme preferences are saved automatically and will persist across visits.
            The settings are stored in cookies on your device.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;


