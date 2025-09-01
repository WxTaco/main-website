import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Download, Palette } from 'lucide-react'

const ColorPaletteGenerator = () => {
  const [baseColor, setBaseColor] = useState('#3B82F6')
  const [paletteType, setPaletteType] = useState('complementary')
  const [palette, setPalette] = useState<string[]>([])

  const paletteTypes = [
    { id: 'complementary', name: 'Complementary', description: 'Colors opposite on the color wheel' },
    { id: 'triadic', name: 'Triadic', description: 'Three evenly spaced colors' },
    { id: 'analogous', name: 'Analogous', description: 'Adjacent colors on the wheel' },
    { id: 'monochromatic', name: 'Monochromatic', description: 'Variations of a single hue' },
    { id: 'split-complementary', name: 'Split Complementary', description: 'Base color plus two adjacent to its complement' }
  ]

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return [h * 360, s * 100, l * 100]
  }

  const hslToHex = (h: number, s: number, l: number) => {
    h /= 360; s /= 100; l /= 100
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => {
      const k = (n + h * 12) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color).toString(16).padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }

  const generatePalette = () => {
    const [h, s, l] = hexToHsl(baseColor)
    let colors: string[] = [baseColor]

    switch (paletteType) {
      case 'complementary':
        colors.push(hslToHex((h + 180) % 360, s, l))
        colors.push(hslToHex(h, s * 0.7, l * 1.2))
        colors.push(hslToHex((h + 180) % 360, s * 0.7, l * 1.2))
        colors.push(hslToHex(h, s * 0.5, l * 0.8))
        break
      case 'triadic':
        colors.push(hslToHex((h + 120) % 360, s, l))
        colors.push(hslToHex((h + 240) % 360, s, l))
        colors.push(hslToHex(h, s * 0.7, l * 1.2))
        colors.push(hslToHex((h + 120) % 360, s * 0.7, l * 1.2))
        break
      case 'analogous':
        colors.push(hslToHex((h + 30) % 360, s, l))
        colors.push(hslToHex((h - 30 + 360) % 360, s, l))
        colors.push(hslToHex((h + 60) % 360, s * 0.8, l))
        colors.push(hslToHex((h - 60 + 360) % 360, s * 0.8, l))
        break
      case 'monochromatic':
        colors.push(hslToHex(h, s, Math.min(l * 1.3, 90)))
        colors.push(hslToHex(h, s, Math.max(l * 0.7, 10)))
        colors.push(hslToHex(h, s * 0.6, l))
        colors.push(hslToHex(h, s * 1.2, l))
        break
      case 'split-complementary':
        colors.push(hslToHex((h + 150) % 360, s, l))
        colors.push(hslToHex((h + 210) % 360, s, l))
        colors.push(hslToHex(h, s * 0.7, l * 1.2))
        colors.push(hslToHex((h + 180) % 360, s * 0.5, l * 0.8))
        break
    }

    setPalette(colors)
  }

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color)
  }

  const copyPalette = () => {
    navigator.clipboard.writeText(palette.join(', '))
  }

  const downloadPalette = () => {
    const data = {
      baseColor,
      type: paletteType,
      colors: palette,
      generated: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `color-palette-${paletteType}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-6">Base Color</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-16 h-16 rounded-lg border-2 border-gray-700 cursor-pointer"
              />
              <div>
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2 text-white font-mono"
                  placeholder="#3B82F6"
                />
                <p className="text-sm text-gray-400 mt-1">Enter hex color code</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="card"
        >
          <h3 className="text-lg font-semibold mb-6">Palette Type</h3>
          <div className="space-y-3">
            {paletteTypes.map((type) => (
              <label key={type.id} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paletteType"
                  value={type.id}
                  checked={paletteType === type.id}
                  onChange={(e) => setPaletteType(e.target.value)}
                  className="mt-1 text-accent-500"
                />
                <div>
                  <div className="font-medium">{type.name}</div>
                  <div className="text-sm text-gray-400">{type.description}</div>
                </div>
              </label>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Generate Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center mb-12"
      >
        <button onClick={generatePalette} className="btn-primary text-lg px-8 py-4">
          <Palette className="w-5 h-5 mr-2" />
          Generate Palette
        </button>
      </motion.div>

      {/* Palette Display */}
      {palette.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Generated Palette</h3>
            <div className="flex items-center space-x-2">
              <button onClick={copyPalette} className="btn-secondary p-2">
                <Copy className="w-4 h-4" />
              </button>
              <button onClick={downloadPalette} className="btn-secondary p-2">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {palette.map((color, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => copyColor(color)}
              >
                <div
                  className="w-full h-24 rounded-lg mb-3 border-2 border-gray-700 group-hover:border-gray-500 transition-colors duration-200"
                  style={{ backgroundColor: color }}
                />
                <div className="text-center">
                  <div className="font-mono text-sm text-gray-300 group-hover:text-white transition-colors duration-200">
                    {color}
                  </div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-200">
                    Click to copy
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ColorPaletteGenerator
