import PageHeader from '@/components/ui/PageHeader'
import ToolsGrid from '@/components/tools/ToolsGrid'

const ToolsPage = () => {
  return (
    <div className="pt-16">
      <PageHeader
        title="Developer Tools"
        subtitle="A growing collection of web-based tools designed to streamline your development workflow"
        gradient="Developer Tools"
      />
      <ToolsGrid />
    </div>
  )
}

export default ToolsPage
