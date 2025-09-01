import { motion } from 'framer-motion'
import { Star, ExternalLink } from 'lucide-react'
import StatsGrid from './StatsGrid'

const HeroSection = () => {
  return (
    <section className="section-padding relative overflow-hidden min-h-screen flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-wrapped-500/10 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl floating-animation-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-wrapped-500/5 to-accent-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto content-container"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center space-x-2 mb-8"
          >
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-300 bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-700/50">
              Serving 10,000+ users
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
          >
            <span className="gradient-text">Discord Bot</span>
            <br />
            & <span className="gradient-text-blue">Developer Tools</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Powerful Discord bot with essential server management features, plus a growing collection of developer tools to help you build better projects.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
          >
            <a
              href="https://discord.com/oauth2/authorize?client_id=905201724539666503&permissions=8&scope=bot%20applications.commands"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-lg px-10 py-4 text-center min-w-[200px]"
            >
              Add to Discord
            </a>
            <a
              href="https://dash.wrapped.site"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-lg px-10 py-4 flex items-center space-x-2 min-w-[200px] justify-center"
            >
              <span>View Dashboard</span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </motion.div>
          
          <StatsGrid />
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
