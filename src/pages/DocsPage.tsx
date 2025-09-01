import PageHeader from '@/components/ui/PageHeader'
import DocsContent from '@/components/docs/DocsContent'

const DocsPage = () => {
  return (
    <div className="pt-16">
      <PageHeader
        title="Documentation"
        subtitle="Learn how to get the most out of Wrapped for your Discord server"
        gradient="Documentation"
      />
      <DocsContent />
    </div>
  )
}

export default DocsPage
