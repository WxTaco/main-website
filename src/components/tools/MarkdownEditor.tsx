import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Download, Eye, Edit, FileText } from 'lucide-react'

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Editor

## Features
- **Live preview** of your markdown
- *Italic* and **bold** text support
- \`Inline code\` and code blocks
- Lists and tables
- Links and images

### Code Example
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Table Example
| Feature | Status |
|---------|--------|
| Preview | ✅ |
| Export | ✅ |
| Syntax | ✅ |

> This is a blockquote example

[Learn more about Markdown](https://www.markdownguide.org/)`)

  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'split'>('split')

  const convertMarkdownToHtml = (md: string) => {
    // Simple markdown to HTML converter
    let html = md
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-white mb-3 mt-6">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mb-4 mt-8">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mb-6 mt-8">$1</h1>')

      // Text formatting
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic text-gray-300">$1</em>')
      .replace(/`([^`]*)`/gim, '<code class="bg-gray-800 text-accent-400 px-2 py-1 rounded text-sm font-mono">$1</code>')

      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre class="bg-gray-800 border border-gray-700 rounded-lg p-4 overflow-x-auto my-4"><code class="text-gray-300 font-mono text-sm">$2</code></pre>')

      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-accent-500 pl-4 py-2 my-4 text-gray-300 italic bg-gray-800/30">$1</blockquote>')

      // Links
      .replace(/\[([^\]]*)\]\(([^)]*)\)/gim, '<a href="$2" target="_blank" class="text-accent-400 hover:text-accent-300 underline">$1</a>')

      // Lists
      .replace(/^\- (.*$)/gim, '<li class="text-gray-300 mb-1">$1</li>')

      // Line breaks
      .replace(/\n\n/gim, '</p><p class="text-gray-300 mb-4">')
      .replace(/\n/gim, '<br>')

    // Wrap in paragraphs and handle lists
    html = '<p class="text-gray-300 mb-4">' + html + '</p>'
    html = html.replace(/(<li.*?<\/li>)/gim, (match) => {
      return match.replace(/<\/?p[^>]*>/gim, '')
    })

    // Wrap consecutive list items in ul tags
    html = html.replace(/(<li.*?<\/li>)(\s*<li.*?<\/li>)*/gim, '<ul class="list-disc list-inside space-y-1 my-4">$&</ul>')

    return html
  }

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdown)
  }

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadHtml = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Markdown Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1, h2, h3 { color: #333; }
    code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
    pre { background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
    table { border-collapse: collapse; width: 100%; }
    td { border: 1px solid #ddd; padding: 8px; }
  </style>
</head>
<body>
${convertMarkdownToHtml(markdown)}
</body>
</html>`
    
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="card mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'edit' ? 'bg-accent-500 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <Edit className="w-4 h-4 mr-2 inline" />
              Edit
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'preview' ? 'bg-accent-500 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <Eye className="w-4 h-4 mr-2 inline" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab('split')}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'split' ? 'bg-accent-500 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <FileText className="w-4 h-4 mr-2 inline" />
              Split
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={copyMarkdown} className="btn-secondary p-2">
              <Copy className="w-4 h-4" />
            </button>
            <button onClick={downloadMarkdown} className="btn-secondary p-2">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={downloadHtml} className="btn-primary px-4 py-2">
              Export HTML
            </button>
          </div>
        </div>
      </motion.div>

      {/* Editor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="card"
      >
        <div className={`grid gap-6 ${activeTab === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Editor Panel */}
          {(activeTab === 'edit' || activeTab === 'split') && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Markdown Editor</h3>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Start writing your markdown here..."
                className="w-full h-96 bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 text-white font-mono text-sm resize-none focus:outline-none focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20"
              />
            </div>
          )}

          {/* Preview Panel */}
          {(activeTab === 'preview' || activeTab === 'split') && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
              <div
                className="w-full h-96 bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(markdown) }}
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Reference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-8"
      >
        <h3 className="text-xl font-semibold mb-6 text-center">Markdown Quick Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { syntax: '# Heading 1', description: 'Large heading' },
            { syntax: '## Heading 2', description: 'Medium heading' },
            { syntax: '**bold text**', description: 'Bold text' },
            { syntax: '*italic text*', description: 'Italic text' },
            { syntax: '`code`', description: 'Inline code' },
            { syntax: '[link](url)', description: 'Hyperlink' }
          ].map((item, index) => (
            <div key={index} className="card">
              <code className="text-accent-400 text-sm">{item.syntax}</code>
              <p className="text-gray-400 text-sm mt-2">{item.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default MarkdownEditor
