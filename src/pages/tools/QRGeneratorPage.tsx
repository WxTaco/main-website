import { QrCode } from 'lucide-react'
import ToolLayout from '@/components/tools/ToolLayout'

const QRGeneratorPage = () => {
  return (
    <ToolLayout
      title="QR Code Generator"
      description="Generate customizable QR codes for URLs, text, and contact information with styling options."
      icon={<QrCode className="w-12 h-12" />}
      category="Utility"
    >
      <div className="card text-center py-16">
        <QrCode className="w-16 h-16 text-accent-400 mx-auto mb-6" />
        <h3 className="text-2xl font-semibold mb-4">QR Code Generator</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          This utility tool is currently under development. Check back soon for advanced QR code generation!
        </p>
        <div className="space-y-4">
          <div className="text-sm text-gray-500">Coming features:</div>
          <div className="flex flex-wrap justify-center gap-2">
            {['Custom Colors', 'Logo Embedding', 'Multiple Formats', 'Batch Generation', 'Error Correction', 'Analytics'].map((feature) => (
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

export default QRGeneratorPage
