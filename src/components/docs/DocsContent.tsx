import { motion } from 'framer-motion'
import { Book, Code, Zap, Shield } from 'lucide-react'

const DocsContent = () => {
  const docSections = [
    {
      icon: <Book className="w-6 h-6" />,
      title: 'Getting Started',
      description: 'Learn how to add Wrapped to your server and configure basic settings.',
      link: '#getting-started'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Moderation',
      description: 'Set up moderation tools and auto-moderation features.',
      link: '#moderation'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Custom Commands',
      description: 'Create custom commands and automate server tasks.',
      link: '#commands'
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: 'API Reference',
      description: 'Integrate with Wrapped using our REST API.',
      link: '#api'
    }
  ]

  return (
    <section className="section-padding bg-gray-950">
      <div className="container-max">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {docSections.map((section, index) => (
            <motion.a
              key={section.title}
              href={section.link}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card card-hover block"
            >
              <div className="p-3 bg-wrapped-500/20 rounded-lg w-fit mb-4">
                {section.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
              <p className="text-gray-300">{section.description}</p>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="card max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
            <p className="text-gray-300 mb-6">
              Can't find what you're looking for? Join our support server for help from our community and team.
            </p>
            <a
              href="https://discord.gg/wrapped"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Join Support Server
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default DocsContent
