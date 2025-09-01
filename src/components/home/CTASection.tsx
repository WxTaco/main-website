import { motion } from 'framer-motion'
import { siteConfig } from '@/data/config'

const CTASection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full blur-2xl" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.1 }}></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full blur-3xl" style={{ backgroundColor: 'var(--color-secondary)', opacity: 0.1 }}></div>
      </div>

      <div className="container-max relative z-10">
        <div className="content-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8 text-white"
          >
            Ready to get started?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Add our Discord bot to your server and explore our developer tools.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <a
              href={siteConfig.bot.inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-wrapped-600 hover:bg-gray-100 font-semibold py-4 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl min-w-[200px]"
            >
              Add to Discord
            </a>
            <a
              href="https://dash.wrapped.site"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-wrapped-600 font-semibold py-4 px-10 rounded-xl transition-all duration-300 hover:shadow-xl min-w-[200px]"
            >
              View Dashboard
            </a>
          </motion.div>
        </motion.div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
