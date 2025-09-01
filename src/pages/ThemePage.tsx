import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { Theme } from '@/types/theme'
import { Plus, Trash2, Download, Upload, Check } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import ThemeCreator from '@/components/themes/ThemeCreator'

const ThemePage = () => {
  const { currentTheme, setTheme, themes, removeCustomTheme } = useTheme()
  const [showThemeCreator, setShowThemeCreator] = useState(false)

  const exportTheme = (theme: Theme) => {
    const dataStr = JSON.stringify(theme, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${theme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const { addCustomTheme } = useTheme()

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const theme = JSON.parse(e.target?.result as string) as Theme
        theme.id = `imported-${Date.now()}`
        addCustomTheme(theme)
      } catch (error) {
        alert('Invalid theme file')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="pt-16">
      <div className="section-padding">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Theme</span> Customization
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Personalize your Wrapped experience with custom themes and color schemes
            </p>
          </motion.div>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-max">
          <div className="section-container p-8">
            {/* Current Theme Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="content-container-light mb-12"
            >
            <h2 className="text-2xl font-bold mb-6">Current Theme: {currentTheme.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-gray-600"
                  style={{ backgroundColor: currentTheme.colors.primary }}
                />
                <p className="text-sm text-gray-400">Primary</p>
              </div>
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-gray-600"
                  style={{ backgroundColor: currentTheme.colors.secondary }}
                />
                <p className="text-sm text-gray-400">Secondary</p>
              </div>
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-gray-600"
                  style={{ backgroundColor: currentTheme.colors.accent }}
                />
                <p className="text-sm text-gray-400">Accent</p>
              </div>
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-gray-600"
                  style={{ 
                    background: `linear-gradient(135deg, ${currentTheme.colors.background.start}, ${currentTheme.colors.background.end})`
                  }}
                />
                <p className="text-sm text-gray-400">Background</p>
              </div>
            </div>
          </motion.div>

            {/* Theme Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-12"
            >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
              <h2 className="text-xl md:text-2xl font-bold">Available Themes</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <label className="btn-secondary cursor-pointer text-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Theme
                  <input
                    type="file"
                    accept=".json"
                    onChange={importTheme}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => setShowThemeCreator(true)}
                  className="btn-primary text-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Custom Theme
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme, index) => (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`card cursor-pointer relative ${
                    currentTheme.id === theme.id ? 'ring-2 ring-offset-2 ring-offset-transparent' : ''
                  }`}
                  style={currentTheme.id === theme.id ? {
                    '--tw-ring-color': theme.colors.primary
                  } as React.CSSProperties : {}}
                  onClick={() => setTheme(theme)}
                >
                  {currentTheme.id === theme.id && (
                    <div className="absolute top-4 right-4">
                      <Check className="w-5 h-5 text-green-400" />
                    </div>
                  )}
                  
                  <h3 className="text-lg font-semibold mb-4">{theme.name}</h3>
                  
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div 
                      className="w-full h-8 rounded"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div 
                      className="w-full h-8 rounded"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div 
                      className="w-full h-8 rounded"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                    <div 
                      className="w-full h-8 rounded"
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.colors.background.start}, ${theme.colors.background.end})`
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        exportTheme(theme)
                      }}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    
                    {theme.id.startsWith('custom-') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeCustomTheme(theme.id)
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          </div>
        </div>
      </section>

      {/* Theme Creator Modal */}
      <Modal
        isOpen={showThemeCreator}
        onClose={() => setShowThemeCreator(false)}
        title="Create Custom Theme"
        size="xl"
      >
        <ThemeCreator onClose={() => setShowThemeCreator(false)} />
      </Modal>
    </div>
  )
}

export default ThemePage
