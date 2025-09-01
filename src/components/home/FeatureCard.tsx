import { motion } from 'framer-motion'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

interface FeatureCardProps {
  feature: Feature
  index: number
}

const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="card card-hover group"
    >
      <div className="p-4 bg-gradient-to-br from-wrapped-500/20 to-wrapped-600/20 rounded-xl w-fit mb-6 group-hover:from-wrapped-500/30 group-hover:to-wrapped-600/30 transition-all duration-300">
        <div className="text-wrapped-400 group-hover:text-wrapped-300 transition-colors duration-300">
          {feature.icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-4 group-hover:text-wrapped-300 transition-colors duration-300">
        {feature.title}
      </h3>
      <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  )
}

export default FeatureCard
