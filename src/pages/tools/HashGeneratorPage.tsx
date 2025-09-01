import { Hash } from 'lucide-react'
import ToolLayout from '@/components/tools/ToolLayout'

const HashGeneratorPage = () => {
  return (
    <ToolLayout
      title="Hash Generator"
      description="Generate MD5, SHA-1, SHA-256 and other hash values for text and files with comparison tools."
      icon={<Hash className="w-12 h-12" />}
      category="Security"
    >
      <div className="card text-center py-16">
        <Hash className="w-16 h-16 text-accent-400 mx-auto mb-6" />
        <h3 className="text-2xl font-semibold mb-4">Hash Generator</h3>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          This security tool is currently under development. Check back soon for comprehensive hash generation!
        </p>
        <div className="space-y-4">
          <div className="text-sm text-gray-500">Coming features:</div>
          <div className="flex flex-wrap justify-center gap-2">
            {['MD5', 'SHA-1', 'SHA-256', 'SHA-512', 'File Hashing', 'Hash Comparison'].map((feature) => (
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

export default HashGeneratorPage
