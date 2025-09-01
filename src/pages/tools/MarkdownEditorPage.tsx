import { FileText } from 'lucide-react'
import ToolLayout from '@/components/tools/ToolLayout'
import MarkdownEditor from '@/components/tools/MarkdownEditor'

const MarkdownEditorPage = () => {
  return (
    <ToolLayout
      title="Markdown Editor"
      description="Write and preview Markdown with live rendering, syntax highlighting, and export options. Perfect for documentation and content creation."
      icon={<FileText className="w-12 h-12" />}
      category="Writing"
    >
      <MarkdownEditor />
    </ToolLayout>
  )
}

export default MarkdownEditorPage
