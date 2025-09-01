import { useState } from 'react'
import { Theme, ThemeColors } from '@/types/theme'
import { useTheme } from '@/contexts/ThemeContext'

interface ThemeCreatorProps {
  onClose: () => void
}

const ThemeCreator = ({ onClose }: ThemeCreatorProps) => {
  const { addCustomTheme } = useTheme()
  const [customTheme, setCustomTheme] = useState<Partial<Theme>>({
    name: '',
    colors: {
      primary: '#ec4899',
      secondary: '#f472b6',
      accent: '#3b82f6',
      background: {
        start: '#0f172a',
        end: '#1e293b'
      },
      text: {
        primary: '#ffffff',
        secondary: '#d1d5db',
        muted: '#9ca3af'
      },
      card: {
        background: 'rgba(17, 24, 39, 0.6)',
        border: 'rgba(75, 85, 99, 0.5)'
      },
      button: {
        primary: '#ec4899',
        secondary: 'rgba(75, 85, 99, 0.8)'
      }
    }
  })

  const handleSubmit = () => {
    if (!customTheme.name || !customTheme.colors) return
    
    const newTheme: Theme = {
      id: `custom-${Date.now()}`,
      name: customTheme.name,
      colors: customTheme.colors as ThemeColors
    }
    
    addCustomTheme(newTheme)
    onClose()
  }

  return (
    <div className="space-y-6">
      {/* Theme Name */}
      <div>
        <label className="block text-sm font-medium mb-2">Theme Name</label>
        <input
          type="text"
          value={customTheme.name}
          onChange={(e) => setCustomTheme({ ...customTheme, name: e.target.value })}
          className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20"
          placeholder="My Custom Theme"
        />
      </div>

      <div className="space-y-8">
        {/* Color Controls */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Colors</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={customTheme.colors?.primary}
                  onChange={(e) => setCustomTheme({
                    ...customTheme,
                    colors: { ...customTheme.colors!, primary: e.target.value }
                  })}
                  className="w-12 h-12 rounded-lg border border-gray-700 cursor-pointer flex-shrink-0"
                />
                <input
                  type="text"
                  value={customTheme.colors?.primary}
                  onChange={(e) => setCustomTheme({
                    ...customTheme,
                    colors: { ...customTheme.colors!, primary: e.target.value }
                  })}
                  className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white font-mono text-sm min-w-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Secondary Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={customTheme.colors?.secondary}
                  onChange={(e) => setCustomTheme({
                    ...customTheme,
                    colors: { ...customTheme.colors!, secondary: e.target.value }
                  })}
                  className="w-12 h-12 rounded-lg border border-gray-700 cursor-pointer flex-shrink-0"
                />
                <input
                  type="text"
                  value={customTheme.colors?.secondary}
                  onChange={(e) => setCustomTheme({
                    ...customTheme,
                    colors: { ...customTheme.colors!, secondary: e.target.value }
                  })}
                  className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white font-mono text-sm min-w-0"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Accent Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={customTheme.colors?.accent}
                onChange={(e) => setCustomTheme({
                  ...customTheme,
                  colors: { ...customTheme.colors!, accent: e.target.value }
                })}
                className="w-12 h-12 rounded-lg border border-gray-700 cursor-pointer flex-shrink-0"
              />
              <input
                type="text"
                value={customTheme.colors?.accent}
                onChange={(e) => setCustomTheme({
                  ...customTheme,
                  colors: { ...customTheme.colors!, accent: e.target.value }
                })}
                className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white font-mono text-sm min-w-0"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Background Start</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={customTheme.colors?.background?.start}
                  onChange={(e) => setCustomTheme({
                    ...customTheme,
                    colors: {
                      ...customTheme.colors!,
                      background: {
                        ...customTheme.colors!.background,
                        start: e.target.value
                      }
                    }
                  })}
                  className="w-12 h-12 rounded-lg border border-gray-700 cursor-pointer flex-shrink-0"
                />
                <input
                  type="text"
                  value={customTheme.colors?.background?.start}
                  onChange={(e) => setCustomTheme({
                    ...customTheme,
                    colors: {
                      ...customTheme.colors!,
                      background: {
                        ...customTheme.colors!.background,
                        start: e.target.value
                      }
                    }
                  })}
                  className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white font-mono text-sm min-w-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Background End</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={customTheme.colors?.background?.end}
                  onChange={(e) => setCustomTheme({
                    ...customTheme,
                    colors: {
                      ...customTheme.colors!,
                      background: {
                        ...customTheme.colors!.background,
                        end: e.target.value
                      }
                    }
                  })}
                  className="w-12 h-12 rounded-lg border border-gray-700 cursor-pointer flex-shrink-0"
                />
                <input
                  type="text"
                  value={customTheme.colors?.background?.end}
                  onChange={(e) => setCustomTheme({
                    ...customTheme,
                    colors: {
                      ...customTheme.colors!,
                      background: {
                        ...customTheme.colors!.background,
                        end: e.target.value
                      }
                    }
                  })}
                  className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white font-mono text-sm min-w-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Preview</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">Background Gradient</label>
            <div 
              className="w-full h-32 rounded-lg border-2 border-gray-600"
              style={{
                background: `linear-gradient(135deg, ${customTheme.colors?.background?.start}, ${customTheme.colors?.background?.end})`
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color Palette</label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="text-center">
                <div
                  className="w-full h-12 sm:h-16 rounded-lg mb-2 border border-gray-600"
                  style={{ backgroundColor: customTheme.colors?.primary }}
                />
                <p className="text-xs text-gray-400">Primary</p>
              </div>
              <div className="text-center">
                <div
                  className="w-full h-12 sm:h-16 rounded-lg mb-2 border border-gray-600"
                  style={{ backgroundColor: customTheme.colors?.secondary }}
                />
                <p className="text-xs text-gray-400">Secondary</p>
              </div>
              <div className="text-center">
                <div
                  className="w-full h-12 sm:h-16 rounded-lg mb-2 border border-gray-600"
                  style={{ backgroundColor: customTheme.colors?.accent }}
                />
                <p className="text-xs text-gray-400">Accent</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sample Card</label>
            <div 
              className="p-4 rounded-lg border"
              style={{
                background: customTheme.colors?.card?.background,
                borderColor: customTheme.colors?.card?.border
              }}
            >
              <h4 className="font-semibold mb-2" style={{ color: customTheme.colors?.text?.primary }}>
                Sample Card
              </h4>
              <p className="text-sm mb-3" style={{ color: customTheme.colors?.text?.secondary }}>
                This is how your theme will look on cards and content areas.
              </p>
              <button 
                className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                style={{ backgroundColor: customTheme.colors?.primary }}
              >
                Sample Button
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-700/50">
        <button
          onClick={onClose}
          className="btn-secondary order-2 sm:order-1"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!customTheme.name}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
        >
          Create Theme
        </button>
      </div>
    </div>
  )
}

export default ThemeCreator
