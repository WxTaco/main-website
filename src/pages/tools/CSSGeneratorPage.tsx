import { Wrench } from 'lucide-react'
import ToolLayout from '@/components/tools/ToolLayout'

const CSSGeneratorPage = () => {
  return (
    <ToolLayout
      title="CSS Generator"
      description="Generate CSS code for gradients, shadows, animations, and more with visual editors and live preview."
      icon={<Wrench className="w-12 h-12" />}
      category="Development"
    >
      <div className="card text-center py-16">
        <Wrench className="w-16 h-16 text-accent-400 mx-auto mb-6" />
        <h3 className="text-2xl font-semibold mb-4">CSS Generator</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          This tool is currently under development. Check back soon for a powerful CSS generation toolkit!
        </p>
        <div className="space-y-4">
          <div className="text-sm text-gray-500">Coming features:</div>
          <div className="flex flex-wrap justify-center gap-2">
            {['Gradient Generator', 'Box Shadow', 'Border Radius', 'Flexbox Helper', 'Grid Generator', 'Animation Builder'].map((feature) => (
              <span key={feature} className="bg-gray-800/50 text-gray-400 px-3 py-1 rounded-full text-sm">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}

export default CSSGeneratorPage
