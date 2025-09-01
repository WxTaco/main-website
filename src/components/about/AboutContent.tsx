import { motion } from 'framer-motion'
import { BarChart3, Zap, Shield, Mail, User, HeadphonesIcon } from 'lucide-react'

const AboutContent = () => {
  const values = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Deep Analytics',
      description: 'Comprehensive insights into your community activity, growth patterns, and member engagement to make data-driven decisions.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Smart Automation',
      description: 'Intelligent automation tools that handle routine tasks, so you can focus on building and growing your community.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Full Control',
      description: 'Complete transparency and control over your community data, with powerful tools to manage every aspect of your server.'
    }
  ]

  return (
    <section className="section-padding bg-gray-950">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Vision</h2>
            <p className="text-gray-300 mb-6">
              Wrapped is building the ultimate analytics and automation platform for Discord communities.
              We believe server owners and administrators should have complete control and deep insights
              into their communities, not just basic moderation tools.
            </p>
            <p className="text-gray-300">
              Our platform combines powerful community analytics, intelligent automation, and essential
              developer tools to give you everything needed to understand, grow, and manage your community
              with precision and confidence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card"
          >
            <h3 className="text-2xl font-bold mb-4">By the Numbers</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-wrapped-400 mb-2">10K+</div>
                <div className="text-gray-400">Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-wrapped-400 mb-2">10K+</div>
                <div className="text-gray-400">Messages Tracked/Day</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-wrapped-400 mb-2">99.4%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-wrapped-400 mb-2">22+</div>
                <div className="text-gray-400">Tools Available</div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Values</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The principles that guide everything we do at Wrapped.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <div className="p-4 bg-wrapped-500/20 rounded-lg w-fit mx-auto mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
              <p className="text-gray-300">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
            Have questions, feedback, or need support? We're here to help.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <div className="p-4 bg-wrapped-500/20 rounded-lg w-fit mx-auto mb-4">
                <User className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Founder</h3>
              <p className="text-gray-300 mb-4">Questions about the platform or partnerships</p>
              <a
                href="mailto:taco@wrapped.site"
                className="text-wrapped-400 hover:text-wrapped-300 transition-colors font-medium"
              >
                taco@wrapped.site
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <div className="p-4 bg-wrapped-500/20 rounded-lg w-fit mx-auto mb-4">
                <HeadphonesIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Support</h3>
              <p className="text-gray-300 mb-4">Technical support and general inquiries</p>
              <a
                href="mailto:support@wrapped.site"
                className="text-wrapped-400 hover:text-wrapped-300 transition-colors font-medium"
              >
                support@wrapped.site
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <div className="p-4 bg-wrapped-500/20 rounded-lg w-fit mx-auto mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Privacy</h3>
              <p className="text-gray-300 mb-4">Privacy concerns and data requests</p>
              <a
                href="mailto:privacy@wrapped.site"
                className="text-wrapped-400 hover:text-wrapped-300 transition-colors font-medium"
              >
                privacy@wrapped.site
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutContent
