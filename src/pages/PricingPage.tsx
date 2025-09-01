import PageHeader from '@/components/ui/PageHeader'
import PricingCards from '@/components/pricing/PricingCards'

const PricingPage = () => {
  return (
    <div className="pt-16">
      <PageHeader
        title="Simple Pricing"
        subtitle="Choose the plan that works best for your community"
        gradient="Pricing"
      />
      <PricingCards />
    </div>
  )
}

export default PricingPage
