import FeatureCard from '@/components/home/FeatureCard'
import { featuresData } from '@/data/features'

const FeatureGrid = () => {
  return (
    <section className="section-padding bg-gray-950">
      <div className="container-max">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureGrid
