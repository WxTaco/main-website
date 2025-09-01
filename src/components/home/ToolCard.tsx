import { motion } from 'framer-motion'

interface Tool {
  icon: React.ReactNode
  title: string
  description: string
}

interface ToolCardProps {
  tool: Tool
  index: number
}

const ToolCard = ({ tool, index }: ToolCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="card card-hover text-center group"
    >
      <div className="p-4 bg-gradient-to-br from-accent-500/20 to-accent-600/20 rounded-xl w-fit mx-auto mb-6 group-hover:from-accent-500/30 group-hover:to-accent-600/30 transition-all duration-300">
        <div className="text-accent-400 group-hover:text-accent-300 transition-colors duration-300">
          {tool.icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-4 group-hover:text-accent-300 transition-colors duration-300">
        {tool.title}
      </h3>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
        {tool.description}
      </p>
    </motion.div>
  )
}

export default ToolCard
