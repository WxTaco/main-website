import { motion } from 'framer-motion'

interface PageHeaderProps {
  title: string
  subtitle: string
  gradient: string
}

const PageHeader = ({ title, subtitle, gradient }: PageHeaderProps) => {
  return (
    <section className="section-padding bg-gradient-hero">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {title.split(' ').map((word, index) => 
              word === gradient ? (
                <span key={index} className="gradient-text">{word}</span>
              ) : (
                <span key={index}>{word} </span>
              )
            )}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default PageHeader
