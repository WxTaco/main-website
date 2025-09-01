import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import FeatureCard from './FeatureCard'
import { featuresData } from '@/data/features'

const FeaturesSection = () => {
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
            Essential <span className="gradient-text">Discord</span> features
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Core server management tools to help your community thrive.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/features" className="btn-primary inline-flex items-center space-x-2">
            <span>Explore All Features</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
