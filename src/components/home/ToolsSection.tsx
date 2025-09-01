import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ToolCard from './ToolCard'
import { toolsData } from '@/data/tools'

const ToolsSection = () => {
  return (
    <section className="section-padding">
      <div className="container-max">
        <div className="section-container p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="gradient-text">Developer Tools</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Free web-based tools to help with your development projects.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {toolsData.slice(0, 3).map((tool, index) => (
            <ToolCard key={tool.title} tool={tool} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/tools" className="btn-secondary inline-flex items-center space-x-2">
            <span>View All Tools</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ToolsSection
