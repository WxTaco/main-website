import { Clock } from 'lucide-react'
import ToolLayout from '@/components/tools/ToolLayout'

const TimestampConverterPage = () => {
  return (
    <ToolLayout
      title="Timestamp Converter"
      description="Convert between Unix timestamps and human-readable dates with timezone support."
      icon={<Clock className="w-12 h-12" />}
      category="Development"
    >
      <div className="card text-center py-16">
        <Clock className="w-16 h-16 text-accent-400 mx-auto mb-6" />
        <h3 className="text-2xl font-semibold mb-4">Timestamp Converter</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          This development tool is currently under development. Check back soon for comprehensive timestamp conversion!
        </p>
        <div className="space-y-4">
          <div className="text-sm text-gray-500">Coming features:</div>
          <div className="flex flex-wrap justify-center gap-2">
            {['Unix Timestamps', 'ISO 8601', 'Timezone Support', 'Batch Conversion', 'Current Time', 'Format Options'].map((feature) => (
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

export default TimestampConverterPage
