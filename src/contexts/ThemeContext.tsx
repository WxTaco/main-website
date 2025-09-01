import React, { createContext, useContext, useEffect, useState } from 'react'
import { Theme, defaultThemes } from '@/types/theme'

interface ThemeContextType {
  currentTheme: Theme
  setTheme: (theme: Theme) => void
  themes: Theme[]
  addCustomTheme: (theme: Theme) => void
  removeCustomTheme: (themeId: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultThemes[0])
  const [customThemes, setCustomThemes] = useState<Theme[]>([])

  // Load theme from cookies on mount
  useEffect(() => {
    const savedThemeId = document.cookie
      .split('; ')
      .find(row => row.startsWith('wrapped-theme='))
      ?.split('=')[1]

    const savedCustomThemes = document.cookie
      .split('; ')
      .find(row => row.startsWith('wrapped-custom-themes='))
      ?.split('=')[1]

    if (savedCustomThemes) {
      try {
        const parsed = JSON.parse(decodeURIComponent(savedCustomThemes))
        setCustomThemes(parsed)
      } catch (error) {
        console.error('Failed to parse custom themes from cookies:', error)
      }
    }

    if (savedThemeId) {
      const allThemes = [...defaultThemes, ...customThemes]
      const savedTheme = allThemes.find(theme => theme.id === savedThemeId)
      if (savedTheme) {
        setCurrentTheme(savedTheme)
      }
    }
  }, [customThemes])

  // Apply theme CSS variables
  useEffect(() => {
    const root = document.documentElement
    const { colors } = currentTheme

    // Set CSS custom properties
    root.style.setProperty('--color-primary', colors.primary)
    root.style.setProperty('--color-secondary', colors.secondary)
    root.style.setProperty('--color-accent', colors.accent)
    root.style.setProperty('--color-bg-start', colors.background.start)
    root.style.setProperty('--color-bg-end', colors.background.end)
    root.style.setProperty('--color-text-primary', colors.text.primary)
    root.style.setProperty('--color-text-secondary', colors.text.secondary)
    root.style.setProperty('--color-text-muted', colors.text.muted)
    root.style.setProperty('--color-card-bg', colors.card.background)
    root.style.setProperty('--color-card-border', colors.card.border)
    root.style.setProperty('--color-btn-primary', colors.button.primary)
    root.style.setProperty('--color-btn-secondary', colors.button.secondary)

    // Update body background
    document.body.style.background = `linear-gradient(135deg, ${colors.background.start} 0%, ${colors.background.end} 100%)`
    document.body.style.minHeight = '100vh'
  }, [currentTheme])

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme)
    // Save to cookies (expires in 1 year)
    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + 1)
    document.cookie = `wrapped-theme=${theme.id}; expires=${expires.toUTCString()}; path=/`
  }

  const addCustomTheme = (theme: Theme) => {
    const newCustomThemes = [...customThemes, theme]
    setCustomThemes(newCustomThemes)
    
    // Save to cookies
    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + 1)
    document.cookie = `wrapped-custom-themes=${encodeURIComponent(JSON.stringify(newCustomThemes))}; expires=${expires.toUTCString()}; path=/`
  }

  const removeCustomTheme = (themeId: string) => {
    const newCustomThemes = customThemes.filter(theme => theme.id !== themeId)
    setCustomThemes(newCustomThemes)
    
    // Update cookies
    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + 1)
    document.cookie = `wrapped-custom-themes=${encodeURIComponent(JSON.stringify(newCustomThemes))}; expires=${expires.toUTCString()}; path=/`
    
    // If current theme was removed, switch to default
    if (currentTheme.id === themeId) {
      setTheme(defaultThemes[0])
    }
  }

  const allThemes = [...defaultThemes, ...customThemes]

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        themes: allThemes,
        addCustomTheme,
        removeCustomTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
