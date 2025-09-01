import PageHeader from '@/components/ui/PageHeader'
import AboutContent from '@/components/about/AboutContent'

const AboutPage = () => {
  return (
    <div className="pt-16">
      <PageHeader
        title="About Wrapped"
        subtitle="Learn more about our mission to empower Discord communities and developers"
        gradient="Wrapped"
      />
      <AboutContent />
    </div>
  )
}

export default AboutPage
