import { motion } from 'framer-motion'
import { Sparkles, Bot, Code, Palette } from 'lucide-react'
import { siteConfig } from '@/data/config'

const PricingCards = () => {
  return (
    <section className="section-padding">
      <div className="container-max">
        <div className="section-container p-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
          {/* Main Beta Badge */}
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-2xl px-8 py-6 mb-12">
            <Sparkles className="w-8 h-8 text-green-400" />
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                Free During Beta
              </h2>
              <p className="text-green-300/80 text-lg">
                All features are completely free while we're in beta
              </p>
            </div>
            <Sparkles className="w-8 h-8 text-green-400" />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card text-center"
            >
              <div className="p-4 bg-gradient-to-br from-wrapped-500/20 to-wrapped-600/20 rounded-xl w-fit mx-auto mb-4">
                <Bot className="w-8 h-8 text-wrapped-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Discord Bot</h3>
              <p className="text-gray-400">
                Full-featured Discord bot with moderation, analytics, and custom commands
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card text-center"
            >
              <div className="p-4 bg-gradient-to-br from-accent-500/20 to-accent-600/20 rounded-xl w-fit mx-auto mb-4">
                <Code className="w-8 h-8 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Developer Tools</h3>
              <p className="text-gray-400">
                Complete suite of web-based tools for developers and designers
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card text-center"
            >
              <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl w-fit mx-auto mb-4">
                <Palette className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Support</h3>
              <p className="text-gray-400">
                Priority support and feature requests during the beta period
              </p>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            <p className="text-xl text-gray-300">
              Get started today and help us shape the future of Wrapped
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a
                href={siteConfig.bot.inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-lg px-10 py-4"
              >
                Add Bot to Discord
              </a>
              <a
                href="/tools"
                className="btn-secondary text-lg px-10 py-4"
              >
                Explore Tools
              </a>
            </div>
          </motion.div>
        </motion.div>
        </div>
      </div>
    </section>
  )
}

export default PricingCards
