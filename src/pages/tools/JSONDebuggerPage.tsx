import { Code } from 'lucide-react'
import ToolLayout from '@/components/tools/ToolLayout'
import JSONDebugger from '@/components/tools/JSONDebugger'

const JSONDebuggerPage = () => {
  return (
    <ToolLayout
      title="JSON Debugger"
      description="Validate, format, and debug JSON with syntax highlighting and error detection. Perfect for API development and data validation."
      icon={<Code className="w-12 h-12" />}
      category="Development"
    >
      <JSONDebugger />
    </ToolLayout>
  )
}

export default JSONDebuggerPage
