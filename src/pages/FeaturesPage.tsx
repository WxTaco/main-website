import PageHeader from '@/components/ui/PageHeader'
import FeatureGrid from '@/components/features/FeatureGrid'

const FeaturesPage = () => {
  return (
    <div className="pt-16">
      <PageHeader
        title="Powerful Features"
        subtitle="Everything you need to manage your Discord server and streamline your development workflow"
        gradient="Discord Bot"
      />
      <FeatureGrid />
    </div>
  )
}

export default FeaturesPage
