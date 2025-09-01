import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const ComingSoonPage = () => {
  return (
    <div className="min-h-screen pt-20">
      <div className="container-max section-padding">
        <div className="content-container max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Back Button */}
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            {/* Icon */}
            <div className="p-6 bg-gradient-to-br from-accent-500/20 to-accent-600/20 rounded-3xl w-fit mx-auto mb-8">
              <Clock className="w-16 h-16 text-accent-400" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Coming Soon</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              We're working hard to bring you this feature. Check back soon for updates!
            </p>

            {/* Features Preview */}
            <div className="bg-gray-800/30 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-accent-400" />
                <span className="text-lg font-semibold">What's Coming</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-400">
                <div>📚 Comprehensive Documentation</div>
                <div>🔧 API Reference</div>
                <div>🎯 Interactive Examples</div>
                <div>💡 Best Practices</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link to="/" className="btn-primary">
                Explore Tools
              </Link>
              <Link to="/about" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ComingSoonPage
