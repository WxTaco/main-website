import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Download, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'

const JSONDebugger = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setError('')
      setIsValid(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      setOutput('')
      setIsValid(false)
    }
  }

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError('')
      setIsValid(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      setOutput('')
      setIsValid(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
  }

  const downloadJSON = () => {
    const blob = new Blob([output], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
    setIsValid(null)
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Input JSON</h3>
            <div className="flex items-center space-x-2">
              {isValid !== null && (
                <div className={`flex items-center space-x-1 ${isValid ? 'text-green-400' : 'text-red-400'}`}>
                  {isValid ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span className="text-sm">{isValid ? 'Valid' : 'Invalid'}</span>
                </div>
              )}
            </div>
          </div>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="w-full h-64 bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 text-white font-mono text-sm resize-none focus:outline-none focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20"
          />

          <div className="flex flex-wrap gap-3 mt-4">
            <button onClick={formatJSON} className="btn-primary">
              Format
            </button>
            <button onClick={minifyJSON} className="btn-secondary">
              Minify
            </button>
            <button onClick={clearAll} className="btn-secondary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear
            </button>
          </div>
        </motion.div>

        {/* Output Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Output</h3>
            {output && (
              <div className="flex items-center space-x-2">
                <button onClick={copyToClipboard} className="btn-secondary p-2">
                  <Copy className="w-4 h-4" />
                </button>
                <button onClick={downloadJSON} className="btn-secondary p-2">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-400 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">JSON Error</span>
              </div>
              <p className="text-red-300 text-sm font-mono">{error}</p>
            </div>
          ) : (
            <textarea
              value={output}
              readOnly
              placeholder="Formatted JSON will appear here..."
              className="w-full h-64 bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 text-white font-mono text-sm resize-none"
            />
          )}
        </motion.div>
      </div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-16"
      >
        <h3 className="text-2xl font-bold text-center mb-8">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            'Real-time validation',
            'Pretty formatting',
            'JSON minification',
            'Error highlighting'
          ].map((feature) => (
            <div key={feature} className="card text-center">
              <p className="text-gray-300">{feature}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default JSONDebugger
