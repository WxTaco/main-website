import { useState } from 'react'
import { motion } from 'framer-motion'
import EnhancedToolCard from './EnhancedToolCard'
import ToolFilters from './ToolFilters'
import { toolsData, toolCategories } from '@/data/tools'

const ToolsGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTools = toolsData.filter(tool => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section className="section-padding">
      <div className="container-max">
        <div className="section-container p-8">
          <ToolFilters
            categories={toolCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
          {filteredTools.map((tool, index) => (
            <EnhancedToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </motion.div>

          {filteredTools.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-gray-400 text-lg">No tools found matching your criteria.</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ToolsGrid
