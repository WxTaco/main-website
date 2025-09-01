import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { siteConfig } from '@/data/config'

interface ToolLayoutProps {
  title: string
  description: string
  icon: React.ReactNode
  children: React.ReactNode
  category?: string
}

const ToolLayout = ({ title, description, icon, children, category }: ToolLayoutProps) => {
  return (
    <div className="min-h-screen pt-20">
      <div className="container-max section-padding">
        <div className="section-container p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
          {/* Back Button */}
          <Link 
            to="/tools" 
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tools</span>
          </Link>

          {/* Tool Header */}
          <div className="flex items-start space-x-6">
            <div className="p-4 bg-gradient-to-br from-accent-500/20 to-accent-600/20 rounded-2xl">
              <div className="text-accent-400 w-12 h-12 flex items-center justify-center">
                {icon}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                {category && (
                  <span className="text-xs font-medium text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">
                    {category}
                  </span>
                )}
                <div className="flex items-center space-x-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Available</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="gradient-text-blue">{title}</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tool Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {children}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="card max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-3">Found this tool helpful?</h3>
            <p className="text-gray-400 mb-6">
              Check out our other developer tools or add our Discord bot to your server.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link to="/tools" className="btn-secondary">
                Explore More Tools
              </Link>
              <a
                href={siteConfig.bot.inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center space-x-2"
              >
                <span>Add Discord Bot</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ToolLayout
