import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ExternalLink, Clock, CheckCircle } from 'lucide-react'

interface Tool {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  category: string
  status: 'available' | 'coming-soon'
  features: string[]
}

interface EnhancedToolCardProps {
  tool: Tool
  index: number
}

const EnhancedToolCard = ({ tool, index }: EnhancedToolCardProps) => {
  const isAvailable = tool.status === 'available'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className={`card group relative overflow-hidden ${
        isAvailable ? 'card-interactive' : 'opacity-75'
      }`}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        {isAvailable ? (
          <div className="flex items-center space-x-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            <span>Available</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            <span>Coming Soon</span>
          </div>
        )}
      </div>

      {/* Category Tag */}
      <div className="mb-4">
        <span className="text-xs font-medium text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">
          {tool.category}
        </span>
      </div>

      {/* Icon */}
      <div className="p-4 bg-gradient-to-br from-accent-500/20 to-accent-600/20 rounded-xl w-fit mb-6 group-hover:from-accent-500/30 group-hover:to-accent-600/30 transition-all duration-300">
        <div className="text-accent-400 group-hover:text-accent-300 transition-colors duration-300">
          {tool.icon}
        </div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-3 group-hover:text-accent-300 transition-colors duration-300">
        {tool.title}
      </h3>
      
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed mb-6">
        {tool.description}
      </p>

      {/* Features */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Features:</h4>
        <div className="flex flex-wrap gap-2">
          {tool.features.slice(0, 3).map((feature, idx) => (
            <span
              key={idx}
              className="text-xs bg-gray-800/50 text-gray-400 px-2 py-1 rounded-full"
            >
              {feature}
            </span>
          ))}
          {tool.features.length > 3 && (
            <span className="text-xs bg-gray-800/50 text-gray-400 px-2 py-1 rounded-full">
              +{tool.features.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-auto">
        {isAvailable ? (
          <Link
            to={`/tools/${tool.id}`}
            className="w-full btn-outline flex items-center justify-center space-x-2 group-hover:bg-accent-500 group-hover:border-accent-500 group-hover:text-white"
          >
            <span>Try Tool</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        ) : (
          <button 
            disabled 
            className="w-full bg-gray-800/50 text-gray-500 font-semibold py-3 px-6 rounded-xl cursor-not-allowed"
          >
            Coming Soon
          </button>
        )}
      </div>

      {/* Hover Overlay */}
      {isAvailable && (
        <div className="absolute inset-0 bg-gradient-to-t from-accent-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </motion.div>
  )
}

export default EnhancedToolCard
