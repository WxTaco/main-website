import { Palette } from 'lucide-react'
import ToolLayout from '@/components/tools/ToolLayout'
import ColorPaletteGenerator from '@/components/tools/ColorPaletteGenerator'

const ColorPalettePage = () => {
  return (
    <ToolLayout
      title="Color Palette Generator"
      description="Generate beautiful, harmonious color palettes using color theory principles. Perfect for designers and developers creating cohesive color schemes."
      icon={<Palette className="w-12 h-12" />}
      category="Design"
    >
      <ColorPaletteGenerator />
    </ToolLayout>
  )
}

export default ColorPalettePage
