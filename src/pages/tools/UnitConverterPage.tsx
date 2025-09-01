import { Calculator } from 'lucide-react'
import ToolLayout from '@/components/tools/ToolLayout'

const UnitConverterPage = () => {
  return (
    <ToolLayout
      title="Unit Converter"
      description="Convert between different units of measurement with precision across multiple categories."
      icon={<Calculator className="w-12 h-12" />}
      category="Utility"
    >
      <div className="card text-center py-16">
        <Calculator className="w-16 h-16 text-accent-400 mx-auto mb-6" />
        <h3 className="text-2xl font-semibold mb-4">Unit Converter</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          This utility tool is currently under development. Check back soon for comprehensive unit conversion!
        </p>
        <div className="space-y-4">
          <div className="text-sm text-gray-500">Coming features:</div>
          <div className="flex flex-wrap justify-center gap-2">
            {['Length', 'Weight', 'Temperature', 'Volume', 'Area', 'Speed', 'Energy', 'Pressure'].map((feature) => (
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

export default UnitConverterPage
