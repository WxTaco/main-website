import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import FeaturesPage from './pages/FeaturesPage'
import ToolsPage from './pages/ToolsPage'
import PricingPage from './pages/PricingPage'
import DocsPage from './pages/DocsPage'
import AboutPage from './pages/AboutPage'
import ThemePage from './pages/ThemePage'
import ComingSoonPage from './pages/ComingSoonPage'

// Tool Pages
import JSONDebuggerPage from './pages/tools/JSONDebuggerPage'
import ColorPalettePage from './pages/tools/ColorPalettePage'
import MarkdownEditorPage from './pages/tools/MarkdownEditorPage'
import CSSGeneratorPage from './pages/tools/CSSGeneratorPage'
import HashGeneratorPage from './pages/tools/HashGeneratorPage'
import QRGeneratorPage from './pages/tools/QRGeneratorPage'
import UnitConverterPage from './pages/tools/UnitConverterPage'
import TimestampConverterPage from './pages/tools/TimestampConverterPage'

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Navbar />

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/themes" element={<ThemePage />} />
            <Route path="/coming-soon" element={<ComingSoonPage />} />

            {/* Tool Routes */}
            <Route path="/tools/json-debugger" element={<JSONDebuggerPage />} />
            <Route path="/tools/color-palette" element={<ColorPalettePage />} />
            <Route path="/tools/markdown-editor" element={<MarkdownEditorPage />} />
            <Route path="/tools/css-generator" element={<CSSGeneratorPage />} />
            <Route path="/tools/hash-generator" element={<HashGeneratorPage />} />
            <Route path="/tools/qr-generator" element={<QRGeneratorPage />} />
            <Route path="/tools/unit-converter" element={<UnitConverterPage />} />
            <Route path="/tools/timestamp-converter" element={<TimestampConverterPage />} />
          </Routes>
        </motion.main>

        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
