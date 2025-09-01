import {
  Code,
  Palette,
  FileText,
  Image,
  Database,
  Wrench,
  Hash,
  Link,
  QrCode,
  Calculator,
  Clock,
  Zap
} from 'lucide-react'

export const toolsData = [
  {
    id: 'json-debugger',
    icon: <Code className="w-6 h-6" />,
    title: "JSON Debugger",
    description: "Validate, format, and debug JSON with syntax highlighting and error detection.",
    category: "Development",
    status: "available" as const,
    features: ["Syntax validation", "Pretty formatting", "Error highlighting", "Minification"]
  },
  {
    id: 'color-palette',
    icon: <Palette className="w-6 h-6" />,
    title: "Color Palette Generator",
    description: "Generate beautiful, accessible color palettes for your design projects.",
    category: "Design",
    status: "available" as const,
    features: ["Multiple algorithms", "Accessibility check", "Export formats", "Color harmony"]
  },
  {
    id: 'markdown-editor',
    icon: <FileText className="w-6 h-6" />,
    title: "Markdown Editor",
    description: "Write and preview Markdown with live rendering and export options.",
    category: "Writing",
    status: "available" as const,
    features: ["Live preview", "Syntax highlighting", "Export to HTML", "Table support"]
  },
  {
    id: 'image-optimizer',
    icon: <Image className="w-6 h-6" />,
    title: "Image Optimizer",
    description: "Compress and optimize images for web with quality preservation.",
    category: "Media",
    status: "coming-soon" as const,
    features: ["Multiple formats", "Quality control", "Batch processing", "Size comparison"]
  },
  {
    id: 'api-tester',
    icon: <Database className="w-6 h-6" />,
    title: "API Tester",
    description: "Test REST APIs with request building and response analysis.",
    category: "Development",
    status: "coming-soon" as const,
    features: ["Request builder", "Authentication", "Response viewer", "History"]
  },
  {
    id: 'css-generator',
    icon: <Wrench className="w-6 h-6" />,
    title: "CSS Generator",
    description: "Generate CSS code for gradients, shadows, animations, and more.",
    category: "Development",
    status: "available" as const,
    features: ["Visual editor", "Live preview", "Copy to clipboard", "CSS3 support"]
  },
  {
    id: 'hash-generator',
    icon: <Hash className="w-6 h-6" />,
    title: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256 and other hash values for text and files.",
    category: "Security",
    status: "available" as const,
    features: ["Multiple algorithms", "File hashing", "Comparison tool", "Batch processing"]
  },
  {
    id: 'url-shortener',
    icon: <Link className="w-6 h-6" />,
    title: "URL Shortener",
    description: "Create short, trackable links with analytics and custom domains.",
    category: "Utility",
    status: "coming-soon" as const,
    features: ["Custom domains", "Click analytics", "QR codes", "Expiration dates"]
  },
  {
    id: 'qr-generator',
    icon: <QrCode className="w-6 h-6" />,
    title: "QR Code Generator",
    description: "Generate customizable QR codes for URLs, text, and contact information.",
    category: "Utility",
    status: "available" as const,
    features: ["Custom styling", "Logo embedding", "Multiple formats", "Batch generation"]
  },
  {
    id: 'unit-converter',
    icon: <Calculator className="w-6 h-6" />,
    title: "Unit Converter",
    description: "Convert between different units of measurement with precision.",
    category: "Utility",
    status: "available" as const,
    features: ["Multiple categories", "Precision control", "History", "Favorites"]
  },
  {
    id: 'timestamp-converter',
    icon: <Clock className="w-6 h-6" />,
    title: "Timestamp Converter",
    description: "Convert between Unix timestamps and human-readable dates.",
    category: "Development",
    status: "available" as const,
    features: ["Multiple formats", "Timezone support", "Batch conversion", "Current time"]
  },
  {
    id: 'regex-tester',
    icon: <Zap className="w-6 h-6" />,
    title: "Regex Tester",
    description: "Test and debug regular expressions with real-time matching.",
    category: "Development",
    status: "coming-soon" as const,
    features: ["Live testing", "Match highlighting", "Explanation", "Common patterns"]
  }
]

export const toolCategories = [
  "All",
  "Development",
  "Design",
  "Writing",
  "Media",
  "Security",
  "Utility"
]
