import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import ToolsSection from '@/components/home/ToolsSection'
import CTASection from '@/components/home/CTASection'

const HomePage = () => {
  return (
    <div className="pt-16">
      <HeroSection />
      <FeaturesSection />
      <ToolsSection />
      <CTASection />
    </div>
  )
}

export default HomePage
