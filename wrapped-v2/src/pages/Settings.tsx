import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTheme } from '../contexts/ThemeContext';
import type { ColorScheme, ThemeCategory } from '../types/theme';

const Settings: React.FC = () => {
  const { theme, setColorScheme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<ThemeCategory>('primary');

  // Theme information
  const colorSchemeInfo: Record<ColorScheme, {
    name: string;
    description: string;
    primaryColor: string;
    previewClass: string;
    category: ThemeCategory;
  }> = {
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
    slate: {
      name: 'Slate',
      description: 'Professional and neutral',
      primaryColor: '#64748B',
      previewClass: 'bg-slate-500',
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
    }
  };

  // Group themes by category
  const themesByCategory: Record<ThemeCategory, ColorScheme[]> = {
    primary: ['pink'],
    cool: ['blue', 'purple', 'teal', 'indigo', 'slate', 'sky'],
    warm: ['red', 'orange', 'rose', 'amber'],
    nature: ['green', 'lime'],
    vibrant: ['cyberpunk', 'fuchsia']
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-theme-primary">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Theme Settings */}
        <div className="md:col-span-2">
          <div className="bg-theme-card dark:bg-dark-card rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-theme-primary">Theme</h2>
            
            {/* Theme Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {(Object.keys(categoryLabels) as ThemeCategory[]).map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    activeCategory === category
                      ? 'bg-theme-primary text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>
            
            {/* Theme Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {themesByCategory[activeCategory].map((scheme) => (
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
        </div>

        {/* Account Settings */}
        <div className="bg-theme-card dark:bg-dark-card rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-2xl font-bold mb-4 text-theme-primary">Account</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Account settings are coming soon. You'll be able to manage your preferences and connected accounts here.
          </p>
          <button
            className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-md cursor-not-allowed"
            disabled
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;








